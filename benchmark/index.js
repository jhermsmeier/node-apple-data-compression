var adc = require( '..' )
var fs = require( 'fs' )
var path = require( 'path' )
var bench = require( 'nanobench' )

var ITERATIONS = 1000000

bench( `ADC.getChunkType() ⨉ ${ITERATIONS}`, function( run ) {

  var crypto = require( 'crypto' )
  var value = crypto.randomBytes(1)[0]
  var type = null

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    type = adc.getChunkType( value )
  }
  run.end()

})

bench( `ADC.getChunkLength() ⨉ ${ITERATIONS}`, function( run ) {

  var crypto = require( 'crypto' )
  var value = crypto.randomBytes(1)[0]
  var type = null

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    type = adc.getChunkLength( value )
  }
  run.end()

})

bench( `ADC.getOffset() ⨉ ${ITERATIONS}`, function( run ) {

  var value = new Buffer( '800010008301000003140b2407830200', 'hex' )
  var type = null

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    type = adc.getOffset( value, 0 )
  }
  run.end()

})

bench( 'decompress 256KB ⨉ 4', function( run ) {

  var filename = path.join( __dirname, '..', 'test', 'data', 'adc-compressed.bin' )
  var buffer = fs.readFileSync( filename )
  var result = null

  run.start()
  for( var i = 0; i < 4; i++ ) {
    result = adc.decompress( buffer )
  }
  run.end()

})
