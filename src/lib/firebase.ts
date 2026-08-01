import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  FirebaseStorage,
} from 'firebase/storage';
import { AppConfig, MemoryPhoto, Song } from '../types';
import {
  INITIAL_DEFAULT_CONFIG,
  INITIAL_DEFAULT_MEMORIES,
  INITIAL_DEFAULT_SONGS,
} from '../data/defaultConfig';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Pass custom firestore database ID from configuration
  if (firebaseConfig.firestoreDatabaseId) {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }

  auth = getAuth(app);

  if (app) {
    try {
      storage = getStorage(app);
    } catch (stErr) {
      console.warn('Firebase storage init warning:', stErr);
    }
  }
} catch (error) {
  console.warn('Firebase initialization error, using local storage fallback:', error);
}

export { app, db, auth, storage };

// Helper to prevent hanging on network timeouts
function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore request timeout')), ms)
    ),
  ]);
}

const LOCAL_STORAGE_KEY_DRAFT = 'romantic_surprise_draft_v1';
const LOCAL_STORAGE_KEY_PUBLISHED = 'romantic_surprise_published_v1';
const LOCAL_STORAGE_KEY_MEMORIES = 'romantic_surprise_memories_v1';
const LOCAL_STORAGE_KEY_SONGS = 'romantic_surprise_songs_v1';

// Get Local Fallback
export function getLocalConfig(isPublished = false): AppConfig {
  const key = isPublished ? LOCAL_STORAGE_KEY_PUBLISHED : LOCAL_STORAGE_KEY_DRAFT;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fallback
    }
  }
  return INITIAL_DEFAULT_CONFIG;
}

export function setLocalConfig(config: AppConfig, isPublished = false) {
  const key = isPublished ? LOCAL_STORAGE_KEY_PUBLISHED : LOCAL_STORAGE_KEY_DRAFT;
  localStorage.setItem(key, JSON.stringify(config));
}

export function getLocalMemories(): MemoryPhoto[] {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MEMORIES);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return INITIAL_DEFAULT_MEMORIES;
}

export function setLocalMemories(memories: MemoryPhoto[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY_MEMORIES, JSON.stringify(memories));
}

export function getLocalSongs(): Song[] {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SONGS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return INITIAL_DEFAULT_SONGS;
}

