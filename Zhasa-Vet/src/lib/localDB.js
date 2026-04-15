/**
 * localStorage-based database engine.
 * Mimics the base44 SDK entities interface so all existing useQuery code works unchanged.
 */

import { DEMO_PRODUCTS } from './demoProducts';

const PREFIX = 'zhasavet_';

// Auto-seed products on first load if empty
function seedIfEmpty() {
  try {
    const existing = localStorage.getItem(PREFIX + 'Product');
    if (!existing || JSON.parse(existing).length === 0) {
      const now = new Date().toISOString();
      const seeded = DEMO_PRODUCTS.map((p, i) => ({
        ...p,
        id: 'seed_' + i + '_' + Date.now().toString(36),
        created_date: now,
        updated_date: now,
        created_by: 'admin',
      }));
      localStorage.setItem(PREFIX + 'Product', JSON.stringify(seeded));
    }
  } catch {}
}
seedIfEmpty();

function getStore(entity) {
  try {
    const raw = localStorage.getItem(PREFIX + entity);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStore(entity, data) {
  localStorage.setItem(PREFIX + entity, JSON.stringify(data));
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sortRecords(records, sortKey) {
  if (!sortKey) return records;
  const desc = sortKey.startsWith('-');
  const key = sortKey.replace(/^-/, '');
  return [...records].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });
}

function createEntityStore(entityName) {
  return {
    list(sortKey = '-created_date', limit = 200) {
      const records = getStore(entityName);
      const sorted = sortRecords(records, sortKey);
      return Promise.resolve(sorted.slice(0, limit));
    },

    filter(query = {}, sortKey = '-created_date', limit = 200) {
      const records = getStore(entityName);
      const filtered = records.filter(rec =>
        Object.entries(query).every(([k, v]) => rec[k] === v)
      );
      const sorted = sortRecords(filtered, sortKey);
      return Promise.resolve(sorted.slice(0, limit));
    },

    get(id) {
      const records = getStore(entityName);
      const rec = records.find(r => r.id === id);
      if (!rec) return Promise.reject(new Error('Not found'));
      return Promise.resolve(rec);
    },

    create(data) {
      const records = getStore(entityName);
      const now = new Date().toISOString();
      const newRec = {
        ...data,
        id: genId(),
        created_date: now,
        updated_date: now,
        created_by: 'admin',
      };
      records.push(newRec);
      setStore(entityName, records);
      return Promise.resolve(newRec);
    },

    update(id, data) {
      const records = getStore(entityName);
      const idx = records.findIndex(r => r.id === id);
      if (idx === -1) return Promise.reject(new Error('Not found'));
      records[idx] = { ...records[idx], ...data, id, updated_date: new Date().toISOString() };
      setStore(entityName, records);
      return Promise.resolve(records[idx]);
    },

    delete(id) {
      const records = getStore(entityName);
      setStore(entityName, records.filter(r => r.id !== id));
      return Promise.resolve({ id });
    },

    bulkCreate(items) {
      const records = getStore(entityName);
      const now = new Date().toISOString();
      const newRecs = items.map(data => ({
        ...data,
        id: genId(),
        created_date: now,
        updated_date: now,
        created_by: 'admin',
      }));
      setStore(entityName, [...records, ...newRecs]);
      return Promise.resolve(newRecs);
    },

    schema() {
      return Promise.resolve({});
    },

    subscribe() {
      return () => {};
    },
  };
}

export const localDB = {
  entities: new Proxy({}, {
    get(_, entityName) {
      return createEntityStore(entityName);
    },
  }),
};