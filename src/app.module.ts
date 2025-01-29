import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the module globally available
    }),
    DatabaseModule,
    AuthModule,
    TaskModule],
    providers: [MailService],
    exports: [MailService]
})
export class AppModule {} // Module
