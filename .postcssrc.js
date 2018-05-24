// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-pxtorem": {
      root_value: 75,
      minPixelValue: 3,
      prop_white_list: [],
      selectorBlackList: ['.vux-', '.weui-', '.dp-', '.scroller-']
    }
  }
}
