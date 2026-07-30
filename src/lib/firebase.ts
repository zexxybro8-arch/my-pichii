import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
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
} catch (error) {
  console.warn('Firebase initialization error, using local storage fallback:', error);
}

export { app, db, auth };

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
      const snap = await getDoc(configDoc);
      if (snap.exists()) {
        return snap.data() as AppConfig;
      } else {
        // Initialize default in Firestore
        await setDoc(configDoc, INITIAL_DEFAULT_CONFIG);
        return INITIAL_DEFAULT_CONFIG;
      }
    } catch (e) {
      console.warn('Firestore fetch config error:', e);
    }
  }
  return getLocalConfig(isPublished);
}

export async function saveAppConfig(config: AppConfig, isPublished = false): Promise<void> {
  const docId = isPublished ? 'published' : 'draft';
  const updatedConfig = { ...config, updatedAt: new Date().toISOString() };
  setLocalConfig(updatedConfig, isPublished);

  if (db) {
    try {
      const configDoc = doc(db, 'appConfig', docId);
      await setDoc(configDoc, updatedConfig, { merge: true });
    } catch (e) {
      console.warn('Firestore save config error:', e);
    }
  }
}

export async function publishDraftToLive(draftConfig: AppConfig): Promise<void> {
  await saveAppConfig(draftConfig, false); // save draft
  await saveAppConfig(draftConfig, true);  // copy to published
}

export async function fetchMemories(): Promise<MemoryPhoto[]> {
  if (db) {
    try {
      const colRef = collection(db, 'memories');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list: MemoryPhoto[] = [];
        snap.forEach((d) => list.push(d.data() as MemoryPhoto));
        list.sort((a, b) => a.order - b.order);
        return list;
      } else {
        // Seed default memories to Firestore
        for (const mem of INITIAL_DEFAULT_MEMORIES) {
          await setDoc(doc(db, 'memories', mem.id), mem);
        }
        return INITIAL_DEFAULT_MEMORIES;
      }
    } catch (e) {
      console.warn('Firestore memories fetch error:', e);
    }
  }
  return getLocalMemories();
}

export async function saveMemories(memories: MemoryPhoto[]): Promise<void> {
  setLocalMemories(memories);
  if (db) {
    try {
      for (const mem of memories) {
        await setDoc(doc(db, 'memories', mem.id), mem);
      }
    } catch (e) {
      console.warn('Firestore memories save error:', e);
    }
  }
}

export async function fetchSongs(): Promise<Song[]> {
  if (db) {
    try {
      const colRef = collection(db, 'songs');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list: Song[] = [];
        snap.forEach((d) => list.push(d.data() as Song));
        list.sort((a, b) => a.order - b.order);
        return list;
      } else {
        // Seed default songs to Firestore
        for (const song of INITIAL_DEFAULT_SONGS) {
          await setDoc(doc(db, 'songs', song.id), song);
        }
        return INITIAL_DEFAULT_SONGS;
      }
    } catch (e) {
      console.warn('Firestore songs fetch error:', e);
    }
  }
  return getLocalSongs();
}

export async function saveSongs(songs: Song[]): Promise<void> {
  setLocalSongs(songs);
  if (db) {
    try {
      for (const song of songs) {
        await setDoc(doc(db, 'songs', song.id), song);
      }
    } catch (e) {
      console.warn('Firestore songs save error:', e);
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
