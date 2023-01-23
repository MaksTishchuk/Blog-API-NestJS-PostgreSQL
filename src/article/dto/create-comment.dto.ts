import {IsArray, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({example: 'Body of the comment', description: 'Body'})
  @IsString()
  body: string
}