import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';

  
  import { UserService } from '../user/user.service.js';
  import { SessionService } from '../session/session.service.js';
  import { PasswordService } from '../password/password.service.js';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly sessionService: SessionService,
      private readonly passwordService: PasswordService,
    ) {}
  
    async register(data: {
      email: string;
      password: string;
    }) {
      const existingUser = await this.userService.findByEmail(data.email);
  
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
  
      const passwordHash = await this.passwordService.hashPassword(
        data.password,
      );
  
      const user = await this.userService.create({
        email: data.email,
        passwordHash,
      });
  
      return {
        success: true,
        verificationEmailSent: true,
      };
    }

    async login(data: { email: string; password: string }) {

      const user = await this.userService.findByEmail(data.email);
    
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
    
      const passwordCredential = user.passwordCredential;
    
      if (!passwordCredential) {
        throw new UnauthorizedException('Invalid email or password');
      }
    
      const passwordMatches = await this.passwordService.comparePassword(
        data.password,
        passwordCredential.passwordHash,
      );
    
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid email or password');
      }
    
      const session = await this.sessionService.createSession(user.id);
    
      return {
        user,
        session,
      };
    }

    async googleLogin(data: {
      email: string;
      providerId: string;
      displayName?: string;
      avatar?: string;
    }) {
      if (!data.email) {
        throw new UnauthorizedException('Google account email not available');
      }
    
      let user = await this.userService.findByOAuthAccount(
        'GOOGLE',
        data.providerId,
      );
    
      if (!user) {
        user = await this.userService.findByEmail(data.email);
    
        if (user) {
          await this.userService.linkOAuthAccount({
            userId: user.id,
            provider: 'GOOGLE',
            providerAccountId: data.providerId,
          });
        }
        if (!user) {
          user = await this.userService.createOAuthUser({
            email: data.email,
            provider: 'GOOGLE',
            providerAccountId: data.providerId,
            displayName: data.displayName,
            avatarUrl: data.avatar,
          });
        }
      }
    
    
      const session = await this.sessionService.createSession(user.id);
    
      return {
        user,
        session,
      };
    }

    async logout(token: string) {
      const session = await this.sessionService.validateSession(token);
    
      await this.sessionService.revokeSession(session.id);
    }
  }