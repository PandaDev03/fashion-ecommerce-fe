const SIZES = ['s', 'm', 'l', 'xl'] as const;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const DEFAULT_URL_FIELDS = ['website', 'facebook', 'instagram'];

const GUEST_USER_KEY = 'guestUserId';
const LATEST_ORDER_NUMBER_STORAGE_KEY = 'lastedOrderNumber';

export {
  SIZES,
  MIN_QUANTITY,
  MAX_QUANTITY,
  DEFAULT_URL_FIELDS,
  GUEST_USER_KEY,
  LATEST_ORDER_NUMBER_STORAGE_KEY
};
