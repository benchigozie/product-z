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
}