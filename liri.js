//ARRAY OF COMMAND TYPES
var commandTypes = ['my-tweets','spotify-this-song','movie-this','do-what-it-says','read-log','exit'];

//DEPENDENCY FOR INQUIRER NPM PACKAGE
var inquirer = require("inquirer");
var fs = require("fs");

//MAIN PROMPTS FUNCTION
 var runProgram = function(){
 	 inquirer.prompt([
            {
              name: "commandType",
              type: "rawlist",
              message: "Which command would you like to run?",
              choices: commandTypes
            }
          ]).then(function(answer) {
	            switch(answer.commandType){ //MIAN SWITCH
	            	case "my-tweets":
	            		//CALL myTweets FUNCTION. REQUIRES NO PARAMETER 
	            		myTweets();
	            		break;	            		
					case "spotify-this-song":
						//CALL spotifyThisSong FUNCTION. PASS IN PARAMETER OF "" (BLANK)
						spotifyThisSong("");						
						break;
					case "movie-this" :
						//CALL movieThis FUNCTION. PASS IN PARAMETER OF "" (BLANK)
						movieThis("");
						break;						
					case "do-what-it-says" :
						//CALL doWhatItSays FUNCTION. REQUIRES NO PARAMETER 
						doWhatItSays();
						break;
					case "read-log" :
						//CALL readLog FUNCTION. REQUIRES NO PARAMETER 
						readLog();
						break;
					case "exit" :
						//EXIT
						console.log("Bye!");
						break;							
	            }//END OF MAIN SWITCH  
                       
          });//END OF then(function(answer)
}; //END OF RunProgram FUNCTION

var myTweets = function(){
	var Twitter = require('twitter');

	// Grabs the keys variables
	var twitterKey = require("./keys.js");

	// Gets all the twitterkeys from the keys file.
	var twitterKeyList = twitterKey.twitterKeys;	

	//Instanciate a new twitter object to hold the twitter account key values
	var client = new Twitter({
  		consumer_key: twitterKey.twitterKeys.consumer_key, //TwitterAccountKeys.consumerKey,
  		consumer_secret: twitterKey.twitterKeys.consumer_secret,
  		access_token_key: twitterKey.twitterKeys.access_token_key,
  		access_token_secret: twitterKey.twitterKeys.access_token_secret
	});

	var params = ""; 
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
  			//tweets count 
  			var tweetCount = 1;
  			var numbOfTweets = tweets.length;

  			fs.appendFile("log.txt", "**my-tweets**\n");
  			
  			//Loop through the tweets object to get tweet infor
	  		for(tweet in tweets){
	  			//VARIABLE USE TO DISPLAY LAST LINE OF ASTRIKS *
				var lastRecordCount = 0;

	  			//Display only 20 tweets
	  			if(tweetCount <= 20){
	  				var outPut = "";
	  				console.log("**********************");

	  				//TWEET TEXT
	  				console.log("Tweet: " + tweets[tweet].text);

	  				//TWEET DATE
	  				console.log("Date Tweeted: " + tweets[tweet].created_at);						  				

	  				//CAPTURE INFO INTO VARIABLE OUTPUT
	  				outPut = "Tweet: " + tweets[tweet].text + "\nDate Tweeted: " + tweets[tweet].created_at + "\n**********************\n";
	  				
	  				//APPEND THE INFO TO LOG.TX
	  				fs.appendFile("log.txt", outPut);

	  				tweetCount++; //INCREMENT BY 1

	  			}
	  		}//End of tweets for loop	

	  		console.log("**********************");
	  		 //CALL runAnotherCommand FUNCTION
			 runAnotherCommand();	

	    }//End of if !error
	});
}//END OF myTweets FUNCTION

