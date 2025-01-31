import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../enums/userRole.enum';


@Schema({ timestamps: true })//Whats wrong with you man
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Prop()
  resetPasswordToken?: string; // Token for password reset

  @Prop()
  resetPasswordExpires?: Date; // Token expiration time
}

export const UserSchema = SchemaFactory.createForClass(User);
