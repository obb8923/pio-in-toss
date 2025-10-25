const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig();
  
  return {
    ...config,
    resolver: {
      ...config.resolver,
      // AsyncStorage 관련 모듈 해결을 위한 설정
      platforms: ['ios', 'android', 'native', 'web'],
    },
  };
})();
