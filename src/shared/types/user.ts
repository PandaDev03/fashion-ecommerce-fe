export interface IUser {
  name: string;
  role: string;
  permissions: string[];
}

export interface UserState {
  loading?: boolean;
  currentUser: IUser;
}
