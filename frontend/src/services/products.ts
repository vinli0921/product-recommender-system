import type { ProductData } from '../types';
import {
  ApiLogger,
  ServiceLogger,
  type LogContext,
  type ApiRequestOptions,
} from '../utils/logging/logger';

// Enhanced API fetch utility using the new logger
async function apiRequest<T>(
  endpoint: string,
  operation: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const context = ApiLogger.startRequest(operation, endpoint, options);

  try {
    const { method = 'GET', body, headers } = options;
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    ApiLogger.logRequest(context, requestOptions);
    const response = await fetch(endpoint, requestOptions);
    ApiLogger.logResponseReceived(context, response);

    if (!response.ok) {
      let errorDetails = '';
      try {
        errorDetails = await response.text();
      } catch (e) {
        errorDetails = 'Could not read error response';
      }

      ApiLogger.logError(
        context,
        new Error(`HTTP ${response.status}: ${response.statusText}. ${errorDetails}`),
        response
      );
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${errorDetails}`
      );
    }

    const data = (await response.json()) as T;
    ApiLogger.logDataParsing(context, data);

    // Calculate response size for logging
    let dataSize: string | number = 'unknown';
    if (Array.isArray(data)) {
      dataSize = `${data.length} items`;
    } else if (typeof data === 'object' && data !== null) {
      dataSize = `${Object.keys(data as object).length} properties`;
    }

    ApiLogger.logResponse(context, response, dataSize);
    return data;
  } catch (error) {
    ApiLogger.logError(context, error);
    throw error;
  }
}

// Product service functions with clean logging
export const fetchRecommendations = async (): Promise<ProductData[]> => {
  ServiceLogger.logServiceCall('fetchRecommendations');
  return apiRequest<ProductData[]>('/api/recommendations', 'fetchRecommendations');
};

export const fetchWishlist = async (): Promise<ProductData[]> => {
  ServiceLogger.logServiceCall('fetchWishlist');
  const context = ApiLogger.startRequest('fetchWishlist', '/api/wishlist/{user_id}');

  try {
    ApiLogger.logWarning(context, 'Artificial delay added for testing', { delay: '3000ms' });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return await apiRequest<ProductData[]>(`/api/wishlist/{user_id}`, 'fetchWishlist');
  } catch (error) {
    ServiceLogger.logServiceError('fetchWishlist', error);
    ApiLogger.logError(context, error);
    throw error;
  }
};

export const fetchCatalog = async (): Promise<ProductData[]> => {
  ServiceLogger.logServiceCall('fetchCatalog');
  return apiRequest<ProductData[]>('/api/products/search', 'fetchCatalog');
};

export const searchProducts = async (query: string): Promise<ProductData[]> => {
  ServiceLogger.logServiceCall('searchProducts', { query });

  if (!query || query.trim().length === 0) {
    ServiceLogger.logServiceWarning('searchProducts', 'Empty search query provided');
    return [];
  }

  // TEMPORARY: Using recommendations endpoint since /products/search is not deployed
  ServiceLogger.logServiceWarning('searchProducts', 'Using recommendations endpoint as fallback', {
    originalQuery: query,
    reason: 'products/search endpoint not available in current deployment',
  });

  // Use a default user ID for now - you might want to get this from auth context
  const userId = 1;
  const endpoint = `/api/recommendations/${userId}`;

  return apiRequest<ProductData[]>(endpoint, 'searchProducts-fallback', {
    headers: { 'X-Original-Search-Query': query },
  });
};