export function setLocalSongs(songs: Song[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
}

// Firestore Operations
export async function fetchAppConfig(isPublished = false): Promise<AppConfig> {
  const docId = isPublished ? 'published' : 'draft';
  if (db) {
    try {
      const configDoc = doc(db, 'appConfig', docId);
      const snap = await withTimeout(getDoc(configDoc), 4000);
      if (snap.exists()) {
        return snap.data() as AppConfig;
      }
      
      // If docId doesn't exist, try alternative docId before defaulting
      const altDocId = isPublished ? 'draft' : 'published';
      const altDoc = doc(db, 'appConfig', altDocId);
      const altSnap = await withTimeout(getDoc(altDoc), 4000);
      if (altSnap.exists()) {
        const altData = altSnap.data() as AppConfig;
        await setDoc(configDoc, altData).catch(() => {});
        return altData;
      }

      // Initialize defaults in Firestore if empty
      await setDoc(doc(db, 'appConfig', 'draft'), INITIAL_DEFAULT_CONFIG).catch(() => {});
      await setDoc(doc(db, 'appConfig', 'published'), INITIAL_DEFAULT_CONFIG).catch(() => {});
      return INITIAL_DEFAULT_CONFIG;
    } catch (e) {
      console.warn('Firestore fetch config fallback to local:', e);
    }
  }
  return getLocalConfig(isPublished);
}

export async function saveAppConfig(config: AppConfig, isPublished = false): Promise<void> {
  const updatedConfig = { ...config, updatedAt: new Date().toISOString() };
  setLocalConfig(updatedConfig, false);
  setLocalConfig(updatedConfig, true);

  if (db) {
    try {
      const draftDoc = doc(db, 'appConfig', 'draft');
      const pubDoc = doc(db, 'appConfig', 'published');
      await withTimeout(
        Promise.all([
          setDoc(draftDoc, updatedConfig, { merge: true }),
          setDoc(pubDoc, updatedConfig, { merge: true }),
        ]),
        5000
      );
    } catch (e) {
      console.warn('Firestore save config error (local fallback saved):', e);
    }
  }
}

export async function publishDraftToLive(draftConfig: AppConfig): Promise<void> {
  await saveAppConfig(draftConfig, true);
}

export async function fetchMemories(): Promise<MemoryPhoto[]> {
  if (db) {
    try {
      const colRef = collection(db, 'memories');
      const snap = await withTimeout(getDocs(colRef), 4000);
      if (!snap.empty) {
        const list: MemoryPhoto[] = [];
        snap.forEach((d) => list.push(d.data() as MemoryPhoto));
        list.sort((a, b) => a.order - b.order);
        return list;
      } else {
        // Seed default memories to Firestore
        for (const mem of INITIAL_DEFAULT_MEMORIES) {
          await setDoc(doc(db, 'memories', mem.id), mem).catch(() => {});
        }
        return INITIAL_DEFAULT_MEMORIES;
      }
    } catch (e) {
      console.warn('Firestore memories fetch error, using local:', e);
    }
  }
  return getLocalMemories();
}

export async function saveMemories(memories: MemoryPhoto[]): Promise<void> {
  setLocalMemories(memories);
  if (db) {
    try {
      const colRef = collection(db, 'memories');
      const existingSnap = await withTimeout(getDocs(colRef), 4000);
      const existingIds = new Set<string>();
      existingSnap.forEach((d) => existingIds.add(d.id));

      const newIds = new Set(memories.map((m) => m.id));

      // Remove deleted memory documents
      const deletePromises: Promise<void>[] = [];
      existingIds.forEach((id) => {
        if (!newIds.has(id)) {
          deletePromises.push(deleteDoc(doc(db, 'memories', id)));
        }
      });
      await Promise.all(deletePromises);

      // Save updated memory list
      const setPromises = memories.map((mem) => setDoc(doc(db, 'memories', mem.id), mem));
      await Promise.all(setPromises);
    } catch (e) {
      console.warn('Firestore memories save error (local saved):', e);
    }
  }
}

export async function uploadAudioToStorage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized.');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `songs/${Date.now()}_${cleanFileName}`);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || 'audio/mpeg',
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('Upload to Firebase Storage failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export async function fetchSongs(): Promise<Song[]> {
  if (db) {
    try {
      const colRef = collection(db, 'songs');
      const snap = await withTimeout(getDocs(colRef), 4000);
      if (!snap.empty) {
        const list: Song[] = [];
        snap.forEach((d) => {
          const s = d.data() as Song;
          // Clean out legacy base64 data strings if present
          if (s.url && s.url.startsWith('data:audio')) {
            s.url = '';
          }
          if (s.url) {
            list.push(s);
          }
        });
        list.sort((a, b) => a.order - b.order);
        if (list.length > 0) {
          return list;
        }
      }

      // Seed default songs to Firestore
      for (const song of INITIAL_DEFAULT_SONGS) {
        await setDoc(doc(db, 'songs', song.id), song).catch(() => {});
      }
      return INITIAL_DEFAULT_SONGS;
    } catch (e) {
      console.warn('Firestore songs fetch error, using local:', e);
    }
  }
  return getLocalSongs().filter((s) => s.url && !s.url.startsWith('data:audio'));
}

export async function saveSongs(songs: Song[]): Promise<void> {
  // Never save base64 strings in local storage or Firestore
  const cleanSongs = songs.filter((s) => s.url && !s.url.startsWith('data:audio'));
  setLocalSongs(cleanSongs);

  if (db) {
    try {
      const colRef = collection(db, 'songs');
      const existingSnap = await withTimeout(getDocs(colRef), 4000);
      const existingIds = new Set<string>();
      existingSnap.forEach((s) => existingIds.add(s.id));

      const newIds = new Set(cleanSongs.map((s) => s.id));

      // Remove deleted song documents
      const deletePromises: Promise<void>[] = [];
      existingIds.forEach((id) => {
        if (!newIds.has(id)) {
          deletePromises.push(deleteDoc(doc(db, 'songs', id)));
        }
      });
      await Promise.all(deletePromises);

      // Save each song as a separate document in the songs collection
      const setPromises = cleanSongs.map((song) => {
        const docPayload: Record<string, any> = {
          id: song.id,
          title: song.title || 'Untitled Song',
          url: song.url,
          order: song.order || 1,
          isDefault: Boolean(song.isDefault),
        };
        if (song.duration) docPayload.duration = song.duration;
        if (song.fileName) docPayload.fileName = song.fileName;

        return setDoc(doc(db, 'songs', song.id), docPayload);
      });
      await Promise.all(setPromises);
    } catch (e) {
      console.warn('Firestore songs save error (local saved):', e);
    }
  }
}

export function subscribeToConfig(
  isPublished: boolean,
  callback: (config: AppConfig) => void
) {
  const docId = isPublished ? 'published' : 'draft';
  if (db) {
    const configDoc = doc(db, 'appConfig', docId);
    return onSnapshot(
      configDoc,
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as AppConfig);
        }
      },
      (err) => {
        console.warn('Firestore subscription error:', err);
      }
    );
  }
  return () => {};
}

