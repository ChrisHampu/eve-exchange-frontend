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
import horizon from '../horizon/server/src/horizon';
import eve_sso from './core/eve_sso';

console.log(`Using API key ${config.eve.key_id}:${config.eve.key_secret}`);

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
    project_name: config.horizon.project_name,
    auto_create_collection: true,
    auto_create_index: true,
    permissions: config.horizon.permissions,
    rdb_host: config.horizon.rdb_host,
    rdb_port: config.horizon.rdb_port
  });

  horizon_server.add_auth_provider(eve_sso, {
    id: config.eve.key_id,
    path: 'eve_sso',
    secret: config.eve.key_secret,
  });
  
} else if (config.env === 'production') {

  // Launch Relay by creating a normal express server
  const relayServer = new Koa();
  relayServer.use(convert(historyApiFallback()));
  relayServer.use(mount('/', serve(path.join(__dirname, '../build'))));
  
  const http_server =  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));

  const horizon_server = horizon(http_server, {
    auth: {
      token_secret: 'my_super_secret_secret'
    },
    project_name: config.horizon.project_name,
    auto_create_collection: true,
    auto_create_index: true,
    permissions: config.horizon.permissions,
    rdb_host: config.horizon.rdb_host,
    rdb_port: config.horizon.rdb_port
  });

  horizon_server.add_auth_provider(eve_sso, {
    id: config.eve.key_id,
    path: 'eve_sso',
    secret: config.eve.key_secret,
  });
}
