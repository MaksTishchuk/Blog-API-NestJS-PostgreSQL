import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TagEntity} from "../entities/tag.entity";
import {Repository} from "typeorm";
import {ArticleEntity} from "../entities/article.entity";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
    @InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>
  ) {}

  async getAllTags() {
    return await this.tagRepository.find()
  }

  async getArticlesByTag(id) {
    const tag = (await this.tagRepository.findOne({where: {id}})).tag
    const articles = await this.articleRepository.find()
    const filteredArticles = []
    for (const i in articles) {
      if (articles[i].tagList.includes(tag)) {
        filteredArticles.push(articles[i])
      }
    }
    return filteredArticles
  }

}
