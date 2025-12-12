'use strict';
const { getFullPopulateObject } = require('./helpers')
const { dynamicPopulate } = require('./helpers/dynamic-populate');

module.exports = ({ strapi }) => {
  const buildDynamicPopulate = dynamicPopulate(strapi);
  
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeFindMany' || event.action === 'beforeFindOne') {
      const populate = event.params?.populate;
      const defaultDepth = strapi.plugin('strapi-plugin-populate-deep')?.config('defaultDepth') || 5;
      const modelUid = event.model.uid;
      const collectionName = event.model.collectionName;

      // populate=deep — полный глубокий populate
      if (populate && populate[0] === 'deep') {
        const depth = populate[1] ?? defaultDepth;
        const modelObject = getFullPopulateObject(modelUid, depth, [], []);
        event.params.populate = modelObject.populate;
      }
      // populate=dynamiczone — для страниц с blocks или content (ищет в modelPopulateMap и contentBlocksPopulateMap)
      else if (populate === 'dynamiczone' || (Array.isArray(populate) && populate[0] === 'dynamiczone')) {
        const dynamicPop = buildDynamicPopulate(collectionName);
        
        if (dynamicPop && Object.keys(dynamicPop).length > 0) {
          event.params.populate = dynamicPop;
        } else {
          // Fallback на deep populate
          const depth = Array.isArray(populate) && populate[1] ? populate[1] : defaultDepth;
          const modelObject = getFullPopulateObject(modelUid, depth, [], []);
          event.params.populate = modelObject.populate;
        }
      }
      // populate=collection — для списков коллекций (простой populate)
      else if (populate === 'collection' || (Array.isArray(populate) && populate[0] === 'collection')) {
        const collectionPopulateMap = strapi
          .plugin('strapi-plugin-populate-deep')
          ?.config('collectionPopulate');
        
        const collectionPop = collectionPopulateMap?.[collectionName] 
          || collectionPopulateMap?.[modelUid];
        
        if (collectionPop && Object.keys(collectionPop).length > 0) {
          event.params.populate = collectionPop;
        } else {
          // Fallback на deep populate
          const depth = Array.isArray(populate) && populate[1] ? populate[1] : defaultDepth;
          const modelObject = getFullPopulateObject(modelUid, depth, [], []);
          event.params.populate = modelObject.populate;
        }
      }
    }
  });
};