export interface IUpdateUser {
  email: string;
  name: string;
  password?: string;
  birthday?: any;
  address: string;
  phone: string;
  avatar?: string;
}

export interface IChangePassword {
  oldPassword?: string;
  newPassword: string;
}
