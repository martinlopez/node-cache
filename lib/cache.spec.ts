import "jest";
import Cache, { Props } from "./cache";

const defaultProps: Props = {
  defaultTTL: 2, // 10 seconds
  maxStoredKeys: 1,
};

describe("Cache", () => {
  describe("Cache - add", () => {
    const cache = new Cache(defaultProps);
    beforeEach(() => {
      cache.flush();
    });
    it("should create an item in cache if the item doesn't exist", () => {
      //given
      const key = "key_1";
      const value = "value_1";
      cache.add(key, value);
      //Then
      expect(cache.fetch(key).value).toBe(value);
    });

    it("should refresh an item in cache when it already exists", () => {
      const cache = new Cache({
        defaultTTL: 2,
        maxStoredKeys: 3,
      });
      //given
      const key = "key_1";
      cache.add(key, "value_1");
      const expirationDate = cache.fetch(key);
      cache.add(key, "value_2");
      //Then
      const item = cache.fetch(key);
      expect(item.expirationDate).not.toBe(expirationDate);
      expect(item.value).toBe("value_2");
    });

    it("should return error because the max items was reached", () => {
      //given
      cache.add("key_1", "value_1");
      //then
      expect(() => cache.add("key_2", "value_2")).toThrowError(
        new Error("Max limit of memory reached.")
      );
    });

    it("should refresh stats when a new item was inserted", () => {
      //given
      cache.add("key_1", "value_1");
      //then
      expect(cache.fetchStats().stored).toBe(1);
    });

    it("should expire item when the item expired", async () => {
      //given
      cache.add("key_1", "value_1", 1);
      //then
      expect(cache.fetch("key_1").value).toBe("value_1");
      await new Promise((r) => setTimeout(r, 2000));
      expect(cache.fetch("key_1")).toBeUndefined();
    });
  });

  describe("Cache - fetch", () => {
    const cache = new Cache(defaultProps);
    beforeEach(() => {
      cache.flush();
    });

    it("should return an item when it found the item in cache", () => {
      //given
      cache.add("key_1", "value_1");
      //then
      expect(cache.fetch("key_1").value).toBe("value_1");
    });

    it("should return undefined when it didn't find the item in cache", () => {
      //then
      expect(cache.fetch("key_1")).toBeUndefined();
    });
  });

  describe("Cache - remove", () => {
    const cache = new Cache(defaultProps);
    beforeEach(() => {
      cache.flush();
    });

    it("should remove the item when it was found in the cache", () => {
      //given
      cache.add("key_1", "value_1");
      //then
      cache.remove("key_1");
      expect(cache.fetch("key_1")).toBeUndefined();
      expect(cache.fetchStats().stored).toBe(0);
    });

    it("should do nothing when the item to remove doesn't exist", () => {
      //given
      cache.remove("key_1");
      //then
      expect(cache.fetchStats().stored).toBe(0);
    });
  });

  describe("Cache - flush", () => {
    const cache = new Cache({
      defaultTTL: 2,
      maxStoredKeys: 3,
    });

    it("should flush cache ", () => {
      //given
      cache.add("key_1", "value_1");
      cache.add("key_2", "value_2");

      //then
      cache.flush();
      expect(cache.fetch("key_1")).toBeUndefined();
      expect(cache.fetch("key_2")).toBeUndefined();
    });
  });
});
