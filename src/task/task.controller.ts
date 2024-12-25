import { Controller, Post, Body, Get, Delete, Param, UseGuards, Req, UnauthorizedException, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/Dtos/task.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TaskStatus } from 'src/enums/taskStatus.enum';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post('createTask')
  async createTask(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    if (!req.user || !req.user.id) {
        throw new UnauthorizedException('User is not authenticated');
      }
    const userId = req.user.id; // Extract userId from the JWT payload

    return this.taskService.createTask(userId, createTaskDto);
  }

  @UseGuards(AuthGuard)
  @Get('getTasks')
  async getTasks(@Req() req) {
    const userId = req.user.id;
    return this.taskService.getTasks(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTask(@Req() req, @Param('id') taskId: string) {
    const userId = req.user.id;
    return this.taskService.deleteTask(userId, taskId);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.taskService.updateTaskStatus(id, status);
  }
}
