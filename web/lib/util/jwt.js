const config = require('config')
const jwt = require('jwt-simple')

module.exports = {
  encode: (payload, secret) =>
    jwt.encode(payload, secret || config.get('SECRET'), 'HS512'),
  decode: (token, secret) =>
    jwt.decode(token, secret || config.get('SECRET'), false, 'HS512')
}