var spotifyThisSong = function(searchSong){
	
	var Spotify = require('node-spotify-api');	

	//Objet to hold captured spotify accont keys
	var spotifyAccountKeys = {
		clientId : '',
		clientSecret : '',
	}	

	// Grabs the keys variables
	var spotifyKey = require("./keys.js");

	//Instanciate a new twitter object to hold the twitter account key values
	var spotify = new Spotify({
	  id: spotifyKey.spotifyKeys.client_id,
	  secret: spotifyKey.spotifyKeys.client_secret
	});

  	  //FUNCTION THAT SEARCHES SONG AND CONSOLE LOGS SONG INFO
     var searchAndConsoleLog = function(song){
      	spotify.search({ type: 'track', query: song, limit: 5})
		  .then(function(response) {
		  		var url = "";
		  		fs.appendFile("log.txt", "**spotify-this-song**\n");
			  	for(var i = 0; i < response.tracks.items.length; i++){
			  		var outPut = "";
			  		
				  	console.log("**********************");

				  	//SONG ARTIST
				  	console.log("Artist: " + response.tracks.items[i].artists[0].name);

				  	//SONG NAME
				  	console.log("Song: " + response.tracks.items[i].name);

				  	//SONG PREVIEW URL
				  	if(response.tracks.items[i].preview_url !== null){
				  		console.log("Song Preview: "+ response.tracks.items[i].preview_url);
				  		url = "Song Preview: "+ response.tracks.items[i].preview_url;
				  	}else{
				  		console.log("Song Preview: No Preview Available");
				  		url = "Song Preview: No Preview Available";
				  	}
				  	//ALBUM NAME
				  	console.log("Album: " + response.tracks.items[i].album.name);

				  	//CAPTURE INFO INTO VARIABLE OUTPUT
				  	outPut = "Artist: " + response.tracks.items[i].artists[0].name + "\nSong: " + response.tracks.items[i].name + 
				  	"\n" + url + "\n**********************\n";

				  	//APPEND THE INFO TO LOG.TX
				  	fs.appendFile("log.txt", outPut);

				}//END OF response.tracks.items.length FOR LOOP
				console.log("**********************");
				 //CALL runAnotherCommand FUNCTION
				 runAnotherCommand();	
		  })
		  .catch(function(err) {
		    console.log(err);
		  });
      };//END OF searchAndConsoleLog FUNCTION


	if(searchSong !== ""){
		searchAndConsoleLog(searchSong);
	}else{
	//ASK FOR SONG TO SEARCH FOR. DEFAULT "THE SIGN" BY ACE OF BASE
	inquirer.prompt([
        {
          name: "song",
          type: "input",
          message: "Which song would you like to Spotify?",
          default: "The Sign"
        }
      ]).then(function(answer) {
      		//CALL FUNCTION TO SEARCH SONG AND CONSOLE LOG INFO
      		searchAndConsoleLog(answer.song);      		
      });
    }
};

