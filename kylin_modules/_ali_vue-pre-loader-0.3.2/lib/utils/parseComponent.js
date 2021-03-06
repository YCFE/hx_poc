'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseComponent = parseComponent;

var _deIndent = require('de-indent');

var _deIndent2 = _interopRequireDefault(_deIndent);

var _htmlParser = require('./html-parser');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const splitRE = /\r?\n/g;
const replaceRE = /./g;
const isSpecialTag = (0, _index.makeMap)('script,style,template', true);

/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent(content) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  };
  let depth = 0;
  let currentBlock = null;

  function start(tag, attrs, unary, start, end) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce((cumulated, _ref) => {
          let name = _ref.name,
              value = _ref.value;

          cumulated[name] = value || true;
          return cumulated;
        }, Object.create(null))
      };
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          sfc.styles.push(currentBlock);
        } else {
          sfc[tag] = currentBlock;
        }
      } else {
        // custom blocks
        sfc.customBlocks.push(currentBlock);
      }
    }
    if (!unary) {
      depth++;
    }
  }

  function checkAttrs(block, attrs) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr.name === 'lang') {
        block.lang = attr.value;
      }
      if (attr.name === 'scoped') {
        block.scoped = true;
      }
      if (attr.name === 'module') {
        block.module = attr.value || true;
      }
      if (attr.name === 'src') {
        block.src = attr.value;
      }
    }
  }

  function end(tag, start, end) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start;
      let text = (0, _deIndent2.default)(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text;
      }
      currentBlock.content = text;
      currentBlock = null;
    }
    depth--;
  }

  function padContent(block, pad) {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ');
    } else {
      const offset = content.slice(0, block.start).split(splitRE).length;
      const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n';
      return Array(offset).join(padChar);
    }
  }

  (0, _htmlParser.parseHTML)(content, {
    start: start,
    end: end
  });

  return sfc;
}