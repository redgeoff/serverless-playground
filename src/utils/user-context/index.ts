// TODO
// import EndUser from './end-user';
// import ExternalApp from './external-app';
// import InternalApp from './internal-app';

export interface Groups {
  internalApp?: string[];
  externalApp?: string[];
  endUser?: string[];
}

export default class UserContext {
  // TODO
  // protected readonly internalApp: InternalApp | undefined;
  // protected readonly externalApp: ExternalApp | undefined;
  // protected readonly endUser: EndUser | undefined;

  // This may be async if say we need to do a lookup to get groups associated with an apiKey
  public async load({
    internalAPIKey,
    externalAPIKey,
    endUserAccessToken,
  }: {
    internalAPIKey: string;
    externalAPIKey: string;
    endUserAccessToken: string;
  }) {
    // TODO
  }

  public assertAuthorized(groups: Groups) {
    // TODO
  }
}
