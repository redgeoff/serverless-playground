import { ErrorObject } from 'ajv';
import {
  APIGatewayProxyEvent,
  Callback,
  Context,
  Handler as LambdaHandler,
} from 'aws-lambda';
import uuid from 'uuid';
import { ajv } from './ajv';
import {
  badRequestResponse as badRequestRes,
  BadRequestResponseType,
  successResponse as successRes,
  SuccessResponseType,
} from './lambda-response';
import log from './log';
import ResponseError from './response-error';
import { runWarm as runWarmly, RunWarmType } from './run-warm';
import UserContext, { Groups } from './user-context';
import ValidationError from './validation-error';

// Tighten the definition so that null is not allowed. This will allow us to avoid testing branches
// will null values. Our JSON Schema layer will enforce use of nulls.
interface Parameters {
  [name: string]: string;
}

export interface HandlerEvent extends APIGatewayProxyEvent {
  parsedBody: any;
  pathParameters: Parameters;
  queryStringParameters: Parameters;
  userContext: UserContext;
}

export interface Schemas {
  pathParameters?: any;
  queryStringParameters?: any;
  body?: any;
}

export class Handler {
  protected badRequestResponse: BadRequestResponseType;
  protected successResponse: SuccessResponseType;
  protected runWarm: RunWarmType;

  constructor({
    badRequestResponse,
    successResponse,
    runWarm,
  }: {
    badRequestResponse: BadRequestResponseType;
    runWarm: RunWarmType;
    successResponse: SuccessResponseType;
  }) {
    this.badRequestResponse = badRequestResponse;
    this.runWarm = runWarm;
    this.successResponse = successResponse;
  }

  // Note: use async so that we can easily switch to another validation engine, like yup. We don't use
  // allError=true as we want to save CPU cycles by bailing as soon as we detect an error.
  public async validate(schema: any, data: any) {
    const valid: boolean = ajv.validate(schema, data) as boolean;
    return { errors: ajv.errors, valid };
  }

  public innerFactory({
    handlerFactory,
    schemas,
    groups,
  }: {
    handlerFactory: LambdaHandler;
    schemas: Schemas;
    groups: Groups;
  }) {
    return async (
      event: HandlerEvent,
      context: Context,
      callback: Callback
    ) => {
      return this.handleRequest(
        handlerFactory,
        schemas,
        groups,
        event,
        context,
        callback
      );
    };
  }

  public factory({
    handlerFactory,
    schemas,
    groups,
  }: {
    handlerFactory: LambdaHandler;
    schemas: Schemas;
    groups: Groups;
  }) {
    return this.runWarm(
      this.innerFactory({
        groups,
        handlerFactory,
        schemas,
      })
    );
  }

  public parseBody(event: HandlerEvent) {
    // Note: event.headers can be falsy when invoking the function via serverless
    if (event.headers && event.headers['Content-Type'] === 'application/json') {
      // The body is JSON. Let's parse it once here and make it available to all the handlers
      event.parsedBody = JSON.parse(event.body || '{}');
    }
  }

  public async validateRequest({
    schemas,
    event,
  }: {
    schemas: Schemas;
    event: HandlerEvent;
  }) {
    const { pathParameters, queryStringParameters, body } = schemas;

    if (pathParameters) {
      const validated = await this.validate(
        pathParameters,
        event.pathParameters
      );
      if (!validated.valid) {
        throw new ValidationError(this.getFirstError(validated));
      }
    }

    if (queryStringParameters) {
      const validated = await this.validate(
        queryStringParameters,
        event.queryStringParameters
      );
      if (!validated.valid) {
        throw new ValidationError(this.getFirstError(validated));
      }
    }

    if (body) {
      const validated = await this.validate(body, event.parsedBody);
      if (!validated.valid) {
        throw new ValidationError(this.getFirstError(validated));
      }
    }
  }

  public getFirstError(validated: {
    errors: ErrorObject[] | null | undefined;
  }) {
    const firstError =
      validated.errors && validated.errors[0] && validated.errors[0].message;
    return firstError || '';
  }

  public fromBearer(bearer: string) {
    return bearer && bearer.replace('Bearer ', '');
  }

  public fromBearers(event: HandlerEvent) {
    return {
      endUserAccessToken: this.fromBearer(event.headers.authorization),
      externalAPIKey: this.fromBearer(event.headers['x-api-key']),
      internalAPIKey: this.fromBearer(event.headers['x-internal-api-key']),
    };
  }

  protected assertAuth(event: HandlerEvent, groups: Groups) {
    event.userContext.assertAuthorized(groups);
  }

  protected async createUserContext(event: HandlerEvent) {
    event.userContext = new UserContext();
    await event.userContext.load(this.fromBearers(event));
  }

  protected async handleRequest(
    handlerFactory: LambdaHandler,
    schemas: Schemas,
    groups: Groups,
    event: HandlerEvent,
    context: Context,
    callback: Callback
  ) {
    const id = uuid.v4();

    try {
      log.info({ id, type: 'request', event });

      await this.createUserContext(event);

      this.assertAuth(event, groups);

      this.parseBody(event);

      await this.validateRequest({
        event,
        schemas,
      });

      const response = await handlerFactory(event, context, callback);

      log.info({ id, type: 'response', response });

      return this.successResponse(response);
    } catch (err) {
      if (err instanceof ResponseError) {
        log.info({ id, type: 'response', err });
        return this.badRequestResponse(err);
      } else {
        // Error is unexpected!
        log.error({ id, err });
        throw err;
      }
    }
  }
}

export default new Handler({
  badRequestResponse: badRequestRes,
  runWarm: runWarmly,
  successResponse: successRes,
});
