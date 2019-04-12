

var express = require('express');

var async = require('async');

// Create an Express server (not yet running) so we can configure it.
// At the end, we'll make the server run with `app.listen()`.

var app = express();

// ```
//
// Express lets you deal with HTTP in an event-driven way, like
// DOM events in the browser.  Similar to jQuery's `.click()` method, the
// `.get()` method lets you bind an event handler to an HTTP GET request event.
//
//
///


///
//
// Our handler is passed two objects: the original httpRequest and a
// new httpResponse.  The new httpResponse is a brand new object that hasn't been
// sent to the web browser yet.  We manipulate the httpResponse however we want
// before finishing up and sending it on its way with the `.send()` method.
// The `.send()` method can used all by itself by passing it the
// content you want to send.
///


///
// Basic Name Demo

app.get('/hello/:name', function(httpRequest, httpResponse) {
    var name = httpRequest.params.name;
    httpResponse.send('Hello, ' + name + '!');
});


var request = require('request');


// VARIABLE LIST //
// Step 1
var playerGamesTotal
let playerGamesTimeTen = [];
var playerArrayLength = 0;
var arrayHolder = 0;

// Step2
var friendsAll =[];
var friendCount = 0;

// Step 3
var friendsPublic =[];
var respond = true;
var publicFriendCount = 0;
var sender = true;


///
// Step 1
// Get the owned games of a player
// Save those games into an array called playerGamesTotal
// Calculate the games they played for more than 10 hours
// Save those games into an array called playerGamesTimeTen
///
  app.get('/GetOwnedGames', function(httpRequest, httpResponse) {
      console.log("Step 1");
      // Calculate the Steam API URL we want to use
      // test case
      // var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&format=json';
      var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=03E5D0505D13270838159A7F1A8BADBD&steamid=76561198035120652&format=json';
      request.get(url, function(error, steamHttpResponse, steamHttpBody) {
          // Once we get the body of the steamHttpResponse, send it to our client
          // as our own httpResponse
          httpResponse.setHeader('Content-Type', 'application/json');
          httpResponse.send(steamHttpBody);
          var json = JSON.parse(steamHttpBody);

          async.times(json.response.game_count, function(i, cb) {
             this.playerGamesTotal = json.response.games[i];
             //1 day = 1440
             if (this.playerGamesTotal.playtime_forever >= 1440)
             {
               playerGamesTimeTen[arrayHolder] = this.playerGamesTotal.appid;
               arrayHolder++;
               playerArrayLength++;

             }
          });
      });
  });


///
// Step 2
// Get the players friend list
// Save to an array
// save length of the array for phase 3
///
app.get('/GetfriendsList', function(httpRequest, httpResponse) {
    console.log("Step 2");
    // Calculate the Steam API URL we want to use
    // test
    // var url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&relationship=all';
    var url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=03E5D0505D13270838159A7F1A8BADBD&steamid=76561198035120652&relationship=all';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
        var json = JSON.parse(steamHttpBody);
        for (var i = 0; i < json.friendslist.friends.length; i++)
        {
           friendsAll[i] = json.friendslist.friends[i].steamid;
           friendCount++;
        }
        console.log("Friends Count: ", friendCount);
    });
});


///
// step 3
// Check if a friend is public
// Get their owned Games
// If the response is not = {}
// Add them to the public friends array
///

app.get('/GetFriendStatus', function(httpRequest, httpResponse)
{

    // Calculate the Steam API URL we want to use
    console.log("step 3");
   // start our url loop and request loop
    async.times(friendCount, function(i, cb) {
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=03E5D0505D13270838159A7F1A8BADBD';
    url += `&steamid=${friendsAll[i]}&format=json`;

    //console.log(url);
    var response = httpResponse;
    var json;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        if (sender === true)
        {
          httpResponse.setHeader('Content-Type', 'application/json');
          httpResponse.send(steamHttpBody);
          sender = false;
        }
        json = JSON.parse(steamHttpBody);
        //checks if its empty
        var count = Object.keys(json.response).length;
        if (count !== 0)
        {
          //console.log("Put into array");
          friendsPublic[publicFriendCount] = friendsAll[i];
          //console.log(friendsPublic[publicFriendCount]);
          publicFriendCount++;
        }
    });
  });
});


// Step 4 Variable List
var send4 = true;
var friendGames = [];
var friendGamesTimeTen = [];
var gameCount = 0;
var add = true;

///
// step 4
// Get the games of the public friends
// Save the most played ones into an array
// Check for duplicates
///
app.get('/GetPublicOwnedGames', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use
    console.log("Step 4");
    async.times(publicFriendCount, function(i, cb)
    {
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=03E5D0505D13270838159A7F1A8BADBD';

    url += `&steamid=${friendsPublic[i]}&format=json`;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        if (send4 === true)
        {
          httpResponse.setHeader('Content-Type', 'application/json');
          httpResponse.send(steamHttpBody);
          send4 = false;
        }
        var json = JSON.parse(steamHttpBody);
        //console.log("Public friend Count: ", publicFriendCount);
        for (var j = 0; j < json.response.game_count; j++)
        {
          add = true;
          var friendGame1 = json.response.games[j];
          if (friendGame1.playtime_forever > 20160)
          {
            for (var count = 0; count < friendGamesTimeTen.length; count++)
            {
              if (friendGame1.appid === friendGamesTimeTen[count])
              {
                add = false;
              }
            }
            if (add === true)
            {
              //console.log(friendGame1.playtime_forever);
              friendGamesTimeTen[gameCount] = friendGame1.appid;
              //console.log("App id: ", friendGamesTimeTen[gameCount], ': ', friendGame1.playtime_forever);
              gameCount++;
            }
          }
        }
    });
  });
});


var matchCount = 0;
///step 5
// Comparing the information to check for matches
// Just uses a plaace holder httpResponse
// Runs a set of nested for loops compairing the two arrays of mined data
///
app.get('/Compairing', function(httpRequest, httpResponse) {
    console.log("Step 5");
    // Calculate the Steam API URL we want to use
    //var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&steamid=76561197960265740&format=json'
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=03E5D0505D13270838159A7F1A8BADBD&steamid=76561197960434622&format=json';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
        var json = JSON.parse(steamHttpBody);

        for (var j = 0; j < playerArrayLength; j++)
        {
          //console.log(playerGamesTimeTen[0]);
          for ( var c = 0; c < gameCount; c++)
          {
            if (playerGamesTimeTen[j] === friendGamesTimeTen[c])
            {
              console.log("Match: ", playerGamesTimeTen[j], " VS ", friendGamesTimeTen[c]);
              matchCount++;
            }
          }
        }
        //Prints out the results
        console.log(matchCount);
        console.log(gameCount);
    });
});


app.use('/', express.static('public'));



var bodyParser = require('body-parser');

app.use(bodyParser.text());

///
// Start the server
// Outout the listening host
///
var port = 4000;
var server = app.listen(port);
console.log('Listening on port ' + port);
