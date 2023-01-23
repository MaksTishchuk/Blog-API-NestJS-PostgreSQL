import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto, RegisterDto} from "./dto/user.dto";
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

@ApiTags('Authentication')
@Controller('users')
export class AuthController {

  constructor(private authService: AuthService) {}

  @ApiOperation({summary: 'Register new user'})
  @Post('/register')
  @ApiCreatedResponse({description: 'User Registration'})
  register(@Body(ValidationPipe) credentials: RegisterDto) {
    return this.authService.register(credentials)
  }

  @ApiOperation({summary: 'Login user'})
  @Post('/login')
  @ApiCreatedResponse({description: 'User Login'})
  @ApiUnauthorizedResponse({description: 'Invalid credentials!'})
  login(@Body(ValidationPipe) credentials: LoginDto) {
    return this.authService.login(credentials)
  }

}
