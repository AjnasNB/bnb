import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '0x742d35Cc6635C0532925a3b8D7C9d5D8fc3E5' })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ 
    example: '0x1234567890abcdef...',
    description: 'Wallet signature of the message' 
  })
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty({ 
    example: 'Register to ChainSureAI - Nonce: 123456',
    description: 'Message that was signed' 
  })
  @IsNotEmpty()
  @IsString()
  message: string;
} 