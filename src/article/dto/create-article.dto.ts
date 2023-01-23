import {IsArray, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateArticleDto {
  @ApiProperty({example: 'title of the article', description: 'Title'})
  @IsString()
  @IsOptional()
  title: string

  @ApiProperty({example: 'Body of the article', description: 'Body'})
  @IsString()
  @IsOptional()
  body: string

  @ApiProperty({example: 'Description of the article', description: 'Description'})
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({example: ["Tag", "List", "article"], description: 'Tag List'})
  @IsArray()
  @IsString({each: true})
  @IsOptional()
  tagList: string[]
}