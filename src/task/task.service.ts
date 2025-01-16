import { Query, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateTaskDto } from 'src/Dtos/task.dto';
import { TaskStatus } from 'src/enums/taskStatus.enum';
import { Task } from 'src/Schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {}

  //Logic to create new task for a user.
  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, user: userId });
    return await newTask.save();
  }
  
  //Logic to get all user tasks
  async getTasks(userId: string): Promise<Task[]> {
    const userTasks = await this.taskModel.find({ user: userId }).populate('user', '_id').exec();
    if (userTasks.length === 0) throw new NotFoundException('User has no tasks');
    return userTasks;
  }

  //Logic to delete task
  async deleteTask(userId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId);

    if (!task) throw new NotFoundException('Task not found');
    if (task.user.toString() !== userId) throw new UnauthorizedException('Task does not belong to this user therefore not authorized to delete this task.');

    await this.taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };

  }


  //Logic to update task Status
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    if (!isValidObjectId(taskId)) throw new NotFoundException('Task with this id not found');
    if (!Object.values(TaskStatus).includes(status)) {
      throw new BadRequestException(`Invalid status value: ${status}`);
    } 

    const task = await this.taskModel.findById(taskId);

    if (!task) throw new NotFoundException('Task not found');

    task.status = status;
    return await task.save();
  }

  //Logic to get tasks by status
  async getTasksByStatus(userId: string, status?: TaskStatus): Promise<Task[]> {
    const query: any = { user: userId };

    if (status) {
      query.status = status;
    }

    return this.taskModel.find(query).exec();
  }

}
