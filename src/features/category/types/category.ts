import { IUser } from '~/shared/types/user';

export interface ICategoryParams extends IPaginationParams {
  parent?: boolean;
  search?: string;
  parentIds?: number[];
  createdFrom?: string;
  createdTo?: string;
}

export interface ICreateCategoryParams {
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  position: number;
}

export interface IUpdateCategoryParams extends Partial<ICreateCategoryParams> {
  id: string;
}

export interface IDeleteManyCategoryParams {
  ids: string[];
}

export interface ICategory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  name: string;
  slug: string;
  description: string;
  parentId: string;
  position: number;
  childrenCount: number;
  parent?: ICategory;
  creator?: Omit<IUser, 'role' | 'permissions'>;
  updater?: Omit<IUser, 'role' | 'permissions'>;
}

export type CategoryState = IPaginatedData<ICategory>;

export interface IParentCategory {
  id: string;
  name: string;
  slug: string;
  position: number;
  childrenCount: number;
}
