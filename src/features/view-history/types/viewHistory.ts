export interface ITrackProductViewParams {
  userIdentifier: string;
  productId: string;
  sessionId?: string;
  source?: string;
  viewDurationSeconds?: number;
  scrollDepthPercent?: number;
  clickedImages?: boolean;
  clickedDescription?: boolean;
}

export interface IGetUserHistoryParams {
  userIdentifier: string;
  limit?: number;
}

export interface IViewHistory {
  id: string;
  userIdentifier: string;
  productId: string;
  sessionId?: string;
  source?: string;
  viewDurationSeconds?: number;
  scrollDepthPercent?: number;
  clickedImages?: boolean;
  clickedDescription?: boolean;
  viewedAt: string;
}
