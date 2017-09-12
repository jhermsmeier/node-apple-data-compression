# Apple Data Compression (ADC) Scheme
[![npm](https://img.shields.io/npm/v/apple-data-compression.svg?style=flat-square)](https://npmjs.com/package/apple-data-compression)
[![npm license](https://img.shields.io/npm/l/apple-data-compression.svg?style=flat-square)](https://npmjs.com/package/apple-data-compression)
[![npm downloads](https://img.shields.io/npm/dm/apple-data-compression.svg?style=flat-square)](https://npmjs.com/package/apple-data-compression)
[![build status](https://img.shields.io/travis/jhermsmeier/node-apple-data-compression/master.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-apple-data-compression)

The Apple Data Compression (ADC) scheme relies on both [run-length encoding](https://en.wikipedia.org/wiki/Run-length_encoding)
and pointing to data in a [sliding dictionary](https://en.wikipedia.org/wiki/Dictionary_coder).

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save apple-data-compression
```

## Related Modules

- [Apple Universal Disk Image Format](https://github.com/jhermsmeier/node-udif)

## Usage

```js
var adc = require( 'apple-data-compression' )
```

### Sync decompression

```js
var result = adc.decompress( buffer )
```

### Streaming

```js
var transform = new adc.Decompressor()
// OR var transform = adc.createDecompress()

fs.createReadStream( filename )
  .pipe( transform )
  .on( 'data', ( chunk ) => {
    // ...
  })
```
