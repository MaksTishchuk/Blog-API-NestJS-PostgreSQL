import {Body, Controller, Get, Put, UseGuards, ValidationPipe} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDecorator} from "../auth/decorators/user.decorator";
import {AuthGuard} from "@nestjs/passport";
import {UserEntity} from "../entities/user.entity";
import {UpdateUserDto} from "./dto/update-user.dto";
import {AuthService} from "../auth/auth.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private authService: AuthService) {}

  @ApiOperation({summary: 'Find current user'})
  @Get()
  @UseGuards(AuthGuard())
  findCurrentUser(@UserDecorator() {username}: UserEntity) {
    return this.authService.findCurrentUser(username)
  }

  @ApiOperation({summary: 'Update current user'})
  @Put()
  @UseGuards(AuthGuard())
  updateCurrentUser(
    @UserDecorator() {username} : UserEntity,
    @Body(new ValidationPipe({transform: true, whitelist: true})) data : {user: UpdateUserDto}
  ) {
    return this.authService.updateCurrentUser(username, data.user)
  }
}
