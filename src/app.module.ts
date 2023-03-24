import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './strategies/google-strategy';
import {JwtModule} from '@nestjs/jwt'


@Module({
  imports:[JwtModule],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}