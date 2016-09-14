import { rollup } from 'rollup';
import MagicString from 'magic-string';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from 'rollup-plugin-image';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from './utils/node-globals/dist/rollup-plugin-node-globals.es6.js';

// PostCSS plugins
import _import from 'postcss-import';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import postcssModules from 'postcss-modules';
import cssnano from 'cssnano';

const cssExportMap = {};

export default {
  entry: 'client/index.js',
  dest: 'build/bundle.js',
  format: 'iife',
  context: 'window',
  plugins: [
    image(),
    postcss({
        plugins: [
          _import(),
          postcssModules({
            getJSON (id, exportTokens) {
              cssExportMap[id] = exportTokens;
            }
          }),
          simplevars(),
          nested(),
          cssnext({ warnForDuplicates: false }),
          cssnano(),
        ],
        getExport (id) {
          return cssExportMap[id];
        },
        extensions: [ '.css', '.scss' ],
    }),
    babel({
      babelrc: false,
      exclude: ['node_modules/**', 'client/vendor/**', 'horizon/**'],
      only: '*.js',
      runtimeHelpers: true,
      presets: ["react", [ "es2015", { modules: false, 'transform-es2015-modules-commonjs': false, 'external-helpers': true } ]],
      plugins: ['external-helpers', "transform-async-to-generator", 'transform-react-jsx','transform-class-properties','transform-object-rest-spread']
    }),
    nodeResolve({
      jsnext: true,
      browser: true,
      preferBuiltins: true
    }),  
    commonjs({
      include: [
        'node_modules/**',
        'horizon/client/dist/**',
        'client/vendor/**'
      ],
      exclude: ['node_modules/process-es6/**', 'node_modules/redux/**'],
      namedExports: {
        'client/vendor/d3.js': ['scaleTime', 'scaleLinear', 'timeHour', 'timeMinute', 'timeDay', 'line', 'area', 'select', 'axisLeft', 'axisBottom', 'axisRight', 'curveCatmullRom'],
        'react': ['PropTypes', 'createElement'],
        'react-router': ['browserHistory'],
        'react-redux': ['Provider']
      },
      ignoreGlobal: true
    }),
    globals(),
    builtins(),
    (() => {

      const values = {
        'var index = Object': 'var _reduxMap = Object',
        "( index && index['default'] ) || index": "( _reduxMap && _reduxMap['default'] ) || _reduxMap",
        'var _RadioButton = index$61': 'var _RadioButton = RadioButton$1'
      };
      const pattern = new RegExp(/(var index = Object|\( index && index\['default'\] \) \|\| index|var _RadioButton = index\$61)/g);

      return {
        name: 'replace',
        transformBundle(code, format) {

          const magicString = new MagicString( code );

          let hasReplacements = false;
          let match;
          let start, end, replacement;

          while ( match = pattern.exec( code ) ) {

            hasReplacements = true;

            start = match.index;
            end = start + match[0].length;
            replacement = String( values[ match[1] ] );

            magicString.overwrite( start, end, replacement );

            console.log(`Replaced '${match[1]}' with '${replacement}'`);
          }

          if ( !hasReplacements ) return null;

          let result = { code: magicString.toString() };

          return result;
        }
      }
    })()
  ]
};