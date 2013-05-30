// development.js

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.listen(3000);

/*
var deployd = require('deployd');

var server = deployd({
  port: process.env.PORT || 5000,
  env: 'production',
  db: {
    host: 'localhost',
    port: 27017,
    name: 'deployd',
    credentials: {
      username: 'deployd',
      password: 'deployd'
    }
  }
});

server.listen();

server.on('listening', function() {
  console.log("Server is listening");
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});


*/