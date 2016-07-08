'use strict';

const Fs = require('fs');
const Os = require('os');
const Path = require('path');

const Code = require('code');
const Content = require('content');
const Form = require('multi-part');
const Hapi = require('hapi');
const Lab = require('lab');

const Burton = require('../lib/');

const lab = exports.lab = Lab.script();

lab.experiment('burton', () => {

    let server;

    lab.before((done) => {

        server = new Hapi.Server();
        server.connection();

        const plugin = {
            register: Burton,
            options: {
                whitelist: ['image/png']
            }
        };

        const main = {
            config: {
                handler: (request, reply) => reply(request.payload),
                payload: {
                    output: 'stream',
                    parse: false
                }
            },
            method: '*',
            path: '/main'
        };

        const ignore = {
            config: {
                handler: (request, reply) => reply(),
                payload: {
                    output: 'file',
                    parse: true
                }
            },
            method: '*',
            path: '/ignore'
        };

        server.register(plugin, (err) => {

            if (err) {
                return done(err);
            }

            server.route([main, ignore]);
            done();
        });
    });

    lab.test('should return control to the server if the route parses or does not handle stream request payloads', (done) => {

        server.inject({ method: 'POST', url: '/ignore' }, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.headers['content-validation']).to.equal('success');
            done();
        });
    });

    lab.test('should return error if the payload cannot be parsed', (done) => {

        const png = Path.join(Os.tmpdir(), 'foo.png');
        Fs.createWriteStream(png).end(new Buffer('89504e47', 'hex'));

        const form = new Form();
        form.append('file', Fs.createReadStream(png));

        server.inject({ headers: { 'Content-Type': 'application/json' }, method: 'POST', payload: form.get(), url: '/main' }, (response) => {

            Code.expect(response.statusCode).to.equal(415);
            Code.expect(response.headers['content-validation']).to.not.exist();
            done();
        });
    });

    lab.test('should return control to the server if all files the in payload are allowed', (done) => {

        const png = Path.join(Os.tmpdir(), 'foo.png');
        Fs.createWriteStream(png).end(new Buffer('89504e47', 'hex'));

        const form = new Form();
        form.append('file1', Fs.createReadStream(png));
        form.append('file2', Fs.createReadStream(png));
        form.append('foo', 'bar');

        server.inject({ headers: form.getHeaders(), method: 'POST', payload: form.get(), url: '/main' }, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.headers['content-validation']).to.equal('success');
            Code.expect(Content.type(response.headers['content-type']).mime).to.equal('multipart/form-data');
            done();
        });
    });
});
