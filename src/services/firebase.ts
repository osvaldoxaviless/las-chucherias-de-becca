import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { Product, StoreConfig } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { DEFAULT_STORE_CONFIG } from '../data/config';

export const firebaseConfig = {
  apiKey: "AIzaSyBSNW9C0wd1fRsh_NeSvSC22TEYMjczr6E",
  authDomain: "las-chucherias-de-becca.firebaseapp.com",
  projectId: "las-chucherias-de-becca",
  storageBucket: "las-chucherias-de-becca.firebasestorage.app",
  messagingSenderId: "732305051337",
  appId: "1:732305051337:web:fbcb1b05797b72d9e4c718"
};

// Check if running in a test environment to avoid real network sockets in Vitest
const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

let db: any = null;

if (!isTestEnv) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (err) {
    console.warn('⚠️ Could not initialize Firebase client, operating in offline fallback:', err);
  }
}

/**
 * Escucha cambios en tiempo real en la colección de productos de Firestore.
 * Sincroniza automáticamente celular y computadora.
 */
export function subscribeToProductsCloud(
  onUpdate: (products: Product[]) => void
): () => void {
  if (!db || isTestEnv) {
    return () => {};
  }

  const catalogRef = doc(db, 'store', 'catalog');

  const unsubscribe = onSnapshot(
    catalogRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          onUpdate(data.items);
          localStorage.setItem('chuches_products', JSON.stringify(data.items));
          return;
        }
      }
      // Si aún no existe el documento en Firestore, lo inicializamos con los productos por defecto
      try {
        await setDoc(catalogRef, { items: INITIAL_PRODUCTS, updatedAt: new Date().toISOString() });
      } catch (err) {
        console.error('Error seeding initial catalog to Firestore:', err);
      }
    },
    (error) => {
      console.warn('Firestore products sync warning:', error);
    }
  );

  return unsubscribe;
}

/**
 * Guarda el catálogo de productos directamente en Firestore para que se actualice en todos los dispositivos.
 */
export async function saveProductsCloud(products: Product[]): Promise<boolean> {
  // Always update localStorage immediately for instant local UI responsiveness
  localStorage.setItem('chuches_products', JSON.stringify(products));

  if (!db || isTestEnv) return true;

  try {
    const catalogRef = doc(db, 'store', 'catalog');
    await setDoc(catalogRef, {
      items: products,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Error saving products to Firestore:', err);
    return false;
  }
}

/**
 * Escucha cambios en tiempo real en los ajustes de la tienda en Firestore.
 */
export function subscribeToConfigCloud(
  onUpdate: (config: StoreConfig) => void
): () => void {
  if (!db || isTestEnv) {
    return () => {};
  }

  const configRef = doc(db, 'store', 'config');

  const unsubscribe = onSnapshot(
    configRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as StoreConfig;
        if (data && data.storeName) {
          onUpdate(data);
          localStorage.setItem('chuches_config', JSON.stringify(data));
          return;
        }
      }
      // Inicializar si no existe
      try {
        await setDoc(configRef, { ...DEFAULT_STORE_CONFIG, updatedAt: new Date().toISOString() });
      } catch (err) {
        console.error('Error seeding initial config to Firestore:', err);
      }
    },
    (error) => {
      console.warn('Firestore config sync warning:', error);
    }
  );

  return unsubscribe;
}

/**
 * Guarda los ajustes de la tienda directamente en Firestore.
 */
export async function saveConfigCloud(config: StoreConfig): Promise<boolean> {
  localStorage.setItem('chuches_config', JSON.stringify(config));

  if (!db || isTestEnv) return true;

  try {
    const configRef = doc(db, 'store', 'config');
    await setDoc(configRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Error saving config to Firestore:', err);
    return false;
  }
}
