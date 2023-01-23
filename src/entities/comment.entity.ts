import {
  Column,
  Entity, ManyToOne
} from "typeorm";
import {AbstractEntity} from "./abstract-entity";
import {ArticleEntity} from "./article.entity";
import {UserEntity} from "./user.entity";
import {classToPlain} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @ApiProperty({example: 'Comment text', description: 'Body'})
  @Column()
  body: string

  @ManyToOne(
    type => UserEntity,
    user => user.comments,
    { eager: true },
  )
  author: UserEntity

  @ManyToOne(
    type => ArticleEntity,
    article => article.comments,
    { eager: true },
  )
  article: ArticleEntity

}