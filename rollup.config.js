import { rollup } from 'rollup';
import MagicString from 'magic-string';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from './utils/postcss/index.js';
import image from 'rollup-plugin-image';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

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
      combineStyleTags: true
    }),
    babel({
      babelrc: false,
      exclude: ['node_modules/**', 'client/vendor/**', 'horizon/**'],
      only: '*.js',
      runtimeHelpers: true,
      presets: ["react", [ "es2015", { modules: false, 'transform-es2015-modules-commonjs': false, 'external-helpers': true } ]],
      plugins: ['external-helpers', "transform-async-to-generator", 'transform-react-jsx','transform-class-properties','transform-object-rest-spread']
    }),
    builtins(),
    nodeResolve({
      jsnext: true,
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: [
        'node_modules/**',
        'horizon/client/dist/**',
        'client/vendor/**'
      ],
      exclude: ['node_modules/process-es6/**', 'node_modules/redux/**'],
      namedExports: {
        'client/vendor/d3.js': ['scaleUtc', 'scaleLinear', 'timeHour', 'timeMinute', 'timeDay', 'line', 'area', 'select', 'axisLeft', 'axisBottom', 'axisRight', 'curveCatmullRom', 'curveCardinal'],
        'react': ['PropTypes', 'createElement', 'Children', 'Component'],
        'react-router': ['browserHistory'],
        'react-redux': ['Provider']
      },
      ignoreGlobal: true
    }),
    globals(),
    (() => {

      const values = {
        'var index = Object': 'var _reduxMap = Object',
        "\\( index && index\\['default'\\] \\) \\|\\| index": "( _reduxMap && _reduxMap['default'] ) || _reduxMap",
        'var _RadioButton = index\\$\\d\\d': 'var _RadioButton = RadioButton$1',
        'TcpConnection, events.EventEmitter': 'TcpConnection, events',
        'var name = message.data\\[ message.action === C.ACTIONS.ACK \\? 1 : 0 \\];': 'var name = message.data[ message.action === C.ACTIONS.ACK ? 1 : 0 ];\nvar processed;',
        'var events = createCommonjsModule\\(function': 'var events_mui = createCommonjsModule(function',
        'var _events = events;': 'var _events = events_mui',
        'return setInterval\\$1\\(callback, intervalDuration\\);': 'return setInterval(callback, intervalDuration);',
        'return setTimeout\\$1\\(callback, timeoutDuration\\);': 'return setTimeout(callback, timeoutDuration);'
      };

      const keys = Object.keys(values);
      const pattern = new RegExp(`(${keys.join('|')})`, 'g');

      return {
        name: 'replace',
        transformBundle(code, format) {

          const magicString = new MagicString( code );

          let hasReplacements = false;
          let match;
          let start, end, replacement;

          while ( match = pattern.exec( code ) ) {

            hasReplacements = true;
            let replacement = String();

            start = match.index;
            end = start + match[0].length;

            for (const key of keys) {

              if (new RegExp(key).exec(match[0]) != null) {

                replacement = values[key];
                break;
              }
            }

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
