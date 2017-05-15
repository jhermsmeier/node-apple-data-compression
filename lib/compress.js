var ADC = require( './adc' )
var horspool = require( './horspool' )

const WINDOW_SIZE = 65535 // 2^16
const MAX_CHUNK_LENGTH = 128

// NOTE: Use Boyer-Moore-Horspool for prefix finding
// by restricting the search ranges; i.e. finding the
// prefix with the most repetitions, etc.

/**
 * Compress a given buffer
 * @param {Buffer} buffer
 * @return {Buffer}
 */
function compress( buffer, position, length ) {

  // view parameters
  position = position || 0

  var end = isFinite( length ) ?
    position + length : buffer.length

  // Offset from position
  var offset = 0
  // Found prefix
  var prefix = null

  // while (view is not empty) do
  while( position < end ) {
    // NOTE: The following is LZ77 run-length pseudo-code;
    // needs adaption to ADC use case
    // find longest prefix p of view starting in coded part
    // i := position of p in window
    // j := length of p
    // X := first char after p in view
    // output(i,j,X)
    // add j+1 chars
  }

  return buffer

}

module.exports = compress
