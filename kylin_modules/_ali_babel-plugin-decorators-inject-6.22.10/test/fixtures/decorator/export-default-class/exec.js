setTimeout(function () {
  try {


    var expectedExport = require('./expected.js');

    // console.log('expectedExport', expectedExport)
    // console.log('A', expectedExport.A)
    // console.log('B', expectedExport.B)
  }
  catch(ex) {
    console.error(ex)
  }
}, 1)