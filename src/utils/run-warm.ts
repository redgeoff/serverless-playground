import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';

export type HandlerFactory = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => any;
export type RunWarmType = (lambdaFunc: Handler) => HandlerFactory;

export function runWarm(lambdaFunc: Handler) {
  return (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback
  ) => {
    // Detect the keep-alive ping from CloudWatch and exit early. This keeps our
    // lambda function running hot.
    if (event.resource === 'aws.events') {
      return callback(null, 'pinged');
    }

    return lambdaFunc(event, context, callback);
  };
}
