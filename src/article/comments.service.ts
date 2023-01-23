import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "../entities/comment.entity";
import {Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {ArticleEntity} from "../entities/article.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  async findCommentsByArticleSlug(slug) {
    const article = await this.articleRepository.findOne({where: {slug: slug}, relations: ['comments']})
    return article.comments
  }

  findCommentById(id: number) {
    return this.commentRepository.findOne({where: {id}})
  }

  async createComment(user: UserEntity, slug: string, data: CreateCommentDto) {
    const comment = this.commentRepository.create(data)
    comment.author = user
    comment.article = await this.articleRepository.findOne({where: {slug}})
    await comment.save()
    return comment
  }

  async deleteComment(user: UserEntity, id: number) {
    const comment = await this.findCommentById(id)
    if (comment) {
      if (comment.author.id === user.id) {
        await comment.remove()
        return comment
      } else {
        throw new UnauthorizedException('You are not an author of this comment!')
      }
    }
    throw new NotFoundException('Comment was not found!')
  }
}
