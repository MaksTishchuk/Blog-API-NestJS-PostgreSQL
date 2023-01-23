import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from "../entities/user.entity";
import {AuthModule} from "../auth/auth.module";
import {ProfileController} from "./profile.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
  ],
  providers: [UserService],
  controllers: [UserController, ProfileController]
})
export class UserModule {}
