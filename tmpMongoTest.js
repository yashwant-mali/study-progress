const fs = require('fs');
const { MongoClient } = require('mongodb');
const env = fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(line => line.trim() && !line.trim().startsWith('#')).reduce((acc, line) => {
  const idx = line.indexOf('=');
  if (idx > -1) {
    let key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    acc[key] = value;
  }
  return acc;
}, {});
const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB || 'studyProgress';
console.log('MONGODB_URI:', uri ? 'present' : 'missing');
console.log('MONGODB_DB:', dbName);
if (!uri) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
client.connect().then(async () => {
  console.log('Connected to Atlas');
  const db = client.db(dbName);
  const ping = await db.command({ ping: 1 });
  console.log('Ping result:', JSON.stringify(ping));
  const collections = await db.collections();
  console.log('Collections:', collections.map(c => c.collectionName));
  await client.close();
}).catch(err => {
  console.error('Connection error:');
  console.error(err.message || err);
  process.exit(1);
});
