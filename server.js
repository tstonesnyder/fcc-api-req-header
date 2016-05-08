'use strict';

// Express.js:
var express = require('express');
// For getting parsing client's browser/OS info:
var parser = require('ua-parser-js');

var app = express();
// Use the port that Heroku provides or default to 8080
var port = process.env.PORT || 8080;


app.route('/').get(function (req, res) {
  var result = {}; 
  
  // GET IP ADDRESS OF USER:
  //console.log(`IP Address = ${req.ip}`);  // '127.0.0.1'
  result.ip = req.ip;

  // GET OPERATING SYSTEM OF USER:
  //console.log(`User-Agent string = ${req.headers['user-agent']}`);
  var ua = parser(req.headers['user-agent']);
  //console.log(ua);
  //console.log(`Browser = ${ua.browser.name} ${ua.browser.major}`);
  //console.log(`OS = ${ua.os.name} ${ua.os.version}`);
  result.os = `${ua.os.name} ${ua.os.version}`;
  // res.end(JSON.stringify(ua, null, '  '));

  // GET LANGUAGE OF USER:
  //console.log(`Languages: ${req.headers['accept-language']}`);
  // Parse the Accept-Language header with a reg ex (returns all 2-char strings made of ltrs or dash):
  var langs = req.headers['accept-language'].match(/[a-zA-z\-]{2,10}/g) || [];
  // Get only the first language in the list
  result.lang = langs[0] || "";
  
  // Send result to user:
  res.json(result);
});
  
app.listen(port, function () {
  console.log('Listening on port ' + port + '...');
});

