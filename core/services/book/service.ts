import { BookRepository } from "../../adapters";
import { Book } from "../../domains";

export class BookService {
  repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  add(name: string, author: string, ttl: number): Book {
    return this.repository.add(name, author, ttl);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
  fetch(id: string): Book {
    return this.repository.fetch(id);
  }
}
