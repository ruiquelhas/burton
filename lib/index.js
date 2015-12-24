'use strict';

const Stream = require('stream');

const Henning = require('henning');
const Subtext = require('subtext');

const internals = {};

internals.onPostAuth = function (options) {

    return function (request, reply) {

        if (!(request.payload instanceof Stream.Readable)) {
            return reply.continue();
        }

        const config = {
            allow: 'multipart/form-data',
            output: 'stream',
            parse: true
        };

        Subtext.parse(request.payload, null, config, (err, parsed) => {

            if (err) {
                return reply(err);
            }

            request.payload = parsed.payload;

            reply.continue();
        });
    };
};

exports.register = function (server, options, next) {

    const plugin = {
        register: Henning,
        options: options
    };

    server.register(plugin, (err) => {

        server.ext('onPostAuth', internals.onPostAuth(options));
        next(err);
    });
};

exports.register.attributes = {
    pkg: require('../package.json')
};
