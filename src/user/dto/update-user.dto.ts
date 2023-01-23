import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {

  @ApiProperty({example: 'username', description: 'Username'})
  @IsString()
  @IsOptional()
  username: string

  @ApiProperty({example: 'image url', description: 'Image'})
  @IsString()
  @IsOptional()
  image: string

  @ApiProperty({example: 'Biography of user', description: 'Biography'})
  @IsString()
  @IsOptional()
  bio: string
}