export interface CreateProperty {
  id?: string;
  name: string;
}

export interface Property extends CreateProperty {
  id: string;
}

const properties: any = {};

export type CreatePropertyType = (
  property: CreateProperty
) => Promise<Property>;

// Note: async is not needed here, but is used as a lot of real-world examples will need async
export const createProperty: CreatePropertyType = async (
  property: CreateProperty
) => {
  const prop = { id: property.name, ...property };
  properties[prop.id] = prop;
  return prop;
};

// Note: async is not needed here, but is used as a lot of real-world examples will need async
export const getProperty = async (id: string) => {
  return properties[id];
};
