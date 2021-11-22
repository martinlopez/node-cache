import { Book } from "../domains";

export interface BookRepository {
  add(name: string, author: string, ttl: number): Book;
  remove(id: string);
  fetch(id: string): Book;
}
