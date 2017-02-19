var adc = require( '..' )
var fs = require( 'fs' )
var path = require( 'path' )
var assert = require( 'assert' )

suite( 'ADC', function() {

  test( '.decompress()', function() {
    var buffer = fs.readFileSync( path.join( __dirname, 'data', 'adc-compressed.bin' ) )
    var expected = fs.readFileSync( path.join( __dirname, 'data', 'adc-decompressed.bin' ) )
    var result = adc.decompress( buffer )
    assert.deepEqual( result, expected )
  })

  test( '.compress()', function() {
    var buffer = fs.readFileSync( path.join( __dirname, 'data', 'adc-decompressed.bin' ) )
    var expected = fs.readFileSync( path.join( __dirname, 'data', 'adc-compressed.bin' ) )
    var result = adc.compress( buffer )
    assert.deepEqual( result, expected )
  })

})
