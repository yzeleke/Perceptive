var catagories = [0,0,0,0,0,0,0,0]; // happiness, sadness, bored, tired, depressed, successful, business, healthy
var cata_desc = ["happy", "sad", "bored", "tired", "depressed", "successful", "business", "healthy"];
var all_tags=[];
var proceed = 0;
var database;
var tags = [];
function requestTags(imurl) {
    var TOKEN = getToken(imurl);
}

// Obtain token using client id and secret
function getToken(imurl) {

    var token;

    var clientData = {
        'grant_type': 'client_credentials',
        'client_id': "dD8aUjmJdHaISSLS4HJbV9-dlH41Y5rJnl-y1Apo",
        'client_secret': "WciwBvTUx9RxdYSJcORHuHkqX-NeFKVqnwY8nORN"
    };

    $.ajax({
        'url': 'https://api.clarifai.com/v1/token',
        'data': clientData,
        'type': 'POST',
        success: function (response) {
            console.log("Token = " + response.access_token);
            return useToken(response.access_token, imurl);
        }
    });
}

function useToken(accessToken, imgurl) {

    var imgData = {
        'url': imgurl
    };

    $.ajax({
        'url': 'https://api.clarifai.com/v1/tag',
        'headers': {
            'Authorization': 'Bearer ' + accessToken
        },
        'data': imgData,
        'type': 'POST',
        success: function (response) {
            //debug info
            //console.log("Obtained response from Clarifai");   
            parseResponse(response);
        }
    });
}

function parseResponse(r) {
    
    console.log(r.results);
    if (r.status_code === 'OK') {
        var results = r.results[0];
        tags = results.result.tag.classes;
        //console.log(tags);
        proceed =1;
    } else {
        console.log('Sorry, something is wrong.');
    }

   // $('#tags').text(tags.toString().replace(/,/g, ', '));
     all_tags = tags.toString().replace(/,/g, ', ');
    checkPassword();
    // return tags;
}


// A couple of non-API call related functions (interactivityyyyy)


// Change the image div class to show to display the image in the url
function showImg(iurl) {
    x = document.getElementById('image').className = 'show';
    y = document.getElementById('imgdisp').src = iurl;

    // Set the tags div width so that it fits next to the image
 	$('#tags').css("width", $(document).width() - document.getElementById('image').offsetWidth - 40);
}

function seePerception(){
   var value = interpret();
   console.log('yo the returned idx is');
   console.log(value);

   if(value >=0){

        $("#database_msg").text("Based on the photos you provided the world will percieve you to be a "
         +cata_desc[value]+" person");

    }
    //catagories = [0,0,0,0,0,0,0,0];
}

// if user press enter instade of clicking the buttonsff
function handle(e, url) {
    if (e.keyCode === 13) {
        //alert("Enter was pressed");
        showImg(url);
        requestTags(url);
    }
    return false;
}




function checkPassword(){
    
    /*
        var username = document.getElementById('username_').value;
        var password = document.getElementById('password_').value;
    
        if ("ASC3"==username&& "123"==password){
            proceed = 1;
                                 // Create a <p> element
            alert("Data successfully saved on database" );       // Create a text node
            
        //$("#updateinfo").append("Data successfully saved on database" );
        }
        else
        {
                                  // Create a <p> element
            alert("Unauthorized access denied" );       // Create a text node
            
        }
        

*/
    saveTag();



}
function saveTag(){
    
    //initialize firebase for saving database
     // Initialize Firebase
    
    database = firebase.database().ref(); 

    if(proceed==1){
            database.push({
                'Tags': all_tags

        });
    }
    
 
    proceed =0;
}


function clearDatabase(){
    database.remove();
    $("#database_msg").remove();
    
}

//interpret pictures tag to meaning full information
//brief: this function will look at the tag of the picture using the clarifia web app and 

function interpret(){
    var n;
    var class_idx=0;
    console.log('before interpret: ' ,tags);
    database.on('child_added',function(dataRow){
            //getting raw values
            var row = dataRow.val();
            console.log('after interpret: ' , tags.length);
            console.log(tags[0]);
            //console.log(row["Tags"]);
            //var split_row=row.replace(/\s/g,'');
            //var split_row =(row.Tags).split(" ");
            //var split_row = (row.Tags).split(", ");
            //console.log("length:"+split_row.length);
            for (var i =0; i<tags.length;i++){
            	//console.log(split_row[i]);
            	if( (tags[i]==="happy") || (tags[i]==="smile") /*|| tags[i]==="athlete" */){
                    console.log("inside happy");
            		catagories[0]++;
                    console.log(catagories[0]);
            	}
            	if( (tags[i]==="sad") || (tags[i]==="pain") ||(tags[i]==="facial expression") || (tags[i]==="athlete")){
                    console.log("inside athlete");
            		catagories[1]++;
                    console.log(catagories[1]);
            	}
            	if((tags[i]==="bored")||(tags[i]==="wear") ||(tags[i]==="isolated")){
            		catagories[2]++;
                    console.log(catagories[2]);
            	}
            	if((tags[i]==="tired")||(tags[i]==="sit")||(tags[i]==="fatigue")){
            		catagories[3]++;
                    console.log(catagories[3]);
            	}
            	if((tags[i]==="depressed")||(tags[i]==="isolated")){
            		catagories[4]++;
                    console.log(catagories[4]);
            	}
            	if((tags[i]==="success")||(tags[i]==="freedom")){
            		catagories[5]++;
                    console.log(catagories[5]);
            	}
            	if((tags[i]==="business")||(tags[i]==="office")||(tags[i]==="laptop")||(tags[i]==="meeting")){
            		catagories[6]++;
                    console.log(catagories[6]);
            	}
            	if((tags[i]==="health")||(tags[i]==="healthy")||(tags[i]==="athlete")||
            		(tags[i]==="nutrition")||(tags[i]==="vegetable")){
            		catagories[7]++;
                    console.log(catagories[7]);
            	}

            //var m = row.Tags.search("success");
            }


        })
    var cur_max = 0;
    for (var j=0; j<catagories.length;j++){
        //console.log(count);
        if (catagories[j] > cur_max) {
            cur_max = catagories[j];
            class_idx = j;
        }                   
    }
    console.log("yo the idx is");
    console.log(class_idx);
    console.log(catagories);
    return class_idx;
}
    /*
            console.log("found happy= "+n);
            if (n!= -1 ){
                $("#database_msg").append
                    ("our analysis shows the world will look at you as a happy person");
                n=-1;
            }
    */
           
        
     


