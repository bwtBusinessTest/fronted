var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.10.2.20:8040/web/"'
  // BASE_API: '"http://10.10.2.20/microservice-dist-provider"'
})
