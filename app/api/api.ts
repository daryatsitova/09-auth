export interface ApiError {
  message: string;
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
}

export class ApiErrorClass extends Error implements ApiError {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };

  constructor(message: string, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}
