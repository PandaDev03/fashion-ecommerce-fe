const SIZES = ['s', 'm', 'l', 'xl'] as const;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const DEFAULT_URL_FIELDS = ['website', 'facebook', 'instagram'];

const GUEST_USER_KEY = 'guestUserId';
const LATEST_ORDER_NUMBER_STORAGE_KEY = 'lastedOrderNumber';

const RANGE_PRICE_CONSTANTS = {
  MULTIPLIER: 1000,
  MIN: 0,
  MAX: 20000,
  STEP: 100,
  MAX_PLUS: 20001, // 20tr+
  MARKS: {
    0: '0đ',
    5000: '5tr',
    10000: '10tr',
    15000: '15tr',
    // 20000: '20tr',
    20001: '20tr+',
  },
} as const;

export {
  SIZES,
  MIN_QUANTITY,
  MAX_QUANTITY,
  DEFAULT_URL_FIELDS,
  GUEST_USER_KEY,
  LATEST_ORDER_NUMBER_STORAGE_KEY,
  RANGE_PRICE_CONSTANTS,
};
