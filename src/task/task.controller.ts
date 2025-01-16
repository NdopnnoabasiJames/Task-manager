import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Patch,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/Dtos/task.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TaskStatus } from 'src/enums/taskStatus.enum';
import { Task } from 'src/Schemas/task.schema';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


  //Route to create a new task
  @Post('createTask')
  async createTask(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const userId = req.user.id; // Extract userId from the JWT payload

    return this.taskService.createTask(userId, createTaskDto);
  }

  //Route to get all user tasks
  @Get('getUserTasks')
  async getTasks(@Req() req) {
    const userId = req.user.id;
    return this.taskService.getTasks(userId);
  }

  // Route to delete a task by id
  @Delete('deleteTask/:id')
  async deleteTask(@Req() req, @Param('id') taskId: string) {
    const userId = req.user.id;
    return this.taskService.deleteTask(userId, taskId);
  }

  // Route to update task status
  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Get('GetTaskByStatus')
  async getTasksByStatus(
    @Query('status') status: TaskStatus,
    @Req() req: any, // Extract userId from the request
  ): Promise<Task[]> {
    const userId = req.user.userId; // Assume userId is extracted from the JWT
    return this.taskService.getTasksByStatus(userId, status);
  }
}
