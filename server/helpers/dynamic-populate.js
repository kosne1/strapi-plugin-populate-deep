'use strict';

function dynamicPopulate(strapi) {
  return function buildDynamicPopulate(collectionName) {
    // 1. Проверяем modelPopulateMap по collectionName (products)
    const dynamicPopulateMap = strapi
      .plugin('strapi-plugin-populate-deep')
      ?.config('dynamicPopulate');

    if (dynamicPopulateMap && dynamicPopulateMap[collectionName]) {
      return dynamicPopulateMap[collectionName];
    }

    // 3. Fallback: null = deep populate
    return null;
  };
}

module.exports = {
  dynamicPopulate
};