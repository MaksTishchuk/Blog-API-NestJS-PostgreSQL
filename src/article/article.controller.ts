import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {ArticleService} from "./article.service";
import {AuthGuard} from "@nestjs/passport";
import {UserDecorator} from "../auth/decorators/user.decorator";
import {UserEntity} from "../entities/user.entity";
import {CreateArticleDto} from "./dto/create-article.dto";
import {UpdateArticleDto} from "./dto/update-article.dto";
import {OptionalAuthGuard} from "../auth/optional-auth.guard";
import {FindAllArticlesQuery} from "./dto/find-all-query.interface";
import {CommentsService} from "./comments.service";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Article')
@Controller('articles')
export class ArticleController {

  constructor(
    private articleService: ArticleService,
    private commentService: CommentsService
  ) {}

  @ApiOperation({summary: 'Get all articles'})
  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAllArticles(@UserDecorator() user: UserEntity, @Query() query: FindAllArticlesQuery) {
    const articles = await this.articleService.findAllArticles()
    return {articleCount: articles.length, articles}
  }

  @ApiOperation({summary: 'Get article by slug'})
  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findArticleBySlug(@Param('slug') slug: string, @UserDecorator() user: UserEntity) {
    const article = await this.articleService.findArticleBySlug(slug)
    return {article: article.toArticle(user)}
  }

  @ApiOperation({summary: 'Create article'})
  @Post()
  @UseGuards(AuthGuard())
  async createArticle(@UserDecorator() user: UserEntity, @Body(ValidationPipe) data: CreateArticleDto) {
    const article = await this.articleService.createArticle(user, data)
    return {article}
  }

  @ApiOperation({summary: 'Update article'})
  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @UserDecorator() user: UserEntity,
    @Body(ValidationPipe) data: UpdateArticleDto
  ) {
    const article = await this.articleService.updateArticle(slug, user, data)
    return {article}
  }

  @ApiOperation({summary: 'Delete article'})
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param('slug') slug: string, @UserDecorator() user: UserEntity) {
    const article = await this.articleService.deleteArticle(slug, user)
    return article
  }

  @ApiOperation({summary: 'Find comments for article'})
  @Get('/:slug/comments')
  async findCommentsByArticleSlug(@Param('slug') slug: string) {
    const comments = await this.commentService.findCommentsByArticleSlug(slug)
    return {comments}
  }

  @ApiOperation({summary: 'Find comment by id'})
  @Get('/:slug/comments/:id')
  async findCommentById(@Param('id') id: number) {
    const comment = await this.commentService.findCommentById(id)
    return {comment}
  }

  @ApiOperation({summary: 'Create comment'})
  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @UserDecorator() user: UserEntity,
    @Param('slug') slug: string,
    @Body(ValidationPipe) data: CreateCommentDto
  ) {
    const comment = await this.commentService.createComment(user, slug, data)
    return {comment}
  }

  @ApiOperation({summary: 'Delete comment'})
  @Delete('/:slug/comments/:id')
  @UseGuards(AuthGuard())
  async deleteComment(@UserDecorator() user: UserEntity, @Param('id') id: number) {
    const comment = await this.commentService.deleteComment(user, id)
    return {comment}
  }

  @ApiOperation({summary: 'Add article to favorite'})
  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async addToFavoriteArticle(@UserDecorator() user: UserEntity, @Param('slug') slug: string) {
    const article = await this.articleService.addToFavoriteArticle(user, slug)
    return {article}
  }

  @ApiOperation({summary: 'Delete article from favorite'})
  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async deleteFromFavoriteArticle(@UserDecorator() user: UserEntity, @Param('slug') slug: string) {
    const article = await this.articleService.deleteFromFavoriteArticle(user, slug)
    return {article}
  }
}
