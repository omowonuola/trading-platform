export abstract class BaseHttpError {
    constructor(
      public readonly statusCode: number,
      public readonly message?: string
    ) {}
  }
  
  export class BadRequestError extends BaseHttpError {
    constructor(message?: string) {
      super(400, message);
    }
  }