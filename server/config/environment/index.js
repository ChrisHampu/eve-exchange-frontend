/* eslint-disable global-require */
import _ from 'lodash';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  horizon: {
    port: process.env.HORIZON_PORT || 8000,
    project_name: process.env.HORIZON_NAME || 'horizon_test',
    permissions: process.env.HORIZON_PERMISSIONS || true,
    rdb_host: process.env.HORIZON_RDB_HOST || 'localhost',
    rdb_port: process.env.HORIZON_RDB_PORT || '28015'
  },
  eve: {
    key_id: process.env.EVE_KEY_ID || '56e9bfbd864f4e7fbc68c64dd71675f4',
    key_secret: process.env.EVE_SECRET || 'zD7gIy7GNmbcLFybtQwZPGpz2boBwtzoMt0WtIxA'
  }
};

export default _.extend(config, require(`./${config.env}`).default);
