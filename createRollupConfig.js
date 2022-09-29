const cjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const { resolve } = require('path');

/**
 *
 * @param {string} path
 */
module.exports = function createRollupConfig (path) {
  return {
    input: resolve(path, './index.cjs'),
    output: {
      file: resolve(path, './index.mjs'),
      format: 'esm',
    },
    plugins: [nodeResolve({ jsnext: true, main: true }), json(), cjs()],
  };
};
