import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { UserResult } from './types/user-result.type.js';


@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.prisma.db.orm.public.User
      .where({ email })
      .include('passwordCredential')
      .first();
  
    if (!user) {
      return null;
    }
  
    const passwordCredential = user.passwordCredential;
  
    if (!passwordCredential) {
      return {
        ...user,
        passwordCredential: null,
      };
    }
  
    return {
      ...user,
      passwordCredential: {
        id: passwordCredential.id as string,
        userId: passwordCredential.userId as string,
        passwordHash: passwordCredential.passwordHash as string,
        createdAt: passwordCredential.createdAt as Date,
      },
    };
  }

  async findById(id: string): Promise<UserResult | null> {
    return this.prisma.db.orm.public.User
      .where({ id })
      .first();
  }

  async create(data: {
    email: string;
    passwordHash: string;
  }): Promise<UserResult> {
    return this.prisma.db.orm.public.User.create({
      email: data.email,
      passwordCredential: (credential) =>
        credential.create({
          passwordHash: data.passwordHash,
        }),
    });
  }
}