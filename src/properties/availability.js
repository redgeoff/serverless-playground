import { successResponse, runWarm } from '../utils';

const availability = async (event, context) => {
  const propertyId = event.pathParameters.propertyId;
  return successResponse({ foo: 'bar', propertyId });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(availability);
