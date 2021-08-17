module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@hooks': './src/hooks',
          '@screens': './src/screens',
          '@assets': './src/assets',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@libs': './src/libs/',
          '@store': './src/store',
          '@constants': './src/constants',
        },
      },
    ],
  ],
};
