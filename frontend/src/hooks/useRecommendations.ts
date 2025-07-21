import { useQuery } from '@tanstack/react-query';
import {
  fetchRecommendations,
  fetchExistingUserRecommendations,
  fetchNewUserRecommendations,
} from '../services/recommendations';

// General recommendations (not user-specific)
export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
  });
};

// Recommendations for users with existing interaction history
export const useExistingUserRecommendations = (userId: string) => {
  return useQuery({
    queryKey: ['recommendations', 'existing-user', userId],
    queryFn: () => fetchExistingUserRecommendations(userId),
    enabled: !!userId,
  });
};

// Recommendations for users without interaction history (cold start)
export const useNewUserRecommendations = (numRecommendations: number = 10) => {
  return useQuery({
    queryKey: ['recommendations', 'new-user', numRecommendations],
    queryFn: () => fetchNewUserRecommendations(numRecommendations),
  });
};
