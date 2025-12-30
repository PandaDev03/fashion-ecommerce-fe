import { IProduct } from '~/features/products/types/product';

export interface IGetRecommendationParams {
  userIdentifier: string;
  limit?: number;
}

export interface IGetFeaturedProductParams {
  limit?: number;
}

export interface IRecommendationProduct extends IProduct {}
