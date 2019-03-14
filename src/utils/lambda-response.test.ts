import { badRequestResponse, successResponse } from './lambda-response';
import ValidationError from './validation-error';

it('should create bad response', () => {
  const err = new ValidationError('my error');
  expect(badRequestResponse(err)).toEqual({
    body: JSON.stringify({
      errorCode: err.code,
      errorMessage: err.message,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 400,
  });
});

it('should success response', () => {
  const successObject = { foo: 'bar' };
  expect(successResponse(successObject)).toEqual({
    body: JSON.stringify(successObject),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
  });
});
