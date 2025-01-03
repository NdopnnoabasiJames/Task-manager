import { Query, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateTaskDto } from 'src/Dtos/task.dto';
import { TaskStatus } from 'src/enums/taskStatus.enum';
import { Task } from 'src/Schemas/task.schema';
// import { Query } from '@nestjs/common';


@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, user: userId });
    return await newTask.save();
  }

  async getTasks(userId: string): Promise<Task[]> {
    return await this.taskModel.find({ user: userId }).populate('user', '_id').exec();
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await this.taskModel.findById(taskId);

    if (!task) throw new NotFoundException('Task not found');
    if (task.user.toString() !== userId) throw new UnauthorizedException('Not authorized to delete this task');

    await this.taskModel.findByIdAndDelete(taskId);
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



async getAllUserTasks(@Query() query: any, userId: string): Promise<Task[]> {
  const { status, title, startDate, endDate } = query;

  // Build a dynamic filter object
  const filter: any = { user: userId }; // Ensure only tasks for the logged-in user are fetched

  if (status) {
    filter.status = status; // Match the exact status
  }

  if (title) {
    filter.title = { $regex: title, $options: 'i' }; // Partial match, case-insensitive
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate); // Start date filter
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate); // End date filter
    }
  }

  // Fetch tasks based on the filter
  return this.taskModel.find(filter).exec();
}

}
