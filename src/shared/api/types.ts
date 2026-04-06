export interface BaseResponse<T> {
	message: string;
	data: T;
	meta: unknown;
}

export interface ApiErrorResponse {
	error_code: string;
	message: string;
	detail?: unknown;
}

export class ApiClientError extends Error {
	readonly status: number;
	readonly errorCode?: string;
	readonly detail?: unknown;

	constructor(params: { status: number; message: string; errorCode?: string; detail?: unknown }) {
		super(params.message);
		this.name = 'ApiClientError';
		this.status = params.status;
		this.errorCode = params.errorCode;
		this.detail = params.detail;
	}
}
