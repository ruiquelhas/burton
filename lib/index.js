'use strict';

const Stream = require('stream');

const Henning = require('henning');
const Recourier = require('recourier');
const Subtext = require('subtext');

const internals = {};

internals.onPostAuth = function (options) {

    return async function (request, h) {

        if (!(request.payload instanceof Stream.Readable)) {
            return h.continue;
        }

        const { payload } = await Subtext.parse(request.payload, null, {
            allow: 'multipart/form-data',
            output: 'stream',
            parse: true
        });

        request.payload = payload;

        return h.continue;
    };
};

internals.register = async function (server, options) {

    const plugins = [{
        plugin: Henning,
        options
    }, {
        plugin: Recourier,
        options: {
            namespace: 'burton',
            properties: ['payload']
        }
    }];

    await server.register(plugins);

    return server.ext('onPostAuth', internals.onPostAuth(options));
};

module.exports = {
    pkg: require('../package.json'),
    register: internals.register
};
