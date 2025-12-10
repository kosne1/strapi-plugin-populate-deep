'use strict';

function dynamicPopulate(strapi) {
  return function buildDynamicPopulate(modelUid) {
    // Получаем modelPopulateMap из конфига плагина
    const modelPopulateMap = strapi
      .plugin('strapi-plugin-populate-deep')
      ?.config('modelPopulateMap');

    if (modelPopulateMap && modelPopulateMap[modelUid]) {
      return modelPopulateMap[modelUid];
    }

    // используем componentPopulateMap (обратная совместимость)
    const componentPopulateMap = strapi
      .plugin('strapi-plugin-populate-deep')
      ?.config('componentPopulateMap');

    if (!componentPopulateMap || Object.keys(componentPopulateMap).length === 0) {
      return null;
    }

    // Дефолтная структура
    return {
      blocks: {
        on: componentPopulateMap
      },
      seo: {
        populate: {
          metaTitle: true,
          metaDescription: true,
          metaImage: true,
          metaSocial: { populate: { image: true } }
        }
      }
    };
  };
}

module.exports = {
  dynamicPopulate
};