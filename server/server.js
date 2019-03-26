// How do I use the Steam API in my web app?

// 1.  Type `node server.js` to start the server.

// Get started
// ---------------
// All of the code you'll see belongs in a single javascript file,
// which we'll call `server.js`.
//
// By convention, you want to put all your 'require' statements at the top.
// However, to avoid introducing too much detail prematurely, I will only
// require packages as they are needed.
//
// We're going to want an HTTP server.  The HTTP server will receive
// incoming HTTP requests from browsers and send an HTTP responses in return.
//
// HTTP is a simple protocol composed entirely of text.  However, we're going
// to side-step a lot of tedious text manipulation by using [Express],
// which wraps HTTP up into familiar Javascript objects and events.
//
// [Express]: http://expressjs.com
//
// ```js

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
// However, the `.get()` method is a little more powerful.  It lets you bind
// different event handlers for different URLs.  For example, the following
// handler responds to GET requests for the root-level URL (e.g., index.html).
//
// ```js


// ```
//
// Our handler is passed two objects: the original httpRequest and a
// new httpResponse.  The new httpResponse is a brand new object that hasn't been
// sent to the web browser yet.  We manipulate the httpResponse however we want
// before finishing up and sending it on its way with the `.send()` method.
// The `.send()` method can used all by itself by passing it the
// content you want to send.
//
// And here's a GET event handler for a different URL.
//


// ```
//
//
// Add parameters to the path
// --------------------------
// Express also lets us define variables in the path.  These variables
// will be stored by Express in the `httpRequest.params` object.
// We can then use those variables to construct a response.
// Open a web browser to [http://localhost:4000/steam/hello/Rachel]
// (http://localhost:4000/steam/hello/Rachel).
//
// Try changing "Rachel" in the URL in the browser.
//
// ```js

app.get('/hello/:name', function(httpRequest, httpResponse) {
    var name = httpRequest.params.name;
    httpResponse.send('Hello, ' + name + '!');
});

// ```
//
// Changing tracks from Express for a moment to introduce the 'request' package.
//
// We can use the `request` package to make our own HTTP requests.  For example,
// make an HTTP request to the Steam API to download the Civ5 achievements.
//
// ```js

var request = require('request');

// Now we can try something a little fancier.  We can use the `request` package
// to send our own HTTP requests to third parties.  We can use the third-party's
// response to help construct our own response.
//
// Open a web browser to [http://localhost:4000/steam/civ5achievements]
// (http://localhost:4000/steam/civ5achievements).
//
// ```js

app.get('/steam/civ5achievements', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960508417&format=json';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});



var playerGamesTotal
var playerGamesTimeTen = [];
var friendsAll =[];
var friendsPublic =[];
///
// Step 1
// Get the owned games of a player
// Save those games into an array called playerGamesTotal
// Calculate the games they played for more than 10 hours
// Save those games into an array called playerGamesTimeTen
///
  app.get('/GetOwnedGames', function(httpRequest, httpResponse) {
      // Calculate the Steam API URL we want to use
      //var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&steamid=76561197960265740&format=json'
      var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&format=json';
      request.get(url, function(error, steamHttpResponse, steamHttpBody) {
          // Once we get the body of the steamHttpResponse, send it to our client
          // as our own httpResponse
          httpResponse.setHeader('Content-Type', 'application/json');
          httpResponse.send(steamHttpBody);
          var json = JSON.parse(steamHttpBody);

          for (var i = 0; i < json.response.game_count; i++)
          {
             var arrayHolder = 0
             this.playerGamesTotal = json.response.games[i];
             if (this.playerGamesTotal.playtime_forever >= 600)
             {
               arrayHolder++;
               //console.log(this.playerGames.appid);
               playerGamesTimeTen[arrayHolder] = this.playerGamesTotal.appid;
               console.log(playerGamesTimeTen[arrayHolder]);

             }
          }

      });
  });

var friendCount = 0;
///
// Step 2
// Get the players friend list
// Save to an array
// save length of the array for phase 3
///
app.get('/GetfriendsList', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use
    var url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&relationship=all';
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
    });
});

