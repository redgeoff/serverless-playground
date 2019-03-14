import handler, { HandlerEvent } from '../../utils/handler';
import { createPropertySchema } from './schemas';
import {
  createProperty as createPropertyService,
  CreatePropertyType,
} from './services';

// Note: we use a class here so that we can use dependency injection to mock the service
export class CreatePropertyHandler {
  protected createProperty: CreatePropertyType;

  constructor(createProperty: CreatePropertyType) {
    this.createProperty = createProperty;
  }

  public async create(event: HandlerEvent /* , context */) {
    return this.createProperty(event.parsedBody);
  }
}

const createPropertyHandler = new CreatePropertyHandler(createPropertyService);

export const factoryProperties = {
  groups: { endUser: ['END_USER_CREATE_PROPERTY'] },
  handlerFactory: createPropertyHandler.create.bind(createPropertyHandler),
  schemas: { body: createPropertySchema },
};

export default handler.factory(factoryProperties);
