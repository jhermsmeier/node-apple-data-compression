var adc = require( '..' )
var fs = require( 'fs' )
var path = require( 'path' )
var assert = require( 'assert' )

suite( 'ADC', function() {

  test( '.getOffset( buffer[2] )', function() {
    var buffer = new Buffer([ 0x10, 0x00 ])
    var offset = adc.getOffset( buffer, 0 )
    assert.strictEqual( offset, 0 )
  })

  test( '.getOffset()', function() {
    var buffer = new Buffer([ 0x40, 0xFF, 0xFF ])
    var offset = adc.getOffset( buffer, 0 )
    assert.strictEqual( offset, 65535 )
  })

  test( '.decompress()', function() {
    var buffer = fs.readFileSync( path.join( __dirname, 'data', 'adc-compressed.bin' ) )
    var expected = fs.readFileSync( path.join( __dirname, 'data', 'adc-decompressed.bin' ) )
    var result = adc.decompress( buffer )
    // console.log( result )
    // fs.writeFileSync( path.join( __dirname, 'data', 'adc-decompressed-result.bin' ), result )
    // assert.equal( result.toString('hex'), expected.toString('hex'), 'result != expected' )
    assert.ok( result.equals( expected ), 'result != expected' )
  })

  test.skip( '.compress()', function() {
    var buffer = fs.readFileSync( path.join( __dirname, 'data', 'adc-decompressed.bin' ) )
    var expected = fs.readFileSync( path.join( __dirname, 'data', 'adc-compressed.bin' ) )
    var result = adc.compress( buffer )
    assert.ok( result.equals( expected ), 'result != expected' )
  })

})
