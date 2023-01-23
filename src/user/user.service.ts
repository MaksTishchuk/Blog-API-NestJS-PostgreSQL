import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findCurrentUser(username: string, user?: UserEntity) {
    const found = (await this.userRepository.findOne({
      where: {username},
      relations: ['userFollowers']
    })).toProfile(user)
    return {found}
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepository.findOne({
      where: {username},
      relations: ['userFollowers']
    })
    user.userFollowers.push(currentUser)
    await user.save()
    return user.toProfile(currentUser)
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepository.findOne({
      where: {username},
      relations: ['userFollowers']
    })
    user.userFollowers = user.userFollowers.filter(follower => follower !== currentUser)
    await user.save()
    return user.toProfile(currentUser)
  }

}
