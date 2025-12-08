'use strict';

function dynamicPopulate(strapi) {
  return function buildDynamicPopulate(components) {
    // Получаем componentPopulateMap из конфига плагина
    const componentPopulateMap = strapi
      .plugin('strapi-plugin-populate-deep')
      ?.config('componentPopulateMap') || {};

    if (!components || components.length === 0) {
      return { blocks: { populate: '*' } };
    }
    const onPopulate = {};

    components.forEach((componentName) => {
      if (componentPopulateMap[componentName]) {
        onPopulate[componentName] = componentPopulateMap[componentName];
      }
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