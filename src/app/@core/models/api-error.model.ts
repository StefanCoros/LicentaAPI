export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();

    this.statusCode = parseInt(statusCode.toString()) || 400;

    this.message = message || 'Bad request';
  }
}
