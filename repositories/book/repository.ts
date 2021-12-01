import Cache from "../../lib/cache";
import { v4 } from "uuid";

export interface Book {
  id: string;
  name: string;
  author: string;
}

export interface Options {
  defaultTll?: number;
  maxItems?: number;
}

export default class BookRepository implements BookRepository {
  cache: Cache<Book>;
  constructor(options?: Options) {
    this.cache = new Cache<Book>({
      defaultTTL: options.defaultTll,
      maxStoredKeys: options.maxItems,
    });
  }

  add(name: string, author: string, ttl: number): Book {
    const id = v4();
    const book = {
      id,
      name,
      author,
    };
    this.cache.add(id, book, ttl);
    return book;
  }
  remove(id: string) {
    this.cache.remove(id);
  }
  fetch(id: string): Book {
    const item = this.cache.fetch(id);
    if (!item) {
      return undefined;
    }
    return item.value;
  }
}
