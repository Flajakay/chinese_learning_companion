const { CACHE_TIMEOUTS } = require('../../shared/constants');

class CacheService {
  constructor() {
    this.caches = new Map();
  }

  createCache(name, timeout = 1000) {
    if (!this.caches.has(name)) {
      this.caches.set(name, {
        data: new Map(),
        timeout: timeout
      });
    }
    return this.caches.get(name);
  }

  set(cacheName, key, value) {
    const cache = this.createCache(cacheName);
    cache.data.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(cacheName, key) {
    const cache = this.caches.get(cacheName);
    if (!cache) return null;
    
    const item = cache.data.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > cache.timeout) {
      cache.data.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear(cacheName) {
    const cache = this.caches.get(cacheName);
    if (cache) {
      cache.data.clear();
    }
  }

  clearAll() {
    this.caches.clear();
  }
}

module.exports = new CacheService();
