import { APIGatewayProxyEvent } from "aws-lambda";
import * as yup from 'yup';
import { successResponse, runWarm, badRequestResponse } from '../utils';

const schema = yup.object().shape({
  // TODO: This is just a proof of concept and not necessarily the proper format for the id
  propertyId: yup.number().required().integer()
});

export const isValid = async (pathParameters: APIGatewayProxyEvent['pathParameters']) => schema.isValid(pathParameters)

const availability = async (event: APIGatewayProxyEvent /* , context */) => {
  if (!(await isValid(event.pathParameters))) {
    // TODO: use yup to actually report details of why the data is invalid
    return badRequestResponse({ errorMessage: 'yup says no' })
  }

  const { propertyId=undefined } = event.pathParameters || {};
  if (propertyId === '123') {
    return badRequestResponse({ errorMessage: 'cannot be 123' })
  }
  return successResponse({ foo: 'bar', propertyId });
};

export function foo(thing: string) {
  return thing
}

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(availability);
