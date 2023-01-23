import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ArticleEntity} from "../entities/article.entity";
import {Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";
import {CreateArticleDto} from "./dto/create-article.dto";
import {UpdateArticleDto} from "./dto/update-article.dto";
import {TagEntity} from "../entities/tag.entity";

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>
  ) {}

  private async upsertTags(tagList: string[]) {
    const foundTags = await this.tagRepository.find({where: tagList.map(t => ({tag: t}))})
    const newTags = tagList.filter(t => !foundTags.map(t => t.tag).includes(t))
    for (const tag in newTags) {
      const newTag = await this.tagRepository.create({tag: newTags[tag]})
      await newTag.save()
    }
  }

  findAllArticles() {
    return this.articleRepository.find()
  }

  findArticleBySlug(slug: string) {
    return this.articleRepository.findOne({where: {slug}})
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id
  }

  async createArticle(user: UserEntity, data: CreateArticleDto) {
    const article = this.articleRepository.create(data)
    article.author = user
    await this.upsertTags(data.tagList)
    const {slug} = await article.save()
    return (await this.articleRepository.findOne({where: {slug}})).toArticle(user)
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDto) {
    const article = await this.findArticleBySlug(slug)
    if (this.ensureOwnership(user, article)) {
      await this.articleRepository.update({slug}, data)
      return article.toArticle(user)
    }
    throw new UnauthorizedException('You are not an author of this article!')
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findArticleBySlug(slug)
    if (this.ensureOwnership(user, article)) {
      await this.articleRepository.remove(article)
    }
    throw new UnauthorizedException('You are not an author of this article!')
  }

  async addToFavoriteArticle(user: UserEntity, slug: string) {
    const article = await this.findArticleBySlug(slug)
    article.favoriteBy.push(user)
    await article.save()
    return (await this.findArticleBySlug(slug)).toArticle(user)
  }

  async deleteFromFavoriteArticle(user: UserEntity, slug: string) {
    const article = await this.findArticleBySlug(slug)
    article.favoriteBy = article.favoriteBy.filter(fav => fav.id !== user.id)
    await article.save()
    return (await this.findArticleBySlug(slug)).toArticle(user)
  }

}
