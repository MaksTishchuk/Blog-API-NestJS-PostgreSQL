import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDecorator} from "../auth/decorators/user.decorator";
import {UserEntity} from "../entities/user.entity";
import {AuthGuard} from "@nestjs/passport";
import {OptionalAuthGuard} from "../auth/optional-auth.guard";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {

  constructor(private userService: UserService) {}

  @ApiOperation({summary: 'Get user profile by username'})
  @Get("/:username")
  @UseGuards(new OptionalAuthGuard())
  async findProfile(
    @Param('username') username: string,
    @UserDecorator() user: UserEntity
    ) {
    const profile = await this.userService.findCurrentUser(username, user)
    if (profile) {
      return {profile}
    }
    throw new NotFoundException()
  }

  @ApiOperation({summary: 'Follow User'})
  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(@UserDecorator() currentUser: UserEntity, @Param('username') username: string) {
    const profile = await this.userService.followUser(currentUser, username)
    return {profile}
  }

  @ApiOperation({summary: 'Unfollow User'})
  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(@UserDecorator() currentUser: UserEntity, @Param('username') username: string) {
    const profile = await this.userService.unfollowUser(currentUser, username)
    return {profile}
  }

}
