import ResponseError from './response-error';

export default class ValidationError extends ResponseError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message);
  }
}
