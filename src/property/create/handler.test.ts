import { HandlerEvent } from '../../utils/handler';
import { CreatePropertyHandler, factoryProperties } from './handler';
import { createPropertySchema } from './schemas';

it('should declare factory properties', () => {
  expect(factoryProperties).toMatchObject({
    groups: {
      endUser: ['END_USER_CREATE_PROPERTY'],
    },
    schemas: {
      body: createPropertySchema,
    },
  });
});

it('should create property', async () => {
  const createProperty = jest.fn();
  const createPropertyHandler = new CreatePropertyHandler(createProperty);

  const mockedEvent = {
    parsedBody: {
      name: 'ABC',
    },
  };

  await createPropertyHandler.create((mockedEvent as unknown) as HandlerEvent);
  expect(createProperty).toHaveBeenCalledWith(mockedEvent.parsedBody);
});
