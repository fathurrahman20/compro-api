import AppError from "./app.error";

class NotFoundError extends AppError {
  constructor(message: string = "The requested resource was not found.") {
    super(message, 404);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default NotFoundError;
