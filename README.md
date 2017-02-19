# Apple Data Compression (ADC) Scheme
[![npm](https://img.shields.io/npm/v/apple-data-compression.svg?style=flat-square)](https://npmjs.com/package/apple-data-compression)
[![npm license](https://img.shields.io/npm/l/apple-data-compression.svg?style=flat-square)](https://npmjs.com/package/apple-data-compression)
[![npm downloads](https://img.shields.io/npm/dm/apple-data-compression.svg?style=flat-square)](https://npmjs.com/package/apple-data-compression)
[![build status](https://img.shields.io/travis/jhermsmeier/node-apple-data-compression.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-apple-data-compression)

The Apple Data Compression (ADC) scheme relies on both [run-length encoding](https://en.wikipedia.org/wiki/Run-length_encoding)
and pointing to data in a [sliding dictionary](https://en.wikipedia.org/wiki/Dictionary_coder).

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save apple-data-compression
```

## Usage

```js
var adc = require( 'apple-data-compression' )
```

```js
adc.createCompressor( options ) => DuplexStream
adc.createDecompressor( options ) => DuplexStream
```

```js
adc.compress( buffer ) => Buffer
adc.decompress( buffer ) => Buffer
```
