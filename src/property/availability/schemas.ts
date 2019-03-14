export const propertyIdSchema = {
  $id: 'http://example.com/product.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  // title: 'Property',
  // description: 'A property',
  properties: {
    propertyId: {
      // description: 'The unique identifier for a property',
      type: 'string',
    },
  },
  required: ['propertyId'],
  type: 'object',
};
