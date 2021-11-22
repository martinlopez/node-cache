export const DEFAULT_TTL: number = 0;
export const DEFAULT_TTL_UNIT: number = 1000;
export const DEFAULT_MAX_KEY_STORED: number = 0;
export const INIT_STATS_COUNTER: number = 0;

//Errors
export const ERROR_MAX_STORED_KEYS_LIMIT: Error = new Error(
  "Max limit of memory reached."
);
