export const createPropertySchema = {
  $id: 'http://example.com/product.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
  },
  required: ['name'],
  type: 'object',
};
