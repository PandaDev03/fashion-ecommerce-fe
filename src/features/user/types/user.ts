export interface IUserParams extends IPaginationParams {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface IUpdateUserByAdmin {
  id: string;
  role?: string;
  isActive?: boolean;
}

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
