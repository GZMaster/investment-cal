import { useState, useEffect } from 'react';
import type { Platform } from '../types/budget';
import { getDefaultPlatforms } from '../types/budget';

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const savedPlatforms = localStorage.getItem('customPlatforms');
    return savedPlatforms ? JSON.parse(savedPlatforms) : getDefaultPlatforms();
  });

  useEffect(() => {
    localStorage.setItem('customPlatforms', JSON.stringify(platforms));
  }, [platforms]);

  const addPlatform = (platform: Platform) => {
    setPlatforms(prev => [...prev, platform]);
  };

  const updatePlatform = (updatedPlatform: Platform) => {
    setPlatforms(prev =>
      prev.map(p => p.id === updatedPlatform.id ? updatedPlatform : p)
    );
  };

  const deletePlatform = (platformId: string) => {
    setPlatforms(prev => prev.filter(p => p.id !== platformId));
  };

  return {
    platforms,
    addPlatform,
    updatePlatform,
    deletePlatform,
  };
} 