var ADC = require( './adc' )

// The sliding window buffer needs to be at least
// `max offset (65535) + max chunk length (67)` bytes long
// The value of 128 was chosen as it's the next power of 2 from 67
const window = Buffer.allocUnsafeSlow( 65535 + 128, 0 )

window.fill( 0 )

function slide( buffer, length ) {
  return buffer.copy( buffer, 0, length, buffer.length )
}

function decodeData( window, buffer, position ) {

  var length = ADC.getChunkLength( buffer[ position ] )
  var data = Buffer.alloc( length, 0 )

  slide( window, data.length )

  buffer.copy( data, 0, position + 1 )
  buffer.copy( window, window.length - data.length, position + 1 )

  return data

}

function decodeRunlength( window, buffer, position ) {

  var length = ADC.getChunkLength( buffer[ position ] )
  var offset = ADC.getOffset( buffer, position )
  var data = Buffer.alloc( length, 0 )
  var slidePosition = window.length - data.length

  slide( window, data.length )

  for( var i = 0; i < length; i++ ) {
    data[i] = window[ slidePosition ] = window[ slidePosition - offset - 1 ]
    slidePosition++
  }

  return data

}

/**
 * Decompress an ADC compressed buffer
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
function decompress( buffer ) {

  var chunks = []
  var chunkType = ADC.CHUNK_UNKNOWN
  var position = 0
  var length = 0

  while( position < buffer.length ) {
    chunkType = ADC.getChunkType( buffer[ position ] )
    length = ADC.getSequenceLength( buffer[ position ] )
    switch( chunkType ) {
      case ADC.CHUNK_DATA:
        chunks.push( decodeData( window, buffer, position ) )
        break
      case ADC.CHUNK_THREE:
        chunks.push( decodeRunlength( window, buffer, position ) )
        break
      case ADC.CHUNK_TWO:
        chunks.push( decodeRunlength( window, buffer, position ) )
        break
      default:
        throw new Error( 'Unknown chunk type 0x' + buffer[ position ].toString(16) + ' at ' + position )
    }
    position += length
  }

  return Buffer.concat( chunks )

}

decompress.slide = slide
decompress.decode = decodeData
decompress.runLength = decodeRunlength

module.exports = decompress
