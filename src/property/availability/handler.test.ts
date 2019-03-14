import { HandlerEvent } from '../../utils/handler';
import { availabilityHandlerFactory, factoryProperties } from './handler';
import { propertyIdSchema } from './schemas';

it('should declare factory properties', () => {
  expect(factoryProperties).toMatchObject({
    groups: {
      internalApp: ['INTERNAL_GET_AVAILABILITY'],
    },
    schemas: {
      pathParameters: propertyIdSchema,
    },
  });
});

it('should get availability', async () => {
  const availability = jest.fn();
  const availabilityHandler = availabilityHandlerFactory(availability);

  const mockedEvent = {
    pathParameters: {
      propertyId: '1',
    },
  };

  await availabilityHandler((mockedEvent as unknown) as HandlerEvent);
  expect(availability).toHaveBeenCalledWith(
    mockedEvent.pathParameters.propertyId
  );
});
