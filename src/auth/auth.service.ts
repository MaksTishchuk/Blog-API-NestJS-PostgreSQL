import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import {LoginDto, RegisterDto} from "./dto/user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {UpdateUserDto} from "../user/dto/update-user.dto";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(credentials: RegisterDto) {
    try {
      const user = this.userRepository.create(credentials)
      await user.save()
      const payload = {id: user.id, email: user.email, username: user.username}
      const token = this.jwtService.sign(payload)
      return {user: {token, ...user.toJSON()}}
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username has already been taken!')
      }
      throw new InternalServerErrorException()
    }
  }

  async login(credentials: LoginDto) {
    try {
      const user = await this.userRepository.findOne({where: {email: credentials.email}})
      if (user && (await user.comparePassword(credentials.password))) {
        const payload = {id: user.id, email: user.email, username: user.username}
        const token = this.jwtService.sign(payload)
        return {user: {token, ...user.toJSON()}}
      }
      throw new UnauthorizedException('Invalid credentials')
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  async findCurrentUser(username: string) {
    const user = (await this.userRepository.findOne({where: {username}}))
    const payload = {id: user.id, email: user.email, username: user.username}
    const token = this.jwtService.sign(payload)
    return {user: {token, ...user.toJSON()}}
  }

  async updateCurrentUser(username: string, data: UpdateUserDto) {
    await this.userRepository.update({username}, data)
    const user = (await this.userRepository.findOne({where: {username}}))
    const payload = {id: user.id, email: user.email, username: user.username}
    const token = this.jwtService.sign(payload)
    return {user: {token, ...user.toJSON()}}
  }
}
