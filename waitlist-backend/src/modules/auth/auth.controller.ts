import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { LoginDto } from './dto/login.dto';
import { SocialAuthDto } from './dto/social-auth.dto';
import { LinkProviderDto } from './dto/link-provider.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Google OAuth routes
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req: any, @Res() res: any) {
    // Handle successful Google OAuth callback
    const user = await this.authService.handleOAuthLogin(req.user, 'google');
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/success?token=${user.accessToken}`);
  }

  // GitHub OAuth routes
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Initiates GitHub OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Request() req: any, @Res() res: any) {
    // Handle successful GitHub OAuth callback
    const user = await this.authService.handleOAuthLogin(req.user, 'github');
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/success?token=${user.accessToken}`);
  }

  @Post('signup')
  async signup(@Body() createOrganizerDto: CreateOrganizerDto) {
    return this.authService.signup(createOrganizerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('social/google')
  async googleTokenAuth(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.validateGoogleAuth(socialAuthDto.token);
  }

  @Post('social/github')
  async githubTokenAuth(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.validateGithubAuth(socialAuthDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: { user: { id: string; email: string; createdAt: string } },
  ) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getFullProfile(@Request() req: any) {
    return this.authService.getFullProfile(req.user.organizerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link/google')
  async linkGoogleProvider(@Request() req: any, @Body() linkProviderDto: LinkProviderDto) {
    return this.authService.linkGoogleProvider(req.user.organizerId, linkProviderDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link/github')
  async linkGithubProvider(@Request() req: any, @Body() linkProviderDto: LinkProviderDto) {
    return this.authService.linkGithubProvider(req.user.organizerId, linkProviderDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unlink/:provider')
  async unlinkProvider(@Request() req: any, @Param('provider') provider: string) {
    return this.authService.unlinkProvider(req.user.organizerId, provider);
  }
}
