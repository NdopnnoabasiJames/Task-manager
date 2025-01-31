import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // Allow only specified properties in the request body
    transform: true, // Automatically transform request body properties to their corresponding types
    forbidNonWhitelisted: true, // Throw an error if any non-whitelisted properties are found in the request body
  }));
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: [], // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies and authentication headers if needed
  });
  const port = process.env.PORT
  await app.listen(port,()=>console.log(`Server running successfully on Port ${port}`));
}
bootstrap();//Ommohh make this code run abeg
