import { useState, useEffect, useMemo } from 'react';
import type { Trivia } from '../types/Trivia';
import type { ITriviaApiService } from '../api_services/interfaces/ITriviaApiService';
import { TriviaApiService } from '../api_services/services/TriviaApiService';

export function useTrivias(contentIds: number[], contentType: 'movie' | 'series' = 'movie') {
  const [trivias, setTrivias] = useState<Record<number, Trivia[]>>({});
  const triviaService: ITriviaApiService = useMemo(() => new TriviaApiService(), []);

  useEffect(() => {
    if (contentIds.length > 0) {
      contentIds.forEach(async (contentId) => {
        if (!trivias[contentId]) {
          try {
            const data = await triviaService.getTriviasByContent(contentId, contentType);
            setTrivias(prev => ({ ...prev, [contentId]: data }));
          } catch (error) {
            console.warn(`Failed to load trivia for ${contentType} ${contentId}:`, error);
          }
        }
      });
    }
  }, [contentIds, contentType, triviaService, trivias]);

  return trivias;
}
