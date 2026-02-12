// js/fingerprint-db.js
// Abrox Chat — Fingerprint + IndexedDB helper

const FingerprintDB = {
  dbName: 'AbroxFingerprintDB',
  storeName: 'fingerprints',
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = (event) => {
          console.error('IndexedDB open error:', event);
          reject(event);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          console.log('FingerprintDB initialized.');
          resolve();
        };
      } catch (err) {
        console.error('FingerprintDB.init exception:', err);
        reject(err);
      }
    });
  },

  async saveFingerprint(fingerprint) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const request = store.add(fingerprint);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e);
      } catch (err) {
        reject(err);
      }
    });
  },

  async getAllFingerprints() {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      try {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e);
      } catch (err) {
        reject(err);
      }
    });
  }
};

// Example usage: (remove/comment out in production)
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await FingerprintDB.init();
    // simple fingerprint payload - replace/expand as needed
    await FingerprintDB.saveFingerprint({
      device: navigator.userAgent,
      time: Date.now(),
      id: `fp_${Math.random().toString(36).slice(2,10)}`
    });
    const all = await FingerprintDB.getAllFingerprints();
    console.log('Saved fingerprints:', all);
  } catch (err) {
    console.warn('FingerprintDB example usage failed:', err);
  }
});
