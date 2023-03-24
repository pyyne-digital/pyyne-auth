import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor( private jwtService: JwtService) {}
  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return this.jwtService.sign({
      sub: req.user.googleId,
      email: req.user.email,
      name: req.user.name  
    },
    {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    },

  );
}}