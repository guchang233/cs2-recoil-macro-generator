import { useState, useEffect, useCallback } from 'react';
import type { WeaponRecoilData } from '../types/weapon';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { readJSONFile } from '../utils/file';
import defaultWeapons from '../data/weapons.json';

const STORAGE_KEY = 'weapons-data';

interface UseWeaponDataReturn {
  weapons: WeaponRecoilData[];
  loading: boolean;
  error: string | null;
  loadFromUrl: (url: string) => Promise<void>;
  importFromFile: (file: File) => Promise<void>;
  resetToDefault: () => void;
  getWeaponById: (id: string) => WeaponRecoilData | undefined;
}

export function useWeaponData(): UseWeaponDataReturn {
  const [weapons, setWeapons] = useState<WeaponRecoilData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initializeData = useCallback(() => {
    try {
      setLoading(true);
      const cached = getStorageItem<WeaponRecoilData[] | null>(STORAGE_KEY, null);
      if (cached && cached.length > 0) {
        setWeapons(cached);
      } else {
        setWeapons(defaultWeapons as WeaponRecoilData[]);
      }
      setError(null);
    } catch (e) {
      setWeapons(defaultWeapons as WeaponRecoilData[]);
      setError(e instanceof Error ? e.message : 'Failed to initialize weapon data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const loadFromUrl = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as WeaponRecoilData[];
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected an array');
      }
      setWeapons(data);
      setStorageItem(STORAGE_KEY, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load weapon data from URL');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const importFromFile = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const data = await readJSONFile<WeaponRecoilData[]>(file);
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected an array');
      }
      setWeapons(data);
      setStorageItem(STORAGE_KEY, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import weapon data from file');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setWeapons(defaultWeapons as WeaponRecoilData[]);
    setStorageItem(STORAGE_KEY, defaultWeapons);
    setError(null);
  }, []);

  const getWeaponById = useCallback((id: string) => {
    return weapons.find(w => w.id === id);
  }, [weapons]);

  return {
    weapons,
    loading,
    error,
    loadFromUrl,
    importFromFile,
    resetToDefault,
    getWeaponById,
  };
}
