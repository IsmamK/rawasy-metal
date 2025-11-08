// polyfills.js
if (typeof window === "undefined" && typeof global.localStorage === "undefined") {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
}
