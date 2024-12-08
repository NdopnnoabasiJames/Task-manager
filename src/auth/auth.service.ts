import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async signUp(payload:CreateUserDto): Promise<User> {
    const {username, email, password} = payload
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, email, password: hashedPassword });
    return newUser.save();
  }

  async logIn(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto; // Destructure email and password from DTO

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user._id, role: user.role }; // Include necessary user details in payload
    const accessToken = this.jwtService.sign(payload); // Sign the payload to create a token
    return { accessToken };
  }

}
