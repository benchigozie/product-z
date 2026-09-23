import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async create(data: {
    email: string;
    passwordHash: string;
  }) {
    return this.userRepository.create(data);
  }

  async createOAuthUser(data: {
    email: string;
    provider: 'GOOGLE';
    providerAccountId: string;
    displayName?: string;
    avatarUrl?: string;
  }) {
    return this.userRepository.createOAuthUser(data);
  }

  async findByOAuthAccount(
    provider: 'GOOGLE',
    providerAccountId: string,
  ) {
    return this.userRepository.findByOAuthAccount(
      provider,
      providerAccountId,
    );
  }

  async linkOAuthAccount(data: {
    userId: string;
    provider: 'GOOGLE';
    providerAccountId: string;
  }) {
    return this.userRepository.linkOAuthAccount(data);
  }

  async updateProfile(
    userId: string,
    data: {
      displayName: string;
    },
  ) {
    return this.userRepository.updateProfile(userId, data);
  }
}