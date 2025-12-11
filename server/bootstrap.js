'use strict';
const { getFullPopulateObject } = require('./helpers')
const { dynamicPopulate } = require('./helpers/dynamic-populate');

module.exports = ({ strapi }) => {
  const buildDynamicPopulate = dynamicPopulate(strapi);
  // Subscribe to the lifecycles that we are interested in.
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
        const dynamicPop = buildDynamicPopulate(event.model.uid);
        // Если componentPopulateMap не задан - используем deep populate
        if (!dynamicPop || Object.keys(dynamicPop).length === 0) {
          const depth = Array.isArray(populate) && populate[1] ? populate[1] : defaultDepth;
          const modelObject = getFullPopulateObject(event.model.uid, depth, [], []);
          event.params.populate = modelObject.populate
        }
        else {
          event.params.populate = dynamicPop;
        }
      }
      // Обработка populate=collection
      else if (populate === 'collection' || (Array.isArray(populate) && populate[0] === 'collection')) {
        const collectionPopulateMap = strapi
          .plugin('strapi-plugin-populate-deep')
          ?.config('collectionPopulateMap');
        
        // Извлекаем название коллекции из model.uid (api::blog.blog -> blogs)
        const modelUid = event.model.uid;
        const collectionName = event.model.collectionName; // например: blogs, success_stories
        
        // Ищем в конфиге по collectionName или по uid
        const collectionPop = collectionPopulateMap?.[collectionName] 
          || collectionPopulateMap?.[modelUid];
        
        if (collectionPop && Object.keys(collectionPop).length > 0) {
          event.params.populate = collectionPop;
        } else {
          // Fallback на deep populate
          const depth = Array.isArray(populate) && populate[1] ? populate[1] : defaultDepth;
          const modelObject = getFullPopulateObject(event.model.uid, depth, [], []);
          event.params.populate = modelObject.populate;
        }
      }
      // Обработка populate=contentblocks (для внутренних страниц с content dynamic zone)
      else if (populate === 'contentblocks' || (Array.isArray(populate) && populate[0] === 'contentblocks')) {
        const contentBlocksPopulateMap = strapi
          .plugin('strapi-plugin-populate-deep')
          ?.config('contentBlocksPopulateMap');
        
        const collectionName = event.model.collectionName;
        
        // Ищем в конфиге по collectionName
        const contentPop = contentBlocksPopulateMap?.[collectionName];
        
        if (contentPop && Object.keys(contentPop).length > 0) {
          event.params.populate = contentPop;
        } else {
          // Fallback на deep populate
          const depth = Array.isArray(populate) && populate[1] ? populate[1] : defaultDepth;
          const modelObject = getFullPopulateObject(event.model.uid, depth, [], []);
          event.params.populate = modelObject.populate;
        }
      }
    }
  });
};