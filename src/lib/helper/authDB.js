import { openDB } from 'idb';
import { AES } from 'crypto-es/lib/aes';
import { Utf8 } from 'crypto-es/lib/core';
import { empty } from './utils';

const DB_NAME = 'auth-db'
const DB_VERSION = 1
const USER_STORE_NAME = 'user-store'
const SECRET_KEY = "dusdosdbvdsovbod"

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(USER_STORE_NAME);
  },
});

export async function writeData(key, value) {
  const db = await dbPromise;
  const tx = db.transaction(USER_STORE_NAME, 'readwrite');
  const encryptedValue = empty(value) ? value : AES.encrypt(value, SECRET_KEY).toString();
  tx.objectStore(USER_STORE_NAME).put(encryptedValue, key);
  await tx.done;
}

export async function readData(key) {
  const db = await dbPromise;
  const value = await db.get(USER_STORE_NAME, key);
  const decryptedValue = empty(value) ? value : AES.decrypt(value, SECRET_KEY).toString(Utf8);
  return decryptedValue;
}
