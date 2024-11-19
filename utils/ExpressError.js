export const expressError = class expressError extends Error {
  constructor(status = 500, message = "Internal Server Error") {
    super();
    this.status = status;
    this.message = message;
  }
};
