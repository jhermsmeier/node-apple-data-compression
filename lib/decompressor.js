var ADC = require( './adc' )
var Stream = require( 'stream' )
var inherit = require( 'bloodline' )

/**
 * Decompressor
 * @constructor
 * @extends {stream.Transform}
 * @param {Object} [options]
 * @returns {Decompressor}
 */
function Decompressor( options ) {

  if( !(this instanceof Decompressor) ) {
    return new Decompressor( options )
  }

  Stream.Transform.call( this, options )

  this._window = new Uint8Array( 65535 + 67 )
  this._chunks = []
  this._bytes = 0

}

/**
 * Decompressor prototype
 * @ignore
 */
Decompressor.prototype = {

  constructor: Decompressor,

  _decode( chunk, next ) {

    if( this._bytes > 0 ) {
      this._chunks.push( chunk )
      chunk = Buffer.concat( this._chunks )
      this._chunks.length = 0
      this._bytes = 0
    }

    var chunks = []
    var chunkType = ADC.CHUNK_UNKNOWN
    var position = 0
    var length = 0

    while( position < chunk.length ) {

      chunkType = ADC.getChunkType( chunk[ position ] )
      length = ADC.getSequenceLength( chunk[ position ] )

      if( position + length > chunk.length ) {
        break
      }

      switch( chunkType ) {
        case ADC.CHUNK_DATA:
          chunks.push( ADC.decompress.decode( this._window, chunk, position ) )
          break
        case ADC.CHUNK_THREE:
          chunks.push( ADC.decompress.runLength( this._window, chunk, position ) )
          break
        case ADC.CHUNK_TWO:
          chunks.push( ADC.decompress.runLength( this._window, chunk, position ) )
          break
        default:
          return next( new Error( 'Unknown chunk type 0x' + chunk[ position ].toString(16) + ' at ' + position ) )
      }

      position += length

    }

    if( chunk.length - position ) {
      chunk = chunk.slice( position )
      this._chunks.push( chunk )
      this._bytes += chunk.length
    }

    next( null, Buffer.concat( chunks ) )

  },

  _transform( chunk, encoding, next ) {
    this._decode( chunk, next )
  },

  _flush( done ) {
    this._decode( Buffer.allocUnsafe(0), done )
  },

}

inherit( Decompressor, Stream.Transform )

module.exports = Decompressor
