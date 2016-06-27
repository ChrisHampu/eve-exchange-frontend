/* eslint-disable global-require */
import _ from 'lodash';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  horizon: {
    port: process.env.HORIZON_PORT || 8000
  }
};

export default _.extend(config, require(`./${config.env}`).default);