var movieThis = function(searchMovie){

 //FUNCTION THAT SEARCHES MOVIE AND CONSOLE LOGS MOVIE INFO
  var searchAndConsoleLog = function(movie){
  	var request = require("request");
	request("http://www.omdbapi.com/?t=" + movie + "&type=movie&apikey=40e9cece", function(error, response, body) {
	  //IF THE REQUEST IS SUCCESSFUL									
	  if (!error && response.statusCode === 200) {								  	
	  		
  		//IF NO MOVIE WAS RETURNED THEN DO CONSOLE LOG MOVIE NOT FOUND
  		if(JSON.parse(body).Response === "False"){
  			fs.appendFile("log.txt", "**spotify-this-song**\n");
		  	console.log("Movie not found! Check spelling to see if title was mis-spelled");
		  	fs.appendFile("log.txt", "Movie not found! Check spelling to see if title was mis-spelled\n**********************");
		 	
		 //ELSE DISPLAY MOVIE INFO
		 }else{
		 	var outPut = "";
		 	var rottenTomattoRating = "";
		 	fs.appendFile("log.txt", "**movie-this**\n");
		  	console.log("**********************");
		  	//TITLE OF MOVIE
		  	console.log("Movie Title: " + JSON.parse(body).Title);
		  	//YEAR THE MOVIE CAME OUT
		  	console.log("Release Year: " + JSON.parse(body).Year);
		  	//IMDB RATING OF THE MOVIE
		  	console.log("IMDB Rating: " + JSON.parse(body).imdbRating);

		  	//IF RATINGS ARRAY IS NOT EMPTY THEN DISPLAY THE RATING ELSE RETUR VALUE OF N/A
		  	if(JSON.parse(body).Ratings.length > 1){
		  		//ROTTEN TOMATOES RATING OF THE MOVIE
		  		console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		  		rottenTomattoRating = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
		  	}else{
		  		console.log("Rotten Tomatoes Rating: N/A");
		  		rottenTomattoRating = "Rotten Tomatoes Rating: N/A";
		  	}
		  	//COUNTRY WHERE THE MOVE WAS PRODUCED
		  	console.log("Produced in: " + JSON.parse(body).Country);
		  	//LANGUAGE OF THE MOVIE
		  	console.log("Language: " + JSON.parse(body).Language);
		  	//PLOT OF THE MOVIE
		  	console.log("Plot: " + JSON.parse(body).Plot);
		  	//ACTORS IN THE MOVIE
		  	console.log("Cast: " + JSON.parse(body).Actors)
		  	;
		  	//CAPTURE INFO INTO VARIABLE OUTPUT
		  	outPut = "Movie Title: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year + 
		  	"\nIMDB Rating: "	+ JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + rottenTomattoRating + 
		  	"\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " +  JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + 
		  	"\nCast: " + JSON.parse(body).Actors + "\n**********************\n";

		  	//APPEND THE INFO TO LOG.TX
		  	fs.appendFile("log.txt", outPut);

		  }//END OF JSON.PARSE(BODY) IF		

		  console.log("**********************");
		  //CALL runAnotherCommand FUNCTION
		  runAnotherCommand();											   
	  }//END OF !ERROR && RESPONSE.STATUS CODE IF
	});//END OF request
  };//END OF searchAndConsoleLog FUNCTION

  if(searchMovie !== ""){
  	searchAndConsoleLog(searchMovie);
  }else{
	inquirer.prompt([
    {
      name: "movie",
      type: "input",
      message: "Which movie would you like to search?",
      default: "Mr. Nobody"
    }
  ]).then(function(answer) { 
  		searchAndConsoleLog(answer.movie);
	
  });//END OF then(function(answer))
 }
};//END OF movieThis FUNCTION

var doWhatItSays = function(){
	var fs = require("fs");
	var list = [];
	var value1 = "";
	var value2 = "";
	fs.readFile("random.txt","utf8",function(err,data){
		
		list = data.split(",");
		
		for(var i = 0; i < list.length; i++){
			if(i === 0){
				value1 = list[i];
			}else{
				value2 = list[i];									
			}
		}		
		
		switch(value1){
			case "my-tweets" :
				//CALL myTweets. NO PARAMETER PASSED
				myTweets();
				break;
			case "spotify-this-song" :
				//CALL spotifyThisSong AND PASS VALUE 2 (SEARCHSONG)
				spotifyThisSong(value2);
				break;
			case "movie-this" :
				//CALL movieThis AND PASS VALUE 2 (SEARCHMOVIE)
				movieThis(value2);
				break;
			case "do-what-it-says" :
				//CALL doWhatItSays. NO PARAMETER PASSED
				doWhatItSays();
				break;
		}													
	});			
};//END OF doWhatItSays FUNCTION

var readLog = function(){
	//READ THE DATA FROM LOG.TXT AND CONSOLE LOG
	fs.readFile("log.txt","utf8",function(err,data){
		if(!err){
			//CONSOLE LOG THE FILE DATA
			console.log(data)
			//CALL runAnotherCommand FUNCTION
			runAnotherCommand();
		}
	});
	
}//END OF readLog FUNCTION

var runAnotherCommand = function(){
	//ASK USER IF THEY WANT TO RUN ANOTHER COMMAND
	inquirer.prompt([							
		{
			name: "continue",
			type: "confirm",
			message: "Run another command?",
			default: "Y"
		}
	]).then(function(answer) {
		//IF TRUE THEN RUN THE PROGRAM (RECURSION)
		if(answer.continue === true){
			runProgram();
		//ELSE EXIT PROGRAM
		}else{
			console.log("Bye!");
		}
	}); 				
};//END OF runAnotherCommand FUNCTION

//START
runProgram();
