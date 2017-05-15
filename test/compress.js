var adc = require( '..' )
var fs = require( 'fs' )
var path = require( 'path' )

suite( 'ADC', function() {

  test.skip( '', function() {

    var buffer = fs.readFileSync( path.join( __dirname, 'data', 'adc-decompressed.bin' ) )
    var result = adc.compress( buffer )

    fs.writeFileSync( path.join( __dirname, 'compressed.bin' ), result )

  })

})
