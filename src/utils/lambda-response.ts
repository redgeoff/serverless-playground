import ResponseError from './response-error';

function lambdaResponse({
  json,
  statusCode,
}: {
  json: any;
  statusCode: number;
}) {
  const response = {
    body: JSON.stringify(json),
    headers: {
      // Enable CORS
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
  };

  return response;
}

export type BadRequestResponseType = (error: ResponseError) => any;

export const badRequestResponse: BadRequestResponseType = (
  error: ResponseError
) => {
  return lambdaResponse({
    json: { errorCode: error.code, errorMessage: error.message },
    statusCode: 400,
  });
};

export type SuccessResponseType = (json: any) => any;

export const successResponse: SuccessResponseType = (json: any) => {
  return lambdaResponse({
    json,
    statusCode: 200,
  });
};
