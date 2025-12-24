export interface IUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  email: string;
  name: string;
  birthday: string;
  isActive: boolean;
  address: string;
  phone: string;
  avatar: string;
  role: string;
  permissions: string[];
}

export interface UserState {
  loading?: boolean;
  isInitialized?: boolean;
  currentUser: IUser;
}
