import { useState, useEffect } from 'react';
import type { Trivia } from '../types/Trivia';
import { ServiceFactory } from '../api_services/factories/ServiceFactory';

export function useTrivias(contentIds: number[], contentType: 'movie' | 'series' = 'movie') {
  const [trivias, setTrivias] = useState<Record<number, Trivia[]>>({});
  const triviaService = ServiceFactory.getTriviaService();

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
