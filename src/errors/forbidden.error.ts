import AppError from "./app.error";

class ForbiddenError extends AppError {
  constructor(message: string = "Access to this resource is forbidden.") {
    super(message, 403);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ForbiddenError;
