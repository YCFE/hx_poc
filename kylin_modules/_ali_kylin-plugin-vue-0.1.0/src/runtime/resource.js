export default function generateResourceImpl() {
  
  return function resourceModifyImpl({ js, externals }, kylinApp, program) {

    if ( program.prod ) {
      js['Vue'] = 'https://a.alipayobjects.com/g/h5-lib/vue/2.1.6/vue.min.js'
    } else {
      js['Vue'] = 'https://a.alipayobjects.com/g/h5-lib/vue/2.1.6/vue.js'
    }

    return ;
  }
}