import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ArticleEntity} from "../entities/article.entity";
import {UserEntity} from "../entities/user.entity";
import {AuthModule} from "../auth/auth.module";
import { CommentsService } from './comments.service';
import {CommentEntity} from "../entities/comment.entity";
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import {TagEntity} from "../entities/tag.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity, TagEntity]),
    AuthModule
  ],
  providers: [ArticleService, CommentsService, TagService],
  controllers: [ArticleController, TagController]
})
export class ArticleModule {}
