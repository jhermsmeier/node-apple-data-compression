const ADC = require( './adc' )

// The sliding window buffer needs to be at least
// `max offset (65535) + max chunk length (67)` bytes long
// The value of 128 was chosen as it's the next power of 2 from 67
var windowOffset = 0
var windowSize = 65535 + 67
const window = new Uint8Array( windowSize )

function getWindow( position ) {
  return window[ ( position + windowOffset ) % windowSize ]
}

function setWindow( position, value ) {
  // NOTE: Guard against overrunning `Number.MAX_SAFE_INTEGER`
  // when decompressing large amounts of data;
  windowOffset = ( windowOffset % windowSize ) === 0 ? 0 : windowOffset
  return window[ ( position + windowOffset ) % windowSize ] = value
}

function decodeData( window, buffer, position ) {

  var length = ADC.getChunkLength( buffer[ position ] )
  var data = Buffer.allocUnsafe( length )
  var offset = windowSize - data.length

  // Advance position one byte, past the chunk length we read above
  position += 1

  windowOffset += length

  buffer.copy( data, 0, position )

  for( var i = 0; i < length; i++ ) {
    setWindow( offset + i, buffer[ position++ ] )
  }

  return data

}

function decodeRunlength( window, buffer, position ) {

  var length = ADC.getChunkLength( buffer[ position ] )
  var offset = ADC.getOffset( buffer, position )
  var data = Buffer.allocUnsafe( length )
  var slidePosition = windowSize - data.length

  windowOffset += length

  for( var i = 0; i < length; i++ ) {
    data[i] = setWindow( slidePosition, getWindow( slidePosition - offset - 1 ) )
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

  windowOffset = 0

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

decompress.decode = decodeData
decompress.runLength = decodeRunlength

module.exports = decompress
