import {
  DEFAULT_TTL,
  DEFAULT_TTL_UNIT,
  DEFAULT_MAX_KEY_STORED,
  INIT_STATS_COUNTER,
  ERROR_MAX_STORED_KEYS_LIMIT,
} from "./const";

export interface ICache {}

/**
 * Props accepted by CacheInMemory class
 */
export interface Props {
  // defaultTTL - time to live by default
  defaultTTL: number;
  // max memory stored - If it's zero, this check will be enabled
  maxStoredKeys: number;
}

/**
 * Stats available about the cache
 */
export interface IStats {
  stored: number;
}
/**
 * Value stored in the cache
 */
export interface IValue<T> {
  value: T;
  expirationDate: number;
}

/**
 * Value stored in the cache with timeout references function
 */
interface IInternalValue<T> extends IValue<T> {
  timeout: NodeJS.Timeout;
}

/**
 * Cache in memory class.
 */
export default class Cache<T> {
  private props: Props;
  private data: Map<string, IInternalValue<T>>;
  private stats: IStats;

  constructor(props: Props) {
    this.data = new Map<string, IInternalValue<T>>();
    this.props = {
      defaultTTL: props.defaultTTL || DEFAULT_TTL,
      maxStoredKeys: props.maxStoredKeys || DEFAULT_MAX_KEY_STORED,
    };
    this.stats = {
      stored: INIT_STATS_COUNTER,
    };
  }

  /**
   * Add new item in the cache
   * @param key - Item id
   * @param value - Item value
   * @param ttl - Time to live in the cache in Seconds
   */
  add(key: string, value: T, ttl?: number) {
    if (
      this.props.maxStoredKeys > 0 &&
      this.stats.stored >= this.props.maxStoredKeys
    ) {
      throw ERROR_MAX_STORED_KEYS_LIMIT;
    }
    let ttlValue = ttl || this.props.defaultTTL;
    const timeToExpire = ttlValue * DEFAULT_TTL_UNIT;
    const ttlDate = Date.now() + timeToExpire;
    const timeout = setTimeout(() => {
      this.remove(key);
    }, timeToExpire);

    const item = this.data.get(key);
    if (item) {
      clearTimeout(item.timeout);
    }

    this.data.set(key, { value, expirationDate: ttlDate, timeout });

    this.stats.stored++;
  }

  /**
   * Fetch an item from the cache by Key
   * @param key - Item id
   * @returns Return the a value if found the item, otherwise undefined
   */
  fetch(key: string): IValue<T> | undefined {
    const item = this.data.get(key);
    if (!item) {
      return undefined;
    }

    return {
      value: item.value,
      expirationDate: item.expirationDate,
    };
  }

  /**
   * Remove an item from cache by Key
   * @param key - Item id
   * @returns true if the item was removed, otherwise false
   */
  remove(key: string): boolean {
    const itemDeleted = this.data.delete(key);
    if (itemDeleted) {
      this.stats.stored--;
    }
    return itemDeleted;
  }

  flush() {
    this.data.forEach((e) => {
      clearTimeout(e.timeout);
    });
    this.data = new Map<string, IInternalValue<T>>();
    this.flushStats();
  }

  /**
   * Fetch stats from cache
   * @returns
   */
  fetchStats(): IStats {
    return this.stats;
  }

  flushStats() {
    this.stats.stored = 0;
  }
}
