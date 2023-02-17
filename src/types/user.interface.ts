export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export interface User {
  _id?: string;
  createdAt?: string;
  email: string;
  userName: string;
  password: string;
  userRole: UserRole;
}
