/* eslint-disable global-require */
import _ from 'lodash';

const config = {
  env: process.env.NODE_ENV || 'development',
  api_port: process.env.API_PORT || 4501,
  port: process.env.PORT || 3000,
  admin_secret: process.env.ADMIN_SECRET || 'admin_secret'
};

export default _.extend(config, require(`./${config.env}`).default);
