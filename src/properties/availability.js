import { successResponse, runWarm, badRequestResponse } from '../utils';

const availability = async (event, context) => {
  const propertyId = event.pathParameters.propertyId;
  if (propertyId === '123') {
    return badRequestResponse({ errorMessage: 'cannot be 123' })
  }
  return successResponse({ foo: 'bar', propertyId });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(availability);
