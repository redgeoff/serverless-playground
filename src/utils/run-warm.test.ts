import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { runWarm } from './run-warm';

it('runWarm should ping', () => {
  const callback = jest.fn();
  const handler = jest.fn();

  const wrappedHandler = runWarm(handler);

  const mockedEvent = {
    resource: 'aws.events',
  };
  const mockedContext = {};

  wrappedHandler(
    (mockedEvent as unknown) as APIGatewayProxyEvent,
    (mockedContext as unknown) as Context,
    callback
  );

  expect(callback).toHaveBeenCalledWith(null, 'pinged');
  expect(handler).toHaveBeenCalledTimes(0);
});

it('runWarm should run handler', () => {
  const callback = jest.fn();
  const handler = jest.fn();

  const wrappedHandler = runWarm(handler);

  const mockedEvent = {
    resource: null,
  };
  const mockedContext = {};

  const event = (mockedEvent as unknown) as APIGatewayProxyEvent;
  const context = (mockedContext as unknown) as Context;

  wrappedHandler(event, context, callback);

  expect(callback).toHaveBeenCalledTimes(0);
  expect(handler).toHaveBeenCalledWith(event, context, callback);
});
