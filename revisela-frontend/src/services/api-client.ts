/**
 * API Client
 *
 * This file provides a unified way to make API requests using the endpoints defined in endpoints.ts.
 * It handles common API request needs like authentication, error handling, and response parsing.
 */
import { getAuthToken, handleUnauthorizedAccess } from '@/lib/auth-utils';

import { EndpointConfig } from './endpoints';

// Global function to handle 401 unauthorized errors
let handleUnauthorized: (() => void) | null = null;

// Function to set the unauthorized handler (will be called from app initialization)
export const setUnauthorizedHandler = (handler: () => void) => {
  handleUnauthorized = handler;
};

// Type for API request options
export interface ApiRequestOptions {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  withAuth?: boolean;
}

// Type for API response with generics for type safety
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

// Define better types to replace any
type ApiData = Record<string, unknown>;

/**
 * Makes an API request using the endpoint configuration
 *
 * @param endpoint The endpoint configuration
 * @param options Request options like body, params, headers
 * @returns Promise with typed response
 */
export async function apiRequest<T = ApiData>(
  endpoint: EndpointConfig,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { body, params, headers = {}, withAuth = true } = options;

    // Construct URL with query parameters if present
    let url = endpoint.url;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }

    // Setup headers with auth token if required
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (withAuth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Make the request
    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...requestHeaders, // merge any other headers you have (like auth)
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Parse the response
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    // console.log('Fetching class from:', url);
    // console.log('Headers being sent:', requestHeaders);

    if (!response.ok) {
      // Handle 401 Unauthorized errors globally
      if (response.status === 401) {
        // Use the centralized unauthorized handler first
        handleUnauthorizedAccess();

        // Also call the app-specific handler if set
        if (handleUnauthorized) {
          handleUnauthorized();
        }
      }

      // Handle API error responses
      const error = new Error(
        data?.message || `Request failed with status ${response.status}`
      );
      return {
        data: null,
        error,
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    // Handle network or other errors
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 0, // Network error or other client-side error
    };
  }
}

// Type for file upload request options
export interface FileUploadOptions {
  file: File;
  additionalFields?: Record<string, string>;
  fileFieldName?: string;
  headers?: Record<string, string>;
  withAuth?: boolean;
}

/**
 * Makes a file upload request using the endpoint configuration
 *
 * @param endpoint The endpoint configuration
 * @param options Upload options including file and additional fields
 * @returns Promise with typed response
 */
export async function uploadFile<T = ApiData>(
  endpoint: EndpointConfig,
  options: FileUploadOptions
): Promise<ApiResponse<T>> {
  try {
    const {
      file,
      additionalFields = {},
      fileFieldName,
      headers = {},
      withAuth = true,
    } = options;

    // Create FormData
    const formData = new FormData();

    // Add the file with the appropriate field name
    const fieldName =
      fileFieldName || endpoint.url.includes('profile')
        ? 'profileImage'
        : endpoint.url.includes('question')
          ? 'questionImage'
          : endpoint.url.includes('document')
            ? 'document'
            : 'image';

    formData.append(fieldName, file);

    // Add any additional fields
    Object.entries(additionalFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Setup headers with auth token if required
    const requestHeaders: HeadersInit = {
      // Don't set Content-Type for FormData, browser will set it with boundary
      ...headers,
    };

    if (withAuth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Make the request
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: requestHeaders,
      body: formData,
    });

    // Parse the response
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      // Handle 401 Unauthorized errors globally
      if (response.status === 401) {
        // Use the centralized unauthorized handler first
        handleUnauthorizedAccess();

        // Also call the app-specific handler if set
        if (handleUnauthorized) {
          handleUnauthorized();
        }
      }

      // Handle API error responses
      const error = new Error(
        data?.message || `Request failed with status ${response.status}`
      );
      return {
        data: null,
        error,
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    // Handle network or other errors
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status: 0, // Network error or other client-side error
    };
  }
}
