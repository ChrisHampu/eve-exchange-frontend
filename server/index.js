/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import Koa from 'koa';
import mount from 'koa-mount';
import convert from 'koa-convert';
import serve from 'koa-static';
import historyApiFallback from 'koa-history-api-fallback';
import express from 'express';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import webpackConfig from '../webpack.config';
import config from './config/environment';
import horizon from '@horizon/server';
import eve_sso from './core/eve_sso';

if (config.env === 'development') {

  const horizonServer = new Koa();

 horizonServer.listen(config.horizon.port, () => console.log(chalk.green(`Horizon is listening on port ${config.horizon.port}`)));

  // Launch Relay by using webpack.config.js
  const relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: {
      //'/horizon*': `http://localhost:${config.horizon.port}`
    },
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true
  });

  // Serve static resources
  relayServer.use('/', express.static(path.join(__dirname, '../build')));

  const http_server =  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));

    const horizon_server = horizon(http_server, {
    auth: {
      token_secret: 'my_super_secret_secret'
    },
    project_name: "horizon_test",
    auto_create_collection: true,
    auto_create_index: true,
    permissions: true,
  });

  horizon_server.add_auth_provider(eve_sso, {
    id: '56e9bfbd864f4e7fbc68c64dd71675f4',
    path: 'eve_sso',
    secret: 'zD7gIy7GNmbcLFybtQwZPGpz2boBwtzoMt0WtIxA',
  });
  
} else if (config.env === 'production') {
  // Launch Relay by creating a normal express server
  const relayServer = new Koa();
  relayServer.use(convert(historyApiFallback()));
  relayServer.use(mount('/', serve(path.join(__dirname, '../build'))));
  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));
}
