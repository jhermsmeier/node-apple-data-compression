var ADC = require( './adc' )

function decodeData( output, buffer, position ) {
  var length = ADC.getChunkLength( buffer[ position ] )
  return Buffer.concat([ output, buffer.slice( position + 1, position + length + 1 ) ])
}

function decodeRunlength( output, buffer, position ) {

  var length = ADC.getChunkLength( buffer[ position ] )
  var offset = ADC.getOffset( buffer, position )
  var outputPosition = output.length

  output = Buffer.concat([ output, new Buffer( length ) ])

  for( var i = 0; i < length; i++ ) {
    output[outputPosition] = output[outputPosition - offset - 1]
    outputPosition++
  }

  return output

}

/**
 * Decompress an ADC compressed buffer
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
function decompress( buffer ) {

  var output = new Buffer(0)
  var position = 0
  var chunkType = ADC.CHUNK_UNKNOWN
  var chunkLength = -1

  while( position < buffer.length ) {
    chunkType = ADC.getChunkType( buffer[ position ] )
    chunkLength = ADC.getChunkLength( buffer[ position ] )
    switch( chunkType ) {
      case ADC.CHUNK_DATA:
        output = decodeData( output, buffer, position )
        position = position + chunkLength + 1
        break
      case ADC.CHUNK_THREE:
        output = decodeRunlength( output, buffer, position )
        position = position + 3
        break
      case ADC.CHUNK_TWO:
        output = decodeRunlength( output, buffer, position )
        position = position + 2
        break
      default:
        throw new Error( 'Unknown chunk type 0x' + buffer[ position ].toString(16) + ' at ' + position )
    }
  }

  return output

}

module.exports = decompress
