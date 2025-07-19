import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '0x742d35Cc6635C0532925a3b8D7C9d5D8fc3E5' })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({ 
    example: '0x1234567890abcdef...',
    description: 'Wallet signature of the message' 
  })
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty({ 
    example: 'Login to ChainSureAI - Nonce: 123456',
    description: 'Message that was signed' 
  })
  @IsNotEmpty()
  @IsString()
  message: string;
} 