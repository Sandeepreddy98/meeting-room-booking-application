import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbName = 'MeetingRoom';  // Database name
  private dbVersion = 1;      // Database version
  private db: IDBDatabase | null = null;

  constructor() {
    this.openDb();
  }

  // Open the IndexedDB
  private openDb() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    // This will be called if a new version is set or the database doesn't exist
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      // Create an object store for users with a keyPath of 'id'
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        store.createIndex('email', 'email', { unique: true }); // Index for email to check uniqueness
      }
    };

    // This will be called when the database opens successfully
    request.onsuccess = () => {
      this.db = request.result;
    };

    // Handle errors
    request.onerror = (event) => {
      console.error('Database error: ', event);
    };
  }

  // Add a new user to the database
  addUser(user: { name: string; email: string; password: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('users', 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add(user);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error adding user');
    });
  }

  // Check if a user exists by email
  getUserByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('users', 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email'); // Use index for efficient email lookup
      const request = index.get(email);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error fetching user');
    });
  }
}
