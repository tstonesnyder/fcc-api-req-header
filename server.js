'use strict';

// Express.js:
var express = require('express');
// For getting parsing client's browser/OS info:
var parser = require('ua-parser-js');

var app = express();
// This app will be running behind a proxy (at Cloud9 or at Heroku), 
// so set this to get the correct ip address,
// then it will use req.headers['x-forwarded-for']
// instead of req.connection.remoteAddress.
app.enable('trust proxy');

// Use the port that Heroku provides or default to 8080 (for Cloud9):
var port = process.env.PORT || 8080;


app.route('/').get(function (req, res) {
  var result = {}; 
  
  // GET IP ADDRESS OF USER:
  //console.log(`IP Address using req.ip = ${req.ip}`);
  console.log(`IP Address using req.headers['x-forwarded-for'] = ${req.headers['x-forwarded-for']}`);
  console.log(`IP Address using req.socket.remoteAddress = ${req.socket.remoteAddress}`);
  result.ipaddress = req.ip;

  // GET LANGUAGE OF USER:
  console.log(`Languages: ${req.headers['accept-language']}`);
  // Parse the Accept-Language header with a reg ex (returns all 2-char strings made of ltrs or dash):
  var langs = req.headers['accept-language'].match(/[a-zA-z\-]{2,10}/g) || [];
  // Get only the first language in the list
  result.language = langs[0] || "";

  // GET OPERATING SYSTEM OF USER:
  console.log(`User-Agent string = ${req.headers['user-agent']}`);
  // From the user-agent string, get the info from inside the first set of parentheses:
  var osString = req.headers['user-agent'].split(') ')[0].split(' (')[1];
  result.software = `${osString}`;
  
  // PARSE OUT THE OS INFO (CUZ THE INFO ABOVE IS NOT GREAT):
  // Parse the ua string using a pkg:
  var ua = parser(req.headers['user-agent']);
  //console.log(ua);
  //console.log(`Browser = ${ua.browser.name} ${ua.browser.major}`);
  //console.log(`OS = ${ua.os.name} ${ua.os.version}`);
  result.os = `${ua.os.name} ${ua.os.version}`;

  // Send result to user:
  res.json(result);
});
  
app.listen(port, function () {
  console.log('Listening on port ' + port + '...');
});

