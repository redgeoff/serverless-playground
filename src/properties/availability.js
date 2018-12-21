import { successResponse, runWarm } from '../utils';

const availability = async (event, context) => {
  return successResponse({ foo: 'bar' });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(availability);
