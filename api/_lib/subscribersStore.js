const fs = require('fs');
const path = require('path');
const { put, get, head } = require('@vercel/blob');

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

function hasBlobToken() {
  return (
    typeof process.env.BLOB_READ_WRITE_TOKEN === 'string' &&
    process.env.BLOB_READ_WRITE_TOKEN.length > 0
  );
}

function useBlobStore() {
  return hasBlobToken();
}

function isVercelRuntime() {
  return process.env.VERCEL === '1' || typeof process.env.VERCEL_ENV === 'string';
}

function blobTokenOptions() {
  return { token: process.env.BLOB_READ_WRITE_TOKEN };
}

function emailMarkerPathname(email) {
  return `subscribers/emails/${encodeURIComponent(email)}.json`;
}

function isNotFoundError(error) {
  if (!error) {
    return false;
  }
  if (error.name === 'BlobNotFoundError' || error.status === 404 || error.statusCode === 404) {
    return true;
  }
  return /not found|does not exist/i.test(String(error.message || ''));
}

function isAlreadyExistsError(error) {
  if (!error) {
    return false;
  }
  const message = String(error.message || error);
  return /already exists|overwrite|conflict|precondition/i.test(message);
}

function readFileSubscribers(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFileSubscribers(filePath, subscribers) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf8');
}

function dedupeSubscribers(subscribers) {
  const seen = new Set();
  const result = [];

  for (const item of subscribers) {
    if (!item || typeof item.email !== 'string') {
      continue;
    }
    const email = normalizeEmail(item.email);
    if (!isValidEmail(email) || seen.has(email)) {
      continue;
    }
    seen.add(email);
    result.push({
      email,
      date:
        typeof item.date === 'string' && item.date.length > 0
          ? item.date
          : new Date().toISOString(),
    });
  }

  return result;
}

async function streamToString(stream) {
  if (!stream) {
    return '[]';
  }
  if (typeof stream === 'string') {
    return stream;
  }
  if (Buffer.isBuffer(stream)) {
    return stream.toString('utf8');
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
      useCache: false,
      ...blobTokenOptions(),
    });

    if (!result) {
      return [];
    }

    if (typeof result === 'string') {
      const parsed = JSON.parse(result);
      return Array.isArray(parsed) ? dedupeSubscribers(parsed) : [];
    }

    const raw = await streamToString(result.stream || result);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? dedupeSubscribers(parsed) : [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }
    throw error;
  }
}

async function writeBlobSubscribers(subscribers) {
  await put(BLOB_PATHNAME, JSON.stringify(dedupeSubscribers(subscribers), null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    ...blobTokenOptions(),
  });
}

async function hasEmailMarker(email) {
  try {
    await head(emailMarkerPathname(email), blobTokenOptions());
    return true;
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }
    throw error;
  }
}

/**
 * Atomically claims an email slot in Blob storage.
 * Returns false when the email is already claimed.
 */
async function claimEmailMarker(email, date) {
  if (await hasEmailMarker(email)) {
    return false;
  }

  try {
    await put(
      emailMarkerPathname(email),
      JSON.stringify({ email, date }),
      {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: 'application/json',
        ...blobTokenOptions(),
      }
    );
    return true;
  } catch (error) {
    if (isAlreadyExistsError(error) || (await hasEmailMarker(email))) {
      return false;
    }
    throw error;
  }
}

async function readSubscribers() {
  if (useBlobStore()) {
    return readBlobSubscribers();
  }

  if (isVercelRuntime()) {
    const error = new Error(
      'Subscriber storage is not configured (missing BLOB_READ_WRITE_TOKEN)'
    );
    error.statusCode = 503;
    throw error;
  }

  return dedupeSubscribers(readFileSubscribers(LOCAL_PATH));
}

async function writeSubscribers(subscribers) {
  if (useBlobStore()) {
    await writeBlobSubscribers(subscribers);
    return;
  }

  if (isVercelRuntime()) {
    const error = new Error(
      'Subscriber storage is not configured (missing BLOB_READ_WRITE_TOKEN)'
    );
    error.statusCode = 503;
    throw error;
  }

  writeFileSubscribers(LOCAL_PATH, dedupeSubscribers(subscribers));
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

  const date = new Date().toISOString();

  if (useBlobStore()) {
    const subscribers = await readSubscribers();
    const existsInList = subscribers.some(
      (item) => item && normalizeEmail(item.email) === email
    );

    if (existsInList) {
      // Backfill per-email marker for older list-only records.
      await claimEmailMarker(email, date);
      return { added: false, alreadySubscribed: true, email };
    }

    const claimed = await claimEmailMarker(email, date);
    if (!claimed) {
      return { added: false, alreadySubscribed: true, email };
    }

    subscribers.push({ email, date });
    await writeSubscribers(subscribers);
    return { added: true, email };
  }

  const subscribers = await readSubscribers();
  const exists = subscribers.some(
    (item) => item && normalizeEmail(item.email) === email
  );

  if (exists) {
    return { added: false, alreadySubscribed: true, email };
  }

  subscribers.push({ email, date });
  await writeSubscribers(subscribers);
  return { added: true, email };
}

module.exports = {
  addSubscriber,
  normalizeEmail,
  isValidEmail,
  readSubscribers,
  useBlobStore,
};
