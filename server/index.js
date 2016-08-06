require('./console')
const { reqAccessToken } = require('./api')

reqAccessToken()
  .then(console.log)
