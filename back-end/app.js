var express = require('express')
var app = express()
var expressWs = require('express-ws')(app)
var socketServer = expressWs.getWss('/')

app.use(function (req, res, next) {
  console.log('middleware')
  req.testing = 'testing'
  return next()
});

app.get('/', function(req, res, next){
  console.log('get route', req.testing)
  res.end()
});

app.ws('/', function(ws, req) {
  ws.on('message', function(d) {
    console.log(req.connection.remoteAddress)
    socketServer.clients.forEach(function (client) {
      console.log(d)
      client.send(d)
    })
  });
  console.log('socket', req.testing)
});

app.listen(3000);
