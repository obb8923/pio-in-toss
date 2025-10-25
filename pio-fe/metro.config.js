const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig();
  
  return {
    ...config,
    resolver: {
      ...config.resolver,
      platforms: ['ios', 'android', 'native', 'web'],
    },
  };
})();
