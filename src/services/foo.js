import map from 'lodash/map';

export default function foo(breweries) {
  // NOTE: you could use breweries.map() instead without a dep on lodash, but I've chosen to use
  // lodash here just to illustrate an example of how lodash can be used
  return map(breweries, brewery => brewery.name);
}
