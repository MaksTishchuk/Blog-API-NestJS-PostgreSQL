import {IsArray, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateArticleDto {
  @ApiProperty({example: 'Title of the article', description: 'Title'})
  @IsString()
  title: string

  @ApiProperty({example: 'Body of the article', description: 'Body'})
  @IsString()
  body: string

  @ApiProperty({example: 'Description of the article', description: 'Description'})
  @IsString()
  description: string

  @ApiProperty({example: ["Tag", "List", "article"], description: 'Tag List'})
  @IsArray()
  @IsString({each: true})
  tagList: string[]
}