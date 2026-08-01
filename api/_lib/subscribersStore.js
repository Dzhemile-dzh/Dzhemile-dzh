const fs = require('fs');
const path = require('path');
const { put, get } = require('@vercel/blob');

const BLOB_PATHNAME = 'doarti-subscribers.json';
const LOCAL_PATH = path.join(__dirname, '..', '..', 'data', 'subscribers.json');

function normalizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function useBlobStore() {
  return (
    typeof process.env.BLOB_READ_WRITE_TOKEN === 'string' &&
    process.env.BLOB_READ_WRITE_TOKEN.length > 0
  );
}

function readLocalSubscribers() {
  try {
    if (!fs.existsSync(LOCAL_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(LOCAL_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalSubscribers(subscribers) {
  const dir = path.dirname(LOCAL_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LOCAL_PATH, JSON.stringify(subscribers, null, 2), 'utf8');
}

async function streamToString(stream) {
  if (!stream) {
    return '[]';
  }
  if (typeof stream === 'string') {
    return stream;
  }
  if (typeof stream.text === 'function') {
    return stream.text();
  }

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function readBlobSubscribers() {
  try {
    const result = await get(BLOB_PATHNAME, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result || !result.stream) {
      return [];
    }

    const raw = await streamToString(result.stream);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && error.name === 'BlobNotFoundError') {
      return [];
    }
    // Older stores / first run
    if (error && /not found/i.test(String(error.message || ''))) {
      return [];
    }
    throw error;
  }
}

async function writeBlobSubscribers(subscribers) {
  await put(BLOB_PATHNAME, JSON.stringify(subscribers, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

async function readSubscribers() {
  if (useBlobStore()) {
    return readBlobSubscribers();
  }
  return readLocalSubscribers();
}

async function writeSubscribers(subscribers) {
  if (useBlobStore()) {
    await writeBlobSubscribers(subscribers);
    return;
  }
  writeLocalSubscribers(subscribers);
}

/**
 * Adds a subscriber if the email is new.
 * @returns {{ added: boolean, email: string, alreadySubscribed?: boolean }}
 */
async function addSubscriber(rawEmail) {
  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    const error = new Error('Invalid email');
    error.statusCode = 400;
    throw error;
  }

  const subscribers = await readSubscribers();
  const exists = subscribers.some(
    (item) => item && normalizeEmail(item.email) === email
  );

  if (exists) {
    return { added: false, alreadySubscribed: true, email };
  }

  subscribers.push({
    email,
    date: new Date().toISOString(),
  });

  await writeSubscribers(subscribers);
  return { added: true, email };
}

module.exports = {
  addSubscriber,
  normalizeEmail,
  isValidEmail,
  readSubscribers,
};
