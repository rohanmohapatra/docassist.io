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
    var localization = request.body.localization;
    if(localization){
    	var currency_format = localization.currency_format; //example: INR, USD, JPY, EUR, GBP
    	var date_format = localization.date_format; //example: MM/DD/YYYY, DD/MM/YYYY
    	var country_locale = localization.country_locale; //example: en-In, en-US, ja-JP, de-DE
    }
    if (!currency_format){
    	currency_format = "USD";
    }
    if (!date_format) {
    	date_format = null;
    }
    if (!country_locale) {
    	country_locale = "en-US";
    }
    console.log(currency_format);
    console.log(date_format);
    console.log(country_locale);

    dataaccess.get_client_by_id(client_id)
    .then(function(client_data){
    	var mapping_id = client_data["mapping_id"];
    	if (mapping_id==undefined){
    		mapping_id = "mapping_1";
    	}
    	dataaccess.get_mapping_by_id(mapping_id).then(function(mapping_dict) {
    		console.log(mapping_dict);
			dataaccess.map_client_data_to_template(client_data, template_name, mapping_dict).then(function(mapped_client_data){
				localized_client_data = dataaccess.apply_localization(mapped_client_data, currency_format, date_format, country_locale);
		        console.log(localized_client_data);
		        
                var insertedId = ";"
		        fs.writeFileSync(temp_json, JSON.stringify(localized_client_data));
		        dataaccess.add_generated_document("", client_id).then(function(id){
                    console.log("Added to Collection: "+id);
                    insertedId = id;
                    exec('python3 ../scripts/docgen.py ../scripts/template/user_a/'+template_name+ ' ../scripts/temp.json', function(err, stdout){
                        //console.log(err);
                        //console.log(stdout);
                        //console.log(stdout.split("\n"));
                        var output = stdout.split("\n");
                        console.log(insertedId);
                        var documentName = output[output.length -2].split(":")[1];
                        console.log("documentName: "+documentName);
                        dataaccess.update_document_status(insertedId, documentName.trim()).then(function(){
                            console.log("Status Changed");
                        })
                        /*dataaccess.add_generated_document(documentName.trim(), client_id).then(function(){
                            console.log("Added to Collection")
                        });*/
                        console.log("Completed");
                    })
                });
				
		        return response.status(200).send();
			})
	        
		        
    	})
    })

});


//start server

app.listen(5002, () => {
    console.log('MicroService listening on port 5002');
});