var respond = true;
///
// step 3
// Check if a friend is public
// Get their owned Games
// If the response is not = {}
// Add them to the public friends array
///

app.get('/GetFriendStatus', function(httpRequest, httpResponse)
{
    var publicFriendCount = 0;
    //async.times(friendCount, function(i, cb) {
    // Calculate the Steam API URL we want to use
  //  var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3';

   var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622';

  //  for (var i = 0; i < 1; i++)
    //{
      //url += `&steamid=${friendsAll[i]}`;
    //}
    url += `&format=json`;
    console.log("step 3");
    var response = httpResponse;
    var json;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        response.setHeader('Content-Type', 'application/json');
        response.send(steamHttpBody);
        json = JSON.parse(steamHttpBody);
        //console.log(json.response.count);
        console.log(typeof(json.response));
        //checks if its empty
        var count = Object.keys(json.response).length;
        console.log(count);
        if (count !== 0)
        {
          console.log("Put into array");
        }
    });
  //});
});


/// Test 2
///
app.get('/Biglist', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&format=json'
    //var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960434622&format=json';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
        var json = JSON.parse(steamHttpBody);

        for (var i = 0; i < json.response.game_count; i++)
        {
           var arrayHolder = 0
           this.playerGamesTotal = json.response.games[i];
           if (this.playerGamesTotal.playtime_forever >= 600)
           {
             arrayHolder++;
             //console.log(this.playerGames.appid);
             playerGamesTimeTen[arrayHolder] = this.playerGamesTotal.appid;
             console.log(playerGamesTimeTen[arrayHolder]);

           }
        }

    });
});



//Test
app.get('/testStatus', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use
    //var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=C771F5AA72C620510410E84F55D8BAB3&steamids=';
    var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=C771F5AA72C620510410E84F55D8BAB3&steamids=76561197960508417';
    //var arrayLength = len(this.friendsAll.length);
    //for (var i = 0; i < friendsAll.length; i++)
  //  {
    //  url += `${friendsAll[i]},`;
    //}
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
        var json = JSON.parse(steamHttpBody);

        for (var i = 0; i < json.response.players.length; i++)
        {
          if ( json.response.players[i].communityvisibilitystate === 3)
          {
            friendsPublic[i] = json.response.players[i].steamid;
          }
        }
        console.log(friendsPublic.length);
    });
});


///
// Step 4
// Getting the owned games of te puplic friends
// Use the public friends steam id array to cycle to mark down the most common owned games
// call to get the game list of the friends
  app.get('/GetFriendOwnedGames', function(httpRequest, httpResponse) {
      // Calculate the Steam API URL we want to use
      //for (var i; i <= fri)
      var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=C771F5AA72C620510410E84F55D8BAB3&steamid=76561197960508417';
      //url += `${friendsPublic[0]}&format=json`;
      console.log(friendsPublic[3])
      //var arrayLength = len(this.friendsAll.length);
      //for (var i = 0; i < friendsPublic.length; i++)
      //{
      //  url += `${friendsAll[i]}&format=json`;
      //}
      request.get(url, function(error, steamHttpResponse, steamHttpBody) {
          // Once we get the body of the steamHttpResponse, send it to our client
          // as our own httpResponse
          httpResponse.setHeader('Content-Type', 'application/json');
          httpResponse.send(steamHttpBody);
          var json = JSON.parse(steamHttpBody);

          for (var i = 0; i < json.response.game_count; i++)
          {
              var arrayHolder = 0
             this.playerGames = json.response.games[i];
             if (this.playerGames.playtime_forever >= 600)
             {
               arrayHolder++;
               //console.log(this.playerGames.appid);
               friends[arrayHolder] = this.playerGames.appid;
               console.log(friends[arrayHolder]);

             }
          }


      });
  });



