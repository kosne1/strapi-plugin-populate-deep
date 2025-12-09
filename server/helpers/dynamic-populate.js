'use strict';

function dynamicPopulate(strapi) {
  return function buildDynamicPopulate() {
    // Получаем componentPopulateMap из конфига плагина
    const componentPopulateMap = strapi
      .plugin('strapi-plugin-populate-deep')
      ?.config('componentPopulateMap') || {};

    const onPopulate = {};
    
    Object.keys(componentPopulateMap).forEach((componentName) => {
      onPopulate[componentName] = componentPopulateMap[componentName];
    });

    if (Object.keys(onPopulate).length === 0) {
      return { blocks: { populate: '*' } };
    }

    return {
      blocks: {
        on: onPopulate
      },
      seo: {
        populate: {
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
