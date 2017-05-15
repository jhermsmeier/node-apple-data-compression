// var skip = (function() {
//   var table = {}
//   for( var i = 0; i < 255; i++ ) {
//     table[i] = null
//   }
//   return table
// })()
var skip = new Map()

function horspool( haystack, needle, start, end ) {

  var offset = start || 0
  var length = isFinite( end ) ?
    end : haystack.length

  var depth = needle.length

  if( depth <= 0 || length <= 0 )
    return -1

  var jump = 0
  var scan = 0
  var last = depth - 1

  // Clear the skip table
  skip.clear()
  // for( var scan = 0; scan < 255; scan++ ) {
  //   skip[ scan ] = null
  // }

  // Fill the skip-table
  for( scan = 0; scan < last; scan++ ) {
    // skip[ needle[ scan ] ] = last - scan
    skip.set( needle[ scan ], last - scan )
  }

  while( length >= depth ) {
    for( scan = last; haystack[ offset + scan ] === needle[ scan ]; scan-- ) {
      if( scan === 0 ) return offset
    }
    // jump = skip[ haystack[ offset + last ] ]
    jump = skip.get( haystack[ offset + last ] )
    jump = jump != null ? jump : depth
    length -= jump
    offset += jump
  }

  return -1

}

module.exports = horspool
