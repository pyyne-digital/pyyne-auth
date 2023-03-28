import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import {
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  callbackURL: any;
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails[0].value,
      name: `${name.givenName}` + ' ' + `${name.familyName}`,
      id: id,
    };
    done(null, user);
  }
  async authenticate(@Req() req: any, options?: any): Promise<any> {
    const state = req.query.state || req.session.state;;
    req.session.state = state;
    console.log(`authenticate: ${state}`);
    if (!state) {
      throw new UnauthorizedException('State parameter missing.');
    }

    const originalCallbackUrl = this.callbackURL;
    this.callbackURL = `${this.callbackURL}?state=${state}`;

    try {
      return super.authenticate(req, options);
    } finally {
      this.callbackURL = originalCallbackUrl;
    }
  }
}
