/* eslint-disable no-console, no-shadow */
import "babel-polyfill";
import path from 'path';
import webpack from 'webpack';
import Koa from 'koa';
import mount from 'koa-mount';
import convert from 'koa-convert';
import body from 'koa-body';
import serve from 'koa-static';
import historyApiFallback from 'koa-history-api-fallback';
import express from 'express';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import webpackConfig from '../webpack.config';
import config from './config/environment';
import horizon from '../horizon/server/src/horizon';
import eve_sso from './core/eve_sso';
import jwt from 'jsonwebtoken';

console.log(`Using API key ${config.eve.key_id}:${config.eve.key_secret}`);

if (config.env === 'development') {

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
      token_secret: config.horizon.secret_key
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
      token_secret: config.horizon.secret_key
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

const api = new Koa();

api.use(body());

api.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});

api.use(async ctx => {
  
  if (!ctx.is('application/json')) {
    console.log("is");
    ctx.throw(404);
    return;
  }

  if (ctx.request.path !== "/verify") {
    console.log("path");
    ctx.throw(404);
    return;
  }

  if (ctx.request.method !== "POST") {
    console.log("method");
    ctx.throw(404);
    return;
  }

  if (!ctx.request.body) {
    console.log("body");
    ctx.throw(404);
    return;
  }

  if (!ctx.request.body.jwt) {
    console.log("jwt");
    ctx.throw(404);
    return;
  }

  try {
    ctx.body = {
      jwt: jwt.verify(ctx.request.body.jwt, new Buffer(config.horizon.secret_key, 'base64'), { algorithms: [ 'HS512' ] })
    };
  } catch(err) {
    ctx.body = {
      error: err
    };
  }
});

api.listen(config.verify_port, () => console.log(chalk.green(`API server is listening on port ${config.verify_port}`)));