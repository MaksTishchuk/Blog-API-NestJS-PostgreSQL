import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn, JoinTable,
  ManyToMany,
  ManyToOne, OneToMany,
  RelationCount
} from "typeorm";
import {AbstractEntity} from "./abstract-entity";
import * as slugify from "slug";
import {UserEntity} from "./user.entity";
import {classToPlain} from "class-transformer";
import {CommentEntity} from "./comment.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string

  @ApiProperty({example: 'Title of article', description: 'Title'})
  @Column()
  title: string

  @ApiProperty({example: 'Description of article', description: 'Description'})
  @Column()
  description: string

  @ApiProperty({example: 'Body of article', description: 'Body'})
  @Column()
  body: string

  @ManyToMany(
    type => UserEntity,
    user => user.favorites,
    {eager: true}
  )
  @JoinTable()
  favoriteBy: UserEntity[]

  @RelationCount((article: ArticleEntity) => article.favoriteBy )
  favoritesCount: number

  @ManyToOne(
    type => UserEntity,
    user => user.articles,
    {eager: true}
  )
  author: UserEntity

  @OneToMany(
    type => CommentEntity,
    comment => comment.article,
  )
  comments: CommentEntity[]

  @ApiProperty({example: '["tag1", "tag2", "tag3"]', description: 'Tag List'})
  @Column('simple-array')
  tagList: string[]

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.title, {lower: true}) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  }

  toJSON() {
    return classToPlain(this)
  }

  toArticle(user: UserEntity) {
    let favorited = null
    if (user) {
      favorited = this.favoriteBy.map(user => user.id).includes(user.id)
    }
    const article: any = this.toJSON()
    delete article.favoriteBy
    return {...article, favorited}
  }
}