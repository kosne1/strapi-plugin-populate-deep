'use strict';

function dynamicPopulate(strapi) {
  return function buildDynamicPopulate(modelUid) {
    // Получаем componentPopulateMap из конфига плагина
    const componentPopulateMap = strapi
    .plugin('strapi-plugin-populate-deep')
    ?.config('componentPopulateMap');

    if (!componentPopulateMap || Object.keys(componentPopulateMap).length === 0) {
      return null;
    }

    const result = {
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

    if (modelUid === 'api::product.product') {
      result.success_stories = {
        populate: {
          id: true
        }
      };
    }

    return result;
  };
}

module.exports = {
  dynamicPopulate
};