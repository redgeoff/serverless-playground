import handler, { HandlerEvent } from '../../utils/handler';
import { propertyIdSchema } from './schemas';
import {
  availability as availabilityService,
  GetAvailability,
} from './services';

async function availabilityHandler(
  availability: GetAvailability,
  event: HandlerEvent /* , context */
) {
  const { propertyId } = event.pathParameters;
  return availability(propertyId);
}

export function availabilityHandlerFactory(availability: GetAvailability) {
  return (event: HandlerEvent /* , context */) =>
    availabilityHandler(availability, event);
}

export const factoryProperties = {
  groups: { internalApp: ['INTERNAL_GET_AVAILABILITY'] },
  handlerFactory: availabilityHandlerFactory(availabilityService),
  schemas: { pathParameters: propertyIdSchema },
};

export default handler.factory(factoryProperties);
