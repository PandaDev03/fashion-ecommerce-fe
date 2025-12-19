import { IUser } from '~/shared/types/user';

export interface IBrandParams extends IPaginationParams {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface ICreateBrandParams {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
}

export interface IUpdateBrandParams extends Partial<ICreateBrandParams> {
  id: string;
}

export interface IDeleteManyBrandParams {
  ids: string[];
}

export interface IBrand {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  website: string;
  facebook: string;
  instagram: string;
  creator: Omit<IUser, 'role' | 'permissions'>;
  updater: Omit<IUser, 'role' | 'permissions'>;
}

export type BrandState = IPaginatedData<IBrand>;
