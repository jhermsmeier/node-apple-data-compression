var adc = require( '..' )
var fs = require( 'fs' )
var path = require( 'path' )
var assert = require( 'assert' )

const COMPRESSED_DATA_PATH = path.join( __dirname, 'data', 'adc-compressed.bin' )
const DECOMPRESSED_DATA_PATH = path.join( __dirname, 'data', 'adc-decompressed.bin' )

const COMPRESSED_DATA = fs.readFileSync( COMPRESSED_DATA_PATH )
const DECOMPRESSED_DATA = fs.readFileSync( DECOMPRESSED_DATA_PATH )

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
    var buffer = COMPRESSED_DATA
    var expected = DECOMPRESSED_DATA
    var result = adc.decompress( buffer )
    // console.log( result )
    // fs.writeFileSync( path.join( __dirname, 'data', 'adc-decompressed-result.bin' ), result )
    // assert.equal( result.toString('hex'), expected.toString('hex'), 'result != expected' )
    assert.ok( result.equals( expected ), 'result != expected' )
  })

  test.skip( '.compress()', function() {
    var buffer = DECOMPRESSED_DATA
    var expected = COMPRESSED_DATA
    var result = adc.compress( buffer )
    assert.ok( result.equals( expected ), 'result != expected' )
  })

  suite( 'Decompressor', function() {

    test( 'stream', function( done ) {

      this.timeout( 10000 )

      var readable = fs.createReadStream( COMPRESSED_DATA_PATH, {
        highWaterMark: 16384,
      })

      var expected = DECOMPRESSED_DATA
      var transform = adc.createDecompress()

      var chunks = []

      readable.pipe( transform )
        .on( 'error', done )
        .on( 'readable', function() {
          var chunk = null
          while( chunk = this.read() ) {
            chunks.push( chunk )
          }
        })
        .on( 'end', function() {
          var actual = Buffer.concat( chunks )
          chunks = null
          assert.equal( actual.length, expected.length )
          assert.ok( actual.equals( expected ), 'actual != expected' )
          done()
        })

    })

  })

})
