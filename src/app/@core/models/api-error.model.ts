export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode?: number, message?: string) {
    super();

    this.statusCode = parseInt((statusCode || 400).toString());

    this.message = message || 'Ceva nu a mers bine.';
  }
}
