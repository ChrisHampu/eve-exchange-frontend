const auth_utils = require('../../node_modules/@horizon/server/src/auth/utils.js');

const https = require('https');
const Joi = require('joi');
const querystring = require('querystring');
const url = require('url');

const options_schema = Joi.object().keys({
  path: Joi.string().required(),
  id: Joi.string().required(),
  secret: Joi.string().required(),
}).unknown(false);

function eve_sso(horizon, raw_options) {
  const options = Joi.attempt(raw_options, options_schema);
  const client_id = options.id;
  const client_secret = options.secret;
  const provider = options.path;
  const scope = options && options.scope || ' ';
  const response_type = 'code';
  const auth_code = new Buffer(`${client_id}:${client_secret}`).toString('base64');

  console.log(client_id);
  console.log(client_secret);
  console.log(auth_code);

  const oauth_options = {
    horizon,
    provider,
  };

  oauth_options.make_acquire_url = (state, redirect_uri) => {

    console.log("Redirecting");
    
  	redirect_uri = redirect_uri.replace("https://", "http://");

    return url.format({
      protocol: 'http',
      host: 'login.eveonline.com',
      pathname: '/oauth/authorize',
      query: {
        client_id,
        redirect_uri,
        state,
        //scope,
        response_type
      },
    });
   };

  oauth_options.make_token_request = (code, redirect_uri) => {
    const req = https.request({ method: 'POST',
                                host: 'login.eveonline.com',
                                path: '/oauth/token',
                                headers: { 'Authorization': `Basic ${auth_code}`, "Content-Type": 'application/x-www-form-urlencoded' } });
    
    console.log("token req");
    req.write(querystring.stringify({
      code,
      grant_type: 'authorization_code' }));

    return req;
  };

  oauth_options.make_inspect_request = (access_token) => {

  	console.log("inspecting");
  	console.log(access_token);

    const req = https.request({ method: 'GET',
                                host: 'login.eveonline.com',
                                path: '/oauth/verify',
                                headers: { 'Authorization': `Bearer ${access_token}` } });

    return req;
  }

  oauth_options.extract_id = (user_info) => user_info && user_info.CharacterID.toString();

  auth_utils.oauth2(oauth_options);
};

module.exports = eve_sso;