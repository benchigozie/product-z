import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;
  private readonly pepper: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.pepper = this.configService.getOrThrow<string>(
      'PASSWORD_PEPPER',
    );
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(
      password + this.pepper,
      this.saltRounds,
    );
  }

  async comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      password + this.pepper,
      passwordHash,
    );
  }
}