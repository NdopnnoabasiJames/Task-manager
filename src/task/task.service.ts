import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from 'src/Dtos/task.dto';
import { Task } from 'src/Schemas/task.schema';


@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, user: userId });
    return await newTask.save();
  }

  async getTasks(userId: string): Promise<Task[]> {
    return await this.taskModel.find({ user: userId }).populate('user', '-password').exec();
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await this.taskModel.findById(taskId);

    if (!task) throw new NotFoundException('Task not found');
    if (task.user.toString() !== userId) throw new UnauthorizedException('Not authorized to delete this task');

    await this.taskModel.findByIdAndDelete(taskId);
  }
}
