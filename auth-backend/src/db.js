import { JSONFilePreset } from 'lowdb/node';

// Local learning database. The file is created automatically on first run.
export const db = await JSONFilePreset('data/db.json', { users: [] });
