import {
  BadRequestException,
  Delete,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { UserRole } from 'src/enums/userRole.enum';
import { CreateUserDto } from 'src/Dtos/SignUp.dto';
import { LoginUserDto } from 'src/Dtos/Login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto){
    const { username, email, password } = createUserDto;

    // Check for duplicate entries
    const existingUser = await this.userModel.findOne({email});
    if (existingUser) {
      throw new BadRequestException('User with Email already exists');
    }
  
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return await {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }; // Exclude password from the returned object
  }
  
  async logIn(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto; // Destructure email and password from DTO
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user._id, role: user.role }; // Include necessary user details in payload
    const accessToken = await this.jwtService.sign(payload); // Sign the payload to create a token

    return {
        message: `${user.username} is logged in successfully`,
        access_token: accessToken,
      };
  }

}
