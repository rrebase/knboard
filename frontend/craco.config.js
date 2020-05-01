/* eslint-disable @typescript-eslint/no-var-requires */
const { when } = require("@craco/craco");

const emotionPresetOptions = {};

const emotionBabelPreset = require("@emotion/babel-preset-css-prop").default(
  undefined,
  emotionPresetOptions
);

module.exports = {
  babel: {
    plugins: [
      ...emotionBabelPreset.plugins,
      ...when(process.env.CI === "true", () => ["istanbul"], [])
    ]
  }
};
