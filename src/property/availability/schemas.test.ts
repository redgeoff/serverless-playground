import Ajv from 'ajv';
import { propertyIdSchema } from './schemas';

const ajv = new Ajv({ allErrors: true });

it('should validate property', () => {
  // Success
  expect(
    ajv.validate(propertyIdSchema, {
      propertyId: '1',
    })
  ).toEqual(true);

  // Missing required fields
  expect(ajv.validate(propertyIdSchema, {})).toEqual(false);
  expect(ajv.errors).toMatchObject([
    { params: { missingProperty: 'propertyId' } },
  ]);

  // Invalid values
  expect(
    ajv.validate(propertyIdSchema, {
      propertyId: 1,
    })
  ).toEqual(false);
  expect(ajv.errors).toMatchObject([
    { dataPath: '.propertyId', message: 'should be string' },
  ]);
});
