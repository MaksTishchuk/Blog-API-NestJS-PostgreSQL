import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {AuthPayload} from "./dto/user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  //AuthHeaderWithScheme('Token'),
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: AuthPayload) {
    const {email} = payload
    const user = this.userRepository.findOne({where: {email}})
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}