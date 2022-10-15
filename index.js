const express = require('express');
const app = express();
var path = require('path');
const http = require('http');
var serveStatic = require('serve-static'); 
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/curve_path.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});