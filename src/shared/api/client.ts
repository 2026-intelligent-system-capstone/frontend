import { ApiClientError, type ApiErrorResponse, type BaseResponse } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

interface RequestOptions extends Omit<RequestInit, 'body'> {
	body?: BodyInit | FormData | object | null;
}

const isFormData = (value: RequestOptions['body']): value is FormData => {
	return typeof FormData !== 'undefined' && value instanceof FormData;
};

export const buildApiUrl = (path: string): string => {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const buildHeaders = (headers: HeadersInit | undefined, body: RequestOptions['body']): Headers => {
	const nextHeaders = new Headers(headers);

	if (!isFormData(body) && body != null && !nextHeaders.has('Content-Type')) {
		nextHeaders.set('Content-Type', 'application/json');
	}

	if (!nextHeaders.has('Accept')) {
		nextHeaders.set('Accept', 'application/json');
	}

	return nextHeaders;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
	if (response.status === 204) {
		return undefined as T;
	}

	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) {
		return undefined as T;
	}

	return (await response.json()) as T;
};

const toRequestBody = (body: RequestOptions['body']): BodyInit | undefined => {
	if (body == null) {
		return undefined;
	}

	if (
		isFormData(body) ||
		typeof body === 'string' ||
		body instanceof URLSearchParams ||
		body instanceof Blob ||
		body instanceof ArrayBuffer
	) {
		return body;
	}

	return JSON.stringify(body);
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const response = await fetch(buildApiUrl(path), {
		...options,
		body: toRequestBody(options.body),
		credentials: 'include',
		headers: buildHeaders(options.headers, options.body),
	});

	if (!response.ok) {
		const error = await parseResponse<ApiErrorResponse>(response).catch(() => undefined);

		throw new ApiClientError({
			status: response.status,
			message: error?.message ?? '요청 처리 중 오류가 발생했습니다.',
			errorCode: error?.error_code,
			detail: error?.detail,
		});
	}

	return parseResponse<T>(response);
}

export const apiClient = {
	delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
	get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
	patch: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'PATCH', body }),
	post: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'POST', body }),
};

export type ApiResponse<T> = BaseResponse<T>;
