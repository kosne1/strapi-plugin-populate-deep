'use strict';
const { getFullPopulateObject } = require('./helpers')
const { dynamicPopulate } = require('./helpers/dynamic-populate');

module.exports = ({ strapi }) => {
  const buildDynamicPopulate = dynamicPopulate(strapi);
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeFindMany' || event.action === 'beforeFindOne') {
      const populate = event.params?.populate;
      const defaultDepth = strapi.plugin('strapi-plugin-populate-deep')?.config('defaultDepth') || 5

      if (populate && populate[0] === 'deep') {
        const depth = populate[1] ?? defaultDepth
        const modelObject = getFullPopulateObject(event.model.uid, depth, [], []);
        event.params.populate = modelObject.populate
      }
      else if (populate === 'dynamiczone' || (Array.isArray(populate) && populate[0] === 'dynamiczone')) {
        const dynamicPop = buildDynamicPopulate();
        event.params.populate = dynamicPop;
      }
    }
  });
};