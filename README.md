# burton
File type validation for [hapi](https://github.com/hapijs/hapi) raw stream `multipart/form-data` request payloads.

Like most modern magicians, builds on the work, knowledge and influence of others before it, in this case, [henning](https://github.com/ruiquelhas/henning).

[![NPM Version][fury-img]][fury-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Dependencies][david-img]][david-url]

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

server = new Hapi.Server();
server.connection({
    // go nuts
});

const plugin = {
    register: Burton,
    options: {
      // Allow png files only
      whitelist: ['png']
    }
};

server.register(plugin, (err) => {

    server.route({
        config: {
            payload: {
                output: 'stream',
                parse: false
            }
            // go nuts
        }
    });

    server.start(() => {
        // go nuts
    });
});
```

## Supported File Types

The same as [magik](https://github.com/ruiquelhas/magik#supported-file-types).

[coveralls-img]: https://coveralls.io/repos/ruiquelhas/burton/badge.svg
[coveralls-url]: https://coveralls.io/github/ruiquelhas/burton
[david-img]: https://david-dm.org/ruiquelhas/burton.svg
[david-url]: https://david-dm.org/ruiquelhas/burton
[fury-img]: https://badge.fury.io/js/burton.svg
[fury-url]: https://badge.fury.io/js/burton
[travis-img]: https://travis-ci.org/ruiquelhas/burton.svg
[travis-url]: https://travis-ci.org/ruiquelhas/burton
