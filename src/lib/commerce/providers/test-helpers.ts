/**
 * Test helper utilities for mocking fetch responses
 */

/**
 * Creates a mock Response object for fetch with both json() and text() methods
 */
export function createMockResponse<T>(data: T, options: Partial<Response> = {}): Response {
  const jsonData = JSON.stringify(data);

  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    json: async () => data,
    text: async () => jsonData,
    ...options,
  } as Response;
}

/**
 * Creates a mock error Response object for fetch
 */
export function createMockErrorResponse(
  status: number,
  statusText: string,
  error?: { message?: string }
): Response {
  const errorData = error || {};
  const jsonData = JSON.stringify(errorData);

  return {
    ok: false,
    status,
    statusText,
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    json: async () => errorData,
    text: async () => jsonData,
  } as Response;
}

/**
 * Creates a mock 204 No Content Response
 */
export function createMock204Response(): Response {
  return {
    ok: true,
    status: 204,
    statusText: 'No Content',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    json: async () => { throw new Error('No content'); },
    text: async () => '',
  } as Response;
}
