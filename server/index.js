/* eslint-disable no-console, no-shadow */
import "babel-polyfill";
import path from 'path';
import Koa from 'koa';
import mount from 'koa-mount';
import convert from 'koa-convert';
import body from 'koa-better-body';
import cached from 'koa-static-cache';
import historyApiFallback from 'koa-history-api-fallback';
import chalk from 'chalk';
import config from './config/environment';
import DeepstreamServer from 'deepstream.io';
import DeepstreamAuth from './deepstream_auth';

const httpServer = new Koa();
httpServer.use(convert(historyApiFallback()));

httpServer.use(mount('/bundle.js', cached(path.join(__dirname, '../build/bundle.js'), {
  maxAge: 4 * 60 * 60
})));

httpServer.use(mount('/', cached(path.join(__dirname, '../build'), {
  maxAge: 365 * 24 * 60 * 60
})));

const listener =  httpServer.listen(config.port, () => console.log(chalk.green(`HTTP server is listening on port ${config.port}`)));

const deepstream = new DeepstreamServer('deepstream.dev.yaml');

deepstream.set('httpServer', listener);
deepstream.set('authenticationHandler', new DeepstreamAuth);

deepstream.start();