// ```
//
// Combine the previous two techniques (variables in paths, request package).
//
// Open a web browser to [http://localhost:4000/steam/game/8930/achievements]
// (http://localhost:4000/steam/game/8930/achievements) then try changing `8930`
// (Civ5) to `292030` (Witcher 3).
//
// ```js

app.get('/steam/game/:appid/achievements', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use
    var url = 'http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json' +
        httpRequest.params.appid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        var json = JSON.parse(steamHttpBody)
        console.log(json.appnews.appid)
        //
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

// ```
//
//
// Host static files
// -----------------
// What about your static files like `index.html` and `my-angular-app.js`?
// You might expect from the preceding that we'd need to bind event handlers
// for every path.  Well, maybe we can get clever and use those parameters
// in the path.  We'd need to learn how to read files from the filesystem
// and… ugh.  Yep, We can totally do that.
//
// No, we're not going to do that.
//
// This is such a common problem that Express has included
// a piece of software to handle it.  This software is called
// `express.static`.  If you call `express.static('public')`, Express
// writes an event handler for you to serve up static files, if they exist,
// in the 'public' folder.  All you need to do is to tell Express when to
// use it.  To tell express when to to call the new handler, use `app.use`.
//
// After you call `app.use`, files like 'public/index.html' can be accessed
// in a web browser at [http://localhost:4000/static/index.html]
// (http://localhost:4000/static/index.html).
//
// ```js

app.use('/', express.static('public'));

// ```
//
//
// ### Why `/static`?
//
// You could totally just use `/`.  It's your choice.
// However, it's a good practice to place static files under a different path.
// If you accidentally name a file in a way that matches a path that's handled
// by one of your HTTP event handlers, the file wins.
// But, you don't really want to have to remember that.
// Careful file naming can prevent these problems.
//
//
// ### Why `app.use`; why not `app.get`?
//
// The handlers that can be passed to `app.use` are a bit fancier that what
// we've been writing.  They need to know more about Express' innards and they
// get executed before the HTTP event handlers that we've been writing.
// In fact, they can do some neat pre-processing on
// the incoming HTTP requests before our event handlers see them.  After
// using `app.use` with `express.static`, Express makes a new decision when
// an incoming HTTP request comes in:
//
// > IF there is a file at the requested path, respond with it;
// > IF NOT, try to use one of our event handlers.
//
// It would take a lot of extra work to put this decision into every `.get()`
// event handler.  So, `app.use` saves us a ton of work.
//
//
// What was httpRequest for?
// -------------------------
// What about that httpRequest parameter?  We haven't done much with it yet.
// Typically HTTP GET requests don't have a body, but that's not the case
// with POST and PUT.  When a web browser sends new data to the server,
// they place that new data in the body of the HTTP POST or HTTP PUT request.
//
// ```js

var bodyParser = require('body-parser');

app.use(bodyParser.text());

// ```
//
// You'll need to use Postman to test out this example, because web browsers
// don't give users an easy way to make an HTTP POST.
//
// Just to show how this works, we'll just write the HTTP POST body to the
// console.  So, open up Postman and make an HTTP POST to
// [http://localhost:4000/frank-blog](http://localhost:4000/frank-blog).
//
// To constuct your request in Postman, click the 'GET' dropdown next
// to the URL and change to POST, then click the 'BODY' tab and choose
// the 'raw' radio button.  Change the content type to 'Text'.  Type some text
// in the body, then send the request.
//
// ```js

app.post('/frank-blog', function(httpRequest, httpResponse) {
    console.log(httpRequest.body);
    // We need to respond to the request so the web browser knows
    // something happened.
    // If you've got nothing better to say, it's considered good practice to
    // return the original POST body.
    httpResponse.status(200).send('Posted today:\n\n' + httpRequest.body);
});

///
// Start the server
// Outout the listening host
///
var port = 4000;
var server = app.listen(port);
console.log('Listening on port ' + port);


// (https://gist.github.com/johnchristopherjones/c6c8928d2ffa5ccbda6a))
