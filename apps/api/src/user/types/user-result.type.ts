export type UserResult = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  role: 'USER' | 'OPS' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};

