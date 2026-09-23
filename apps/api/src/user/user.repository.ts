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
      .include('profile')
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
      .include('profile')
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

  async createOAuthUser(data: {
    email: string;
    provider: 'GOOGLE';
    providerAccountId: string;
    displayName?: string;
    avatarUrl?: string;
  }): Promise<UserResult> {
    return this.prisma.db.orm.public.User.create({
      email: data.email,
      emailVerified: true,
  
      profile: (profile) =>
        profile.create({
          displayName: data.displayName,
          avatarUrl: data.avatarUrl,
        }),
  
      oauthAccounts: (account) =>
        account.create({
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        }),
    });
  }

  async findByOAuthAccount(
    provider: 'GOOGLE',
    providerAccountId: string,
  ): Promise<UserResult | null> {
    const account = await this.prisma.db.orm.public.OAuthAccount
      .where({
        provider,
        providerAccountId,
      })
      .first();
  
    if (!account) {
      return null;
    }
  
    return this.findById(account.userId as string);
  }

  async linkOAuthAccount(data: {
    userId: string;
    provider: 'GOOGLE';
    providerAccountId: string;
  }): Promise<void> {
    await this.prisma.db.orm.public.OAuthAccount.create({
      userId: data.userId,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
    });
  }

  async updateProfile(
    userId: string,
    data: {
      displayName: string;
    },
  ): Promise<UserResult | null> {
    await this.prisma.db.orm.public.UserProfile.upsert({
      create: {
        userId,
        displayName: data.displayName,
      },
      update: {
        displayName: data.displayName,
      },
      conflictOn: {
        userId,
      },
    });
  
    return this.findById(userId);
  }
}