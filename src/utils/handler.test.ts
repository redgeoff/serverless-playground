import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import handler, { Handler, HandlerEvent } from './handler';
import ResponseError from './response-error';
import { runWarm } from './run-warm';
import ValidationError from './validation-error';

const propertySchema = {
  $id: 'http://example.com/product.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',

  properties: {
    name: {
      type: 'string',
    },
    propertyId: {
      type: 'number',
    },
  },

  required: ['propertyId', 'name'],
  type: 'object',
};

class MyResponseError extends ResponseError {
  constructor(message: string) {
    super('MY_RESPONSE_ERROR', message);
  }
}

function toHandlerEvent(eventObject: any) {
  return (eventObject as unknown) as HandlerEvent;
}

it('should validate', async () => {
  let validated = await handler.validate(propertySchema, {});
  expect(validated.valid).toEqual(false);
  let firstError =
    validated.errors && validated.errors[0] && validated.errors[0].message;
  expect(firstError).toEqual("should have required property 'name'");

  validated = await handler.validate(propertySchema, {
    name: 'ABC Property',
  });
  expect(validated.valid).toEqual(false);
  firstError =
    validated.errors && validated.errors[0] && validated.errors[0].message;
  expect(firstError).toEqual("should have required property 'propertyId'");

  validated = await handler.validate(propertySchema, {
    name: 'ABC Property',
    propertyId: 1,
  });
  expect(validated.valid).toEqual(true);
  expect(validated.errors).toBeNull();
});

it('should process successful request', async () => {
  const badRequestResponse = jest.fn();
  const successResponse = jest.fn();
  const mockedRunWarm = jest.fn().mockImplementation(runWarm);

  const mockedHandler = new Handler({
    badRequestResponse,
    runWarm: mockedRunWarm,
    successResponse,
  });

  const parseBody = jest.spyOn(mockedHandler, 'parseBody');

  const mockedEvent = {
    headers: {},
    pathParameters: {
      name: 'ABC',
      propertyId: 1,
    },
  };
  const mockedContext = {};
  const mockedCallback = {};

  const handlerFactory = jest
    .fn()
    .mockImplementation(
      async (
        event: APIGatewayProxyEvent,
        context: Context,
        callback: Callback
      ) => {
        expect(event).toEqual(mockedEvent);
        expect(context).toEqual(mockedContext);
        expect(callback).toEqual(mockedCallback);
        return { foo: 'bar' };
      }
    );

  const fun = mockedHandler.factory({
    groups: {},
    handlerFactory,
    schemas: { pathParameters: propertySchema },
  });
  await fun(
    (mockedEvent as unknown) as APIGatewayProxyEvent,
    (mockedContext as unknown) as Context,
    (mockedCallback as unknown) as Callback
  );
  expect(handlerFactory).toHaveBeenCalledWith(
    mockedEvent,
    mockedContext,
    mockedCallback
  );
  expect(successResponse).toHaveBeenCalledWith({ foo: 'bar' });
  expect(successResponse).toHaveBeenCalledTimes(1);
  expect(badRequestResponse).toHaveBeenCalledTimes(0);
  expect(mockedRunWarm).toHaveBeenCalledTimes(1);
  expect(parseBody).toHaveBeenCalledWith(mockedEvent);
});

it('should process validation error', async () => {
  const badRequestResponse = jest.fn();
  const successResponse = jest.fn();
  const mockedRunWarm = jest.fn();

  const mockedHandler = new Handler({
    badRequestResponse,
    runWarm: mockedRunWarm,
    successResponse,
  });

  const mockedEvent = {
    headers: {},
    pathParameters: {
      name: 'ABC',
    },
  };
  const mockedContext = {};
  const mockedCallback = {};

  const handlerFactory = jest.fn().mockImplementation();

  const fun = mockedHandler.innerFactory({
    groups: {},
    handlerFactory,
    schemas: { pathParameters: propertySchema },
  });
  await fun(
    toHandlerEvent(mockedEvent),
    (mockedContext as unknown) as Context,
    (mockedCallback as unknown) as Callback
  );
  expect(handlerFactory).toHaveBeenCalledTimes(0);
  expect(successResponse).toHaveBeenCalledTimes(0);
  expect(badRequestResponse).toHaveBeenCalledWith(
    new ValidationError("should have required property 'propertyId'")
  );
});

