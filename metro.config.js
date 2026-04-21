const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude react-native-pell-rich-editor from web builds
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  /react-native-pell-rich-editor/,
];

module.exports = config;