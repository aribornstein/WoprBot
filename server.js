var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Chess Setup
//=========================================================
var Chess = require('chess.js').Chess;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//create builder
var builder = require('botbuilder');

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

server.get('/', function(req, res) {
    res.end('server is on');
});

server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        builder.Prompts.text(session, 'Hello '+session.userData.name+' how are you today?');
    },function (session, results) {
        if (results.response.includes("good")){
            session.beginDialog('/warOrChess'); 
        }
    },function name(session,results) {
        if (session.userData.game == "chess"){
            session.beginDialog('/chess');
        }
    }

]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Greetings what is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
bot.dialog('/warOrChess', [
        function (session) {
            builder.Prompts.text(session, "THAT'S GOOD TO HEAR, WOULD YOU LIKE TO PLAY A GAME?");
        },
        function (session, results) {
            
        if(results.response.includes("yes")){
            builder.Prompts.text(session, "How about a nice game of chess?");
        }
        else {
            session.send("Okay another time then")
            session.endDialog();
        }
    },function (session, results) { 
        if (results.response.includes("war")){
            builder.Prompts.text(session, "How about a nice game of chess instead?");
        }
        else {
            session.userData.game = "chess";
        }
    },function (session, results) {
        if(results.response.includes("later")){
            builder.Prompts.text(session, "Fine Global Thermonuclear War it is! Will you play as USA or USSR?");
        }
        else if (results.response.includes("okay")){
            session.beginDialog('/chess');
            session.endDialog();
        }
    },function (session, results) {
        session.send("A strange game. The only winning move is not to play. How about a nice game of chess next time?")
        session.endDialog();
    }
]);

bot.dialog('/chess',[
    function name(session) {
       var chess = new Chess();
     //  session.send("loading");
       var move = moves[Math.floor(Math.random() * moves.length)];
       chess.move(move);
       session.send(chess.ascii());
      // builder.Prompts.text(session, "Your move!"); 
   //   session.endDialog();
    }


]);