it('should process response error in handlerFactory', async () => {
  const badRequestResponse = jest.fn();
  const successResponse = jest.fn();
  const mockedRunWarm = jest.fn();

  const mockedHandler = new Handler({
    badRequestResponse,
    runWarm: mockedRunWarm,
    successResponse,
  });

  const mockedEvent = {
    headers: {},
    pathParameters: {
      name: 'ABC',
      propertyId: 1,
    },
  };
  const mockedContext = {};
  const mockedCallback = {};

  const err = new MyResponseError('my error');

  const handlerFactory = jest.fn().mockImplementation(async () => {
    throw err;
  });

  const fun = mockedHandler.innerFactory({
    groups: {},
    handlerFactory,
    schemas: { pathParameters: propertySchema },
  });
  await fun(
    toHandlerEvent(mockedEvent),
    (mockedContext as unknown) as Context,
    (mockedCallback as unknown) as Callback
  );
  expect(handlerFactory).toHaveBeenCalledTimes(1);
  expect(successResponse).toHaveBeenCalledTimes(0);
  expect(badRequestResponse).toHaveBeenCalledWith(err);
  expect(badRequestResponse).toHaveBeenCalledTimes(1);
});

it('should process non-response error in handlerFactory', async () => {
  const badRequestResponse = jest.fn();
  const successResponse = jest.fn();
  const mockedRunWarm = jest.fn();

  const mockedHandler = new Handler({
    badRequestResponse,
    runWarm: mockedRunWarm,
    successResponse,
  });

  const mockedEvent = {
    headers: {},
    pathParameters: {
      name: 'ABC',
      propertyId: 1,
    },
  };
  const mockedContext = {};
  const mockedCallback = {};

  const err = new Error('my error');

  const handlerFactory = jest.fn().mockImplementation(async () => {
    throw err;
  });

  const fun = mockedHandler.innerFactory({
    groups: {},
    handlerFactory,
    schemas: { pathParameters: propertySchema },
  });
  await expect(
    fun(
      toHandlerEvent(mockedEvent),
      (mockedContext as unknown) as Context,
      (mockedCallback as unknown) as Callback
    )
  ).rejects.toEqual(err);
  expect(handlerFactory).toHaveBeenCalledTimes(1);
  expect(successResponse).toHaveBeenCalledTimes(0);
  expect(badRequestResponse).toHaveBeenCalledTimes(0);
  // TODO: make sure error was logged
});

it('should parseBody', () => {
  const body = {
    name: 'ABC',
    propertyId: 1,
  };

  const mockedEvent1 = {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    parsedBody: null,
  };
  handler.parseBody(toHandlerEvent(mockedEvent1));
  expect(mockedEvent1.parsedBody).toEqual(body);

  const mockedEvent2 = {
    body: null,
    headers: { 'Content-Type': 'application/json' },
    parsedBody: null,
  };
  handler.parseBody(toHandlerEvent(mockedEvent2));
  expect(mockedEvent2.parsedBody).toEqual({});
});

const shouldValidateParameters = async (
  schemaName: string,
  propertyName: string
) => {
  const mockedEvent1 = {
    [propertyName]: {
      name: 'ABC',
    },
  };
  await expect(
    handler.validateRequest({
      event: toHandlerEvent(mockedEvent1),
      schemas: {
        [schemaName]: propertySchema,
      },
    })
  ).rejects.toEqual(
    new ValidationError("should have required property 'propertyId'")
  );

  const mockedEvent2 = {
    [propertyName]: {
      name: 'ABC',
      propertyId: 1,
    },
  };
  // Doesn't throw as there is no validation error
  await handler.validateRequest({
    event: toHandlerEvent(mockedEvent2),
    schemas: {
      [schemaName]: propertySchema,
    },
  });
};

it('should validate path parameters', async () => {
  await shouldValidateParameters('pathParameters', 'pathParameters');
});

it('should validate query string parameters', async () => {
  await shouldValidateParameters(
    'queryStringParameters',
    'queryStringParameters'
  );
});

it('should validate body', async () => {
  await shouldValidateParameters('body', 'parsedBody');
});

it('should get first error when no errors', () => {
  // Note: this is needed to test the code needed for Typescript
  expect(handler.getFirstError({ errors: null })).toEqual('');
});

it('should get tokens from bearers', () => {
  const endUserAccessToken = 'authorizationToken';
  const externalAPIKey = 'externalAPIKey';
  const internalAPIKey = 'internalAPIKey';

  const mockedEvent = {
    headers: {
      authorization: `Bearer ${endUserAccessToken}`,
      'x-api-key': `Bearer ${externalAPIKey}`,
      'x-internal-api-key': `Bearer ${internalAPIKey}`,
    },
  };

  expect(handler.fromBearers(toHandlerEvent(mockedEvent))).toEqual({
    endUserAccessToken,
    externalAPIKey,
    internalAPIKey,
  });

  expect(handler.fromBearer('')).toEqual('');
});
