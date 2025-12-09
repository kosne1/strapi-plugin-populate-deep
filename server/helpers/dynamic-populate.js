'use strict';

function dynamicPopulate(strapi) {
  return function buildDynamicPopulate() {
    // Получаем componentPopulateMap из конфига плагина
    const componentPopulateMap = strapi
    .plugin('strapi-plugin-populate-deep')
    ?.config('componentPopulateMap');

  if (!componentPopulateMap || Object.keys(componentPopulateMap).length === 0) {
    return null;
  }

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