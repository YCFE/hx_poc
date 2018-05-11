export default function generateResourceImpl({
    resourceMap,
    shouldClearOther
  }) {
  
  return function resourceModifyImpl(globalResource, kylinApp, program) {

    if ( shouldClearOther ) {
      // 分别清理 globalResource.js, .css, .externals 的所有Key
      [globalResource.js, globalResource.css, globalResource.externals].forEach((obj) => {
        dropKeys(obj);
      })
    }

    // 然后再根据输入解析
    Object.keys(resourceMap).forEach((k) => {
      const npmName = k;
      const configObj = resourceMap[k];
      const external = configObj.external;
      const js = configObj.js;
      const css = configObj.css;

      globalResource.externals[npmName] = external;
      if ( css !== undefined ) {
        globalResource.css[external] = css;
      }
      if ( js !== undefined ) {
        globalResource.js[external] = js;
      }
    });
    
  }
}

function dropKeys(obj) {
  for(let k in obj) {
    if ( obj.hasOwnProperty(k) ) {
      delete obj[k];
    }
  }
}