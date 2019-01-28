import { APIGatewayProxyEvent } from 'aws-lambda';
// import * as yup from 'yup';
import { badRequestResponse, runWarm, successResponse } from '../utils';
import Ajv from 'ajv';

// TODO: move to ajv.js
const ajv = new Ajv();

// const schema = yup.object().shape({
//   // TODO: This is just a proof of concept and not necessarily the proper format for the id
//   propertyId: yup.number().required().integer(),
// });

// export const isValid = async (pathParameters: APIGatewayProxyEvent['pathParameters']) => schema.isValid(pathParameters);

const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/product.schema.json",
  // "title": "Property",
  // "description": "A property",
  "type": "object",
  "properties": {
    "propertyId": {
      // "description": "The unique identifier for a property",
      "type": "integer"
    }
  },
  "required": [ "propertyId" ]
};

// Note: use async so that can easily be swapped with yup, if we decide to change
export const validate = async (pathParameters: APIGatewayProxyEvent['pathParameters']) => ({
  valid: ajv.validate(schema, pathParameters),
  errors: ajv.errors
})

const availability = async (event: APIGatewayProxyEvent /* , context */) => {
  const validated = await validate(event.pathParameters);
  if (!validated.valid) {
    // TODO: properly convert errors into errorMessage
    return badRequestResponse({ errorMessage: JSON.stringify(validated.errors) });
  }

  // With yup
  // if (!(await isValid(event.pathParameters))) {
  //   // TODO: use yup to actually report details of why the data is invalid
  //   return badRequestResponse({ errorMessage: 'yup says no' });
  // }

  const { propertyId= undefined } = event.pathParameters || {};
  if (propertyId === '123') {
    return badRequestResponse({ errorMessage: 'cannot be 123' });
  }
  return successResponse({ foo: 'bar', propertyId });
};

export function foo(thing: string) {
  return thing;
}

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(availability);
