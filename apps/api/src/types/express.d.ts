declare global {
  namespace Express {
    interface Request {
      user?: User;
    }

    interface User {
      id: string;
      provider?: 'google';
      providerId?: string;
      email?: string;
      name?: string;
      avatar?: string;
    }
  }
}

export {};