var ADC = module.exports

/** @type {Number} Chunk is a data run */
ADC.CHUNK_DATA = 0x80
/** @type {Number} Chunk is a 3 byte code */
ADC.CHUNK_THREE = 0x40
/** @type {Number} Chunk is a 2 byte code */
ADC.CHUNK_TWO = 0x3F

/**
 * Get the type of a chunk by its marker byte
 * @param {Number} byte
 * @returns {Number} ADC.CHUNK_*
 */
ADC.getChunkType = function( byte ) {
  // If bit 7 is set, this is a data run
  if( ( byte & 0x80 ) === 0x80 ) return ADC.CHUNK_DATA
  // If bit 6 is set, this is a three-byte code
  if( ( byte & 0x40 ) === 0x40 ) return ADC.CHUNK_THREE
  // If neither is set, this is a two-byte code
  return ADC.CHUNK_TWO
}

/**
 * Get the chunk length by its marker byte
 * @param {Number} byte
 * @returns {Number} chunkLength
 */
ADC.getChunkLength = function( byte ) {
  var chunkType = ADC.getChunkType( byte )
  switch( chunkType ) {
    case ADC.CHUNK_DATA: return ( byte & 0x7F ) + 1
    case ADC.CHUNK_THREE: return ( byte & 0x3F ) + 4
    case ADC.CHUNK_TWO: return (( byte & 0x3C ) >> 2 ) + 3
    default: return -1
  }
}

/**
 * Get the chunk's sequence length by its marker byte
 * @param {Number} byte
 * @returns {Number} sequenceLength
 */
ADC.getSequenceLength = function( byte ) {
  var chunkType = ADC.getChunkType( byte )
  switch( chunkType ) {
    case ADC.CHUNK_DATA: return ( byte & 0x7F ) + 2
    case ADC.CHUNK_THREE: return 3
    case ADC.CHUNK_TWO: return 2
    default: return 0
  }
}

ADC.getOffset = function( buffer, position ) {
  var chunkType = ADC.getChunkType( buffer[ position ] )
  switch( chunkType ) {
    case ADC.CHUNK_DATA:
      return 0
    case ADC.CHUNK_THREE:
      return ( buffer[ position + 1 ] << 8 ) + buffer[ position + 2 ]
    case ADC.CHUNK_TWO:
      return (( buffer[ position ] & 0x03 ) << 8 ) + buffer[ position + 1 ]
    default: return -1
  }
}

ADC.decompress = require( './decompress' )
ADC.Decompressor = require( './decompressor' )

ADC.createDecompress = function( options ) {
  return new ADC.Decompressor( options )
}
