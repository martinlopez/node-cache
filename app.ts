import express from "express";
import { BookService } from "./core/services";
import { BookHandler } from "./handlers/book/handler";
import { BookRepository } from "./repositories/book";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const bookRepository = new BookRepository({
  defaultTll: 6000, // 10 minutes
  maxItems: 10000,
});

const bookService = new BookService(bookRepository);

const bookHandler = new BookHandler(bookService);

app.get("/books/:id", bookHandler.get);

app.post("/books", bookHandler.post);

app.delete("/books/:id", bookHandler.delete);

//@ts-ignore
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
