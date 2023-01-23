import {AbstractEntity} from "./abstract-entity";
import {BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {IsEmail} from "class-validator";
import {classToPlain, Exclude} from "class-transformer";
import * as bcryptjs from 'bcryptjs'
import {ArticleEntity} from "./article.entity";
import {CommentEntity} from "./comment.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity('users')
export class UserEntity extends AbstractEntity {

  @ApiProperty({example: 'email@gmail.com', description: 'Email'})
  @Column({unique: true})
  @IsEmail()
  email: string

  @ApiProperty({example: 'username', description: 'Username'})
  @Column({unique: true})
  username: string

  @ApiProperty({example: '123456789', description: 'Password'})
  @Column()
  @Exclude()
  password: string

  @ApiProperty({example: 'user biography', description: 'Biography'})
  @Column({default: ''})
  bio: string

  @Column({default: null, nullable: true})
  image: string | null

  @ManyToMany(
    type => UserEntity,
    user => user.userFollowed
  )
  @JoinTable()
  userFollowers: UserEntity[]

  @ManyToMany(
    type => UserEntity,
    user => user.userFollowers
  )
  userFollowed: UserEntity[]

  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[]

  @ManyToMany(type => ArticleEntity, article => article.favoriteBy)
  @JoinColumn()
  favorites: ArticleEntity[]

  @OneToMany(
    type => CommentEntity,
    comment => comment.author,
  )
  comments: CommentEntity[]


  @BeforeInsert()
  async hashPassword() {
    this.password = await bcryptjs.hash(this.password, 10)
  }

  async comparePassword(attemptPassword: string) {
    return await bcryptjs.compare(attemptPassword, this.password)
  }

  toJSON() {
    return classToPlain(this)
  }

  toProfile(user?: UserEntity) {
    let following = null
    if (user) {
      following = this.userFollowers.includes(user)
    }
    const profile: any = this.toJSON()
    delete profile.userFollowers
    return {...profile, following}
  }
}