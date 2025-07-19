import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with wallet signature' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid signature or user not found' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.walletAddress,
      loginDto.signature,
      loginDto.message,
    );
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user with wallet signature' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      {
        walletAddress: registerDto.walletAddress,
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        profileImage: registerDto.profileImage,
      },
      registerDto.signature,
      registerDto.message,
    );
  }
} 