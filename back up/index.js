var restify = require('restify');
var builder = require('botbuilder');
//var Promise = require('bluebird');
//var url = require('url');
var mysql = require('mysql');



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
    //My SQL connectivity
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Work0spirit@",
  database: "BOT_test"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {session.sendTyping();
    setTimeout(function () {
    session.send('Welcome to Product and Retailer Services');
	builder.Prompts.text(session,"Hello, what is your name?");
    }, 3000);

    
    },
    function (session, results) {
        session.dialogData.name = results.response;
		var empname=session.dialogData.name;
		console.log(session.dialogData.name);
              
        session.send('Hello  '+empname+'!! to avail complete feature please login to the application.');
        builder.Prompts.number(session, "Please help me with your id");
        
    },
    
    
    function (session, results) {
        session.dialogData.empid = results.response;
        //var empname=session.dialogData.name;    
		var empid=session.userData.empid;
        var name=session.userData.name;
        session.send('Thank you for the information. Please let me validate the same...');
		console.log('Works till here');
        validationEmp(session,session.dialogData.name,session.dialogData.empid); 
		//session.send("Hi... Here's the list of products that you own.");		
    }
	]);



 function validationEmp(session,empname,empid){
     	//var empid=session.userData.empid;
        //var name=session.userData.name;
        //var FirstName = name;
		var sql="SELECT * FROM employee WHERE id=? AND (name =?)";
        console.log("reached here");
        con.query( sql,[empid,empname,empname], function (err, result) {
            if (err) throw err;
            if(result.length==0){
                    session.sendTyping();
                    setTimeout(function () {
                    session.send('Unable to validate your information '+empname+'! Please enter correct information');
                }, 3000);
            }
              
	        else {
				
                    session.sendTyping();
                    setTimeout(function () {
                    session.send(result[0].LastName+' '+result[0].FirstName+' Your information has been validated. :) ')
                    builder.Prompts.text(session,"To view the items listed type show or list.");
                    }, 3000);
                    
                
    
    
               
			}
			
	    });
 }
 
// The below code is used to stop the conversation..
bot.dialog('close', function (closeSession){
    var msg;
    closeSession.endConversation(msg);

}).triggerAction({matches: /^(close|exit|shut up|please stop|stop it)/i});
/*
bot.dialog('AI', function (AISession){
    var msg;
    AISession.send("My name is Minerva. I am named after a goddess. Minerva was the Roman goddess of wisdom and strategic warfare, and the sponsor of arts, trade, and strategy. ");
    AISession.endConversation(msg);

}).triggerAction({matches: /^(What is meant by Minerva|Minerva|Who was Minerva|Tell me about yourself)/i});
*/


