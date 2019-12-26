// grab the packages we need
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
const { exec } = require('child_process');

var app = express();

var dataaccess = require('./dataaccess.js');

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var temp_json = "../scripts/temp.json"

// routes will go here
app.post('/api/generate/', function(request, response) {
    var template_name = request.body.template_name;
    var client_id = request.body.client_id;
    //var currency = request.body.currency;
    //var date_format = request.body.date_format;
    
    dataaccess.get_client_by_id(client_id)
    .then(function(client_data){
        //console.log(item);
        //response.send(item);
        fs.writeFileSync(temp_json, JSON.stringify(client_data));
        exec('python3 ../scripts/docgen.py ../scripts/template/user_a/'+template_name+ ' ../scripts/temp.json', function(err, stdout){
            //console.log(err);
            //console.log(stdout);
            //console.log(stdout.split("\n"));
            var output = stdout.split("\n")
            var documentName = output[output.length -2].split(":")[1];
            dataaccess.add_generated_document(documentName.trim(), client_id).then(function(){
                console.log("Added to Collection")
            });
            console.log("Completed");
        })

        
        return response.status(200).send();
    })
    
});


//start server

app.listen(5002, () => {
    console.log('MicroService listening on port 5002');
});