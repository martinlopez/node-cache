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
