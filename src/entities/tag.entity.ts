import {Column, Entity} from "typeorm";
import {AbstractEntity} from "./abstract-entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity('tags')
export class TagEntity extends AbstractEntity {

  @ApiProperty({example: 'tag 1', description: 'Tag'})
  @Column()
  tag: string
}