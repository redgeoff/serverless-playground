import ResponseError from '../../utils/response-error';

export interface Availability {
  foo: string;
  propertyId?: string;
}

export class BadPropertyError extends ResponseError {
  constructor(message: string) {
    super('BAD_PROPERTY', message);
  }
}

export type GetAvailability = (propertyId?: string) => Promise<Availability>;

// Note: async is not needed here, but is used as a lot of real-world examples will need async
export const availability: GetAvailability = async (propertyId?: string) => {
  if (propertyId === '123') {
    throw new BadPropertyError('cannot be 123');
  }

  return { foo: 'bar', propertyId };
};
