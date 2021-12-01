import { BookPort } from "../../core/adapters";
import { Book } from "../../core/domains";

interface BookBody {
  name: string;
  author: string;
}

export class BookHandler {
  service: BookPort;
  constructor(bookService: BookPort) {
    this.service = bookService;
  }

  get = (req, res) => {
    const id = req.params.id;
    const item = this.service.fetch(id);
    if (!item) {
      res.status(404).send("Not found");
    }
    res.send(item);
  };

  post = (req, res) => {
    const book = req.body;
    const item = this.service.add(book.name, book.author);
    res.send(201, item);
  };

  delete = (req, res) => {
    const id = req.params.id;
    const item = this.service.fetch(id);
    if (!item) {
      res.status(404).send("Not found");
    }
    this.service.remove(id);
    res.send();
  };
}
