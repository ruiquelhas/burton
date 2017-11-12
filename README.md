# burton
File type validation for [hapi](https://github.com/hapijs/hapi) raw stream `multipart/form-data` request payloads.

Like most modern magicians, builds on the work, knowledge and influence of others before it, in this case, [henning](https://github.com/ruiquelhas/henning).

[![NPM Version][version-img]][version-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Dependencies][david-img]][david-url] [![Dev Dependencies][david-dev-img]][david-dev-url]

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Example](#example)
- [Supported File Types](#supported-file-types)

## Installation
Install via [NPM](https://www.npmjs.org).

```sh
$ npm install burton
```

## Usage
Register the package as a server plugin to enable validation for each route that does not parse — `parse: false` — into a stream, the files in the request payload — `output: 'stream'`. For every other route with a different configuration, the validation is skipped.

If the validation fails, a [joi](https://github.com/hapijs/joi)-like `400 Bad Request` error is returned alongside an additional `content-validation: failure` response header. If everything is ok, the response will ultimately contain a `content-validation: success` header.

Also, if the `Content-Type` request header is not `multipart/form-data`, a `415 Unsupported Media Type` error is returned, but in this case, without any additional response header.

### Example

```js
const Hapi = require('hapi');
const Burton = require('burton');

try {
    const server = new Hapi.Server();

    server.route({
        options: {
            payload: {
                output: 'stream',
                parse: false
            }
            // go nuts
        }
    });

    await server.register({
        plugin: Burton,
        options: {
            // Allow png files only
            whitelist: ['image/png']
        }
    });

    await server.start();
}
catch (err) {
    throw err;
}
```

## Supported File Types
The same as [file-type](https://github.com/sindresorhus/file-type/tree/v7.0.0#supported-file-types).

[coveralls-img]: https://img.shields.io/coveralls/ruiquelhas/burton.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/ruiquelhas/burton
[david-img]: https://img.shields.io/david/ruiquelhas/burton.svg?style=flat-square
[david-url]: https://david-dm.org/ruiquelhas/burton
[david-dev-img]: https://img.shields.io/david/dev/ruiquelhas/burton.svg?style=flat-square
[david-dev-url]: https://david-dm.org/ruiquelhas/burton?type=dev
[version-img]: https://img.shields.io/npm/v/burton.svg?style=flat-square
[version-url]: https://www.npmjs.com/package/burton
[travis-img]: https://img.shields.io/travis/ruiquelhas/burton.svg?style=flat-square
[travis-url]: https://travis-ci.org/ruiquelhas/burton