// Persistent Floating Music Player Position State
const LOCAL_STORAGE_KEY_MUSIC_POS = 'romantic_surprise_music_player_pos_v1';

export interface WidgetPosition {
  x: number;
  y: number;
}

export async function fetchMusicPlayerPosition(): Promise<WidgetPosition | null> {
  if (db) {
    try {
      const posDoc = doc(db, 'widgetState', 'musicPlayer');
      const snap = await withTimeout(getDoc(posDoc), 3000);
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data.x === 'number' && typeof data.y === 'number') {
          const pos = { x: data.x, y: data.y };
          localStorage.setItem(LOCAL_STORAGE_KEY_MUSIC_POS, JSON.stringify(pos));
          return pos;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch position error, using local fallback:', e);
    }
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MUSIC_POS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
        return parsed;
      }
    } catch {}
  }

  return null;
}

export async function saveMusicPlayerPosition(pos: WidgetPosition): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_KEY_MUSIC_POS, JSON.stringify(pos));
  if (db) {
    try {
      const posDoc = doc(db, 'widgetState', 'musicPlayer');
      await setDoc(posDoc, { x: pos.x, y: pos.y, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Firestore save position error (local fallback saved):', e);
    }
  }
}

// Secure Admin Passcode Authentication with SHA-256 and Firestore
async function hashPasscode(passcode: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPasscode(enteredPasscode: string): Promise<boolean> {
  const enteredHash = await hashPasscode(enteredPasscode);

  if (db) {
    try {
      const passDocRef = doc(db, 'adminAuth', 'passcode');
      const snap = await withTimeout(getDoc(passDocRef), 4000);
      if (snap.exists()) {
        const storedHash = snap.data().hash;
        return enteredHash === storedHash;
      } else {
        // Seed default passcode hash to Firestore
        const defaultHash = await hashPasscode('9875');
        await setDoc(passDocRef, {
          hash: defaultHash,
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
        return enteredHash === defaultHash;
      }
    } catch (e) {
      console.warn('Firestore passcode verification error, falling back to secure hash check:', e);
    }
  }

  const defaultHash = await hashPasscode('9875');
  return enteredHash === defaultHash;
}


