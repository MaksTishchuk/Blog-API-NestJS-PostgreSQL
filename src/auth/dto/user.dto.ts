import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({example: 'username', description: 'Username'})
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @ApiProperty({example: 'email@gmail.com', description: 'Email'})
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({example: '123456789', description: 'Password'})
  @IsString()
  @MinLength(4)
  password: string
}

export class LoginDto {
  @ApiProperty({example: 'email@gmail.com', description: 'Email'})
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({example: '123456789', description: 'Password'})
  @IsString()
  @MinLength(4)
  password: string
}

export interface AuthPayload {
  id: number
  email: string
  username: string
}