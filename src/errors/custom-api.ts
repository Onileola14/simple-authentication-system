export class CustomAPIError extends Error {
  statusCode?: number;

  constructor(message: string) {
    super(message);
  }
}
