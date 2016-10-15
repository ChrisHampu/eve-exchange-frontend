import Deepstream from 'deepstream.io-client-js';
import { connectMongoDB } from './mongo_interface';
import config from './config/environment';

const _deepstream = Deepstream('localhost:6021');

export async function connectDeepstream() {

  return new Promise((resolve, reject) => {

    connectMongoDB()
    .then(() => {

      _deepstream.login({admin: config.admin_secret}, function(success, data) {
        console.log("Connected to Deepstream as provider");

        if (!success) {
          reject("Failed to authenticate with deepstream");
          return;
        }
        
        console.log("Authenticated with deepstream");
        resolve(_deepstream);
      });
    })

    _deepstream.on('error', (err, event, topic) => {

      console.log(err, event, topic);
    });
  });
}

export const deepstream = _deepstream;