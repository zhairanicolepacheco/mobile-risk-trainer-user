module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // or false, depending on your needs
    ],
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // make sure this matches
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // make sure this matches
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
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
          '@components': './src/components',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
