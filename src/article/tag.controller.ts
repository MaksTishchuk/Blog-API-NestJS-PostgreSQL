import {Controller, Get, Param} from '@nestjs/common';
import {TagService} from "./tag.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Tag')
@Controller('tags')
export class TagController {

  constructor(
    private tagService: TagService
  ) {}

  @ApiOperation({summary: 'Get all tags'})
  @Get()
  async getAllTags() {
    const tags = await this.tagService.getAllTags()
    return {tags}
  }

  @ApiOperation({summary: 'Get articles by tag'})
  @Get(':id')
  async getArticlesByTag(@Param('id') id: number) {
    const articles = await this.tagService.getArticlesByTag(id)
    return {articles}
  }

}
