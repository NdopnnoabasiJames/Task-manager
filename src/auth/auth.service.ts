import {
  BadRequestException,
  Delete,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserRole } from 'src/enums/userRole.enum';
import { CreateUserDto } from 'src/Dtos/SignUp.dto';
import { LoginUserDto } from 'src/Dtos/Login.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailService, // Inject mail service
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

  //Logic to generate the reset token for forgotten password
  async generateResetToken(email: string): Promise<void> {

    if (!email) throw new BadRequestException('No email provided');
    // Check if the user exists
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate a token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send the reset link to the user's email
    await this.mailService.sendResetToken(email, token); // Send email
  }

  //Logic to reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token && !newPassword) {
      throw new BadRequestException('Token or password not provided');
    }
    // Find user by token and ensure it's not expired
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Ensure the token is not expired
    });
  
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  
    const saltRounds = 10;
    // Hash the new password

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
    user.password = hashedPassword; //Assign the hashedpassword to the users password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
  
    await user.save();
  }
  
}
