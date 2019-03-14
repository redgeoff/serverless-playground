import Ajv from 'ajv';
import { createPropertySchema } from './schemas';

const ajv = new Ajv({ allErrors: true });

it('should validate property', () => {
  // Success
  expect(
    ajv.validate(createPropertySchema, {
      id: '1',
      name: 'ABC Property',
    })
  ).toEqual(true);

  // Missing required fields
  expect(ajv.validate(createPropertySchema, {})).toEqual(false);
  expect(ajv.errors).toMatchObject([{ params: { missingProperty: 'name' } }]);

  // Invalid values
  expect(
    ajv.validate(createPropertySchema, {
      id: 1,
      name: 2,
    })
  ).toEqual(false);
  expect(ajv.errors).toMatchObject([
    { dataPath: '.id', message: 'should be string' },
    { dataPath: '.name', message: 'should be string' },
  ]);
});
