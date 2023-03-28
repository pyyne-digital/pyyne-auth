import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AppController {
  private readonly serviceUrls = {
    service1: 'http://localhost:5000/',
    service2: 'http://localhost:7000/',
  };

  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    const token = this.appService.googleLogin(req);
    const user = {
      email: req.user.email,
      name: req.user.name,
      token: token,
    };
    // Redirect the user to the appropriate page based on the state parameter.
    const state = req.session.state;
    const serviceUrl = this.serviceUrls[state];
    console.log(serviceUrl);
    if (!serviceUrl) {
      return res.status(400).json({ message: 'Unknown state parameter' });
    }
    // Redirect the user to the appropriate service URL along with the user object
    //User object can be encrypted for better security purposes
    const userObject = Buffer.from(JSON.stringify(user)).toString('base64');
    const redirectUrl = `${serviceUrl}?user=${userObject}`;
    return res.redirect(redirectUrl);
  }
}
