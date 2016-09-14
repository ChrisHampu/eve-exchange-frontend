import config from './rollup.config.js';

import uglify from 'rollup-plugin-uglify';
import cleanup from 'rollup-plugin-cleanup';
import replace from 'rollup-plugin-replace';

config.sourceMap = false;

config.plugins.push(replace({
  'process.env.NODE_ENV': JSON.stringify('production')
}));
config.plugins.push(uglify());

export default config;