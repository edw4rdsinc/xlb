// API helper functions for consistent error handling and data fetching

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      data,
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      success: false,
    }
  }
}

export async function postApi<T, D>(
  endpoint: string,
  data: D
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
