import { IUser } from '~/shared/types/user';

export interface IBrandParams extends IPaginationParams {}

export interface ICreateBrandParams {
  name: string;
  slug: string;
  description?: string;
  logo: string;
  website?: string;
  facebook?: string;
  instagram?: string;
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
  creator: IUser;
  updater: IUser;
}

export type BrandState = IPaginatedData<IBrand>;
