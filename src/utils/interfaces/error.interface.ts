export interface IError {
  message: string;
  statusCode: number;
  status: string;
  validationError?: string;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}
