# Cache in memory.

## How to use?

```
import Cache from "./lib";

interface Book {
name: string;
author: string;
}

const cache = new Cache<Book>({
defaultTTL: 10, // 10 seconds
maxStoredKeys: 10000, // max items in the cache
});

//add new item
cache.add("1", { name: "Hello World", author: "John Doe" });

//add new item with ttl = 10 seconds
cache.add("1", { name: "Hello World", author: "John Doe" }, 10);

//get new item
cache.fetch("1");

// remove all items from cache
cache.flush();

// get Stats about cache
cache.fetchStats; // it only returns amount of items in cache

```
## Memory Size

This implementation has simple approach to avoid memory leak. The memory is limited by a number of items in memory.

TODO: Implement a memory by memory size (i.e: 2GB)

## Expiration Strategy

This implementation It's using setTimeout, in other words, it's using the event loop (timer callback queue) to execute the expiration of the item. In the  case that the client use this library and have a high use of the timer API, it might be a problem and probably should be necessary use other strategy.

TODO: Implement other strategy to avoid stress the timer queue in the event loop.

## Development

### Install dependencies

```npm i```

### How to run test?

```npm run test```

# API.

Here there is an example with a Book API.

### Install dependencies

```npm i```


### How to run locally?

```npm run test```

## Endpoints

### Add book

```curl --location --request POST 'localhost:3000/books' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Algoritm",
    "author": "Martni",
    "ttl": 500 // in seconds
}'```

### Get book

```curl --location --request GET 'localhost:3000/books/:id'```

### Remove book

```curl --location --request DELETE 'localhost:3000/books/78fd6250-7b9e-4a2b-9157-15128d1c6e14'```

# Architecture code

This project uses hexagonal architecture. [More info](https://alistair.cockburn.us/hexagonal-architecture/).
In this case, cache repository is using the library mentioned above.

## Scaffolding

- core (contain all the business logic)
  - domain (contain all the business domains)
  - adapters (contain how the core module will interacts with the external actors(handlers and repositories))
  - service (implement the business logic)
- handler (external actors to know how to interact with the core)
- repository (external actors that implements the functions that core understand
- lib (code to open to use by external applications)

## TODO:
- Add test
- Add observability
