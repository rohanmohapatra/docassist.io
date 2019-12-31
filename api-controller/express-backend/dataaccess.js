var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var mongo = require('mongodb');

module.exports = {
	db:null,
    get_client_by_id: function(id) {
      console.log(id);
      return MongoClient.connect('mongodb://localhost:27017/docassist').then(function(db) {
        let database  = db.db('docassist');
        //console.log(database.collection('clients').find());
        var collection = database.collection('clients');
        return collection.findOne({"_id":id});
      }).then(function(item) {
        return item;
      });
    },
    get_template_by_name: function(name) {
        return MongoClient.connect('mongodb://localhost:27017/docassist').then(function(db){
            let collection = db.db('docassist').collection('templates');
            return collection.findOne({"filename":name});
        }).then(function(item){
            return item;
        })
    },
    add_generated_document: function(document_name, client_id) {
        return MongoClient.connect('mongodb://localhost:27017/docassist').then(function(db){
            let collection = db.db('docassist').collection('generated');
            return collection.insertOne({document_name: document_name, client_id:client_id, time_created: parseInt(new Date().getTime() / 1000), status: "generating"});
        }).then(function(response){
          return response.insertedId;
        })
    },
    get_jinja_fields_by_template_name: function(name) {
        return MongoClient.connect('mongodb://localhost:27017/docassist').then(function(db){
            let collection = db.db('docassist').collection('templates');
            this.db = db;
		    return collection.findOne(
		        {"filename": name},
		        {projection: {"jinja_fields":1, "sub_templates":1}}
		    );
		}).then(async function(r){
				let collection = this.db.db('docassist').collection('templates');
		    	let jinja_fields = r["jinja_fields"];
		    	var sub_templates = r["sub_templates"];
		    	let counter=0;

		    	var extend_jinja_fields = async function() {
		    		if (counter>=sub_templates.length){
		    			console.log("	Finished getting jinja-fields of subtemplates");
		    			return "done";
		    		}
		    		
		    		sub_template = sub_templates[counter];
		    		find_result = await collection.findOne(
			            {"filename":sub_template},
			            {projection : {"jinja_fields":1}}
			        ).then(function(r){
			        	sub_template_jinja_fields = r["jinja_fields"];
			        	let difference = sub_template_jinja_fields.filter(x => !jinja_fields.includes(x));
			        	jinja_fields = jinja_fields.concat(difference);
			        	counter++;
			        }).then(function(){
			        	extend_jinja_fields(counter);
			        })
			        
		    	}

		    	await extend_jinja_fields(0);

		    	// remove default fields such as page_break etc.
		    	var default_fields = ["page_break"];
		    	for (index in jinja_fields){
		    		var field = jinja_fields[index];
			        if (default_fields.indexOf(field)>-1) {
			            jinja_fields.splice(index, 1);
			        }
			    }
			    console.log("	In get_jinja_fields_by_template_name: "+jinja_fields);
		    	return jinja_fields;
		    });
    },
    get_mapping_by_id: function(mapping_id) {
    	return MongoClient.connect('mongodb://localhost:27017/docassist').then(function(db) {
	        let database  = db.db('docassist');
	        var collection = database.collection('mapping');
	        return collection.findOne({"_id":mapping_id});
	      }).then(function(item) {
	        return item;
	      });
    },
    map_client_data_to_template: function(client_data, template_name, mapping_dict) {
    	return this.get_jinja_fields_by_template_name(template_name).then(function(jinja_fields) {
    		var new_client_data = {};
    		
    		console.log("\n		mapping_dict:");
    		console.log(mapping_dict);
    		console.log("\n		Old client data:");
    		console.log(client_data);
    		
    		console.log(jinja_fields);
    		jinja_fields.forEach(function(template_field) {
    			console.log("-----"+template_field+"---------"+mapping_dict[template_field]);
    			if(template_field in mapping_dict){
    				var client_field = mapping_dict[template_field];
    				if (client_field in client_data) {
		    			new_client_data[template_field] = client_data[client_field];
    				}
    				else {
    					console.log(template_field+":"+client_field+" --client field not found in client data, skipping");
    				}
	    		}
	    		else{
	    			console.log(template_field+" --template field not found in mapping dict, skipping");
	    		}
    		});
    		
    		console.log("\n 	Mapped client_data:");
    		console.log(new_client_data);
    		
    		return new_client_data;
    	})
    },
    apply_date_localization: function(client_data, country_locale, date_format=null) {
    	var allowed_date_formats = ["MM-DD-YYYY", "MM/DD/YYYY", "M-DD-YYYY", "M/DD/YYYY", "MM-D-YYYY", "MM/D/YYYY","M-D-YYYY", "M/D/YYYY",
    	"DD-MM-YYYY","DD/MM/YYYY", "D-MM-YYYY", "D/MM/YYYY", "DD-M-YYYY", "DD/M/YYYY", "D-M-YYYY", "D/M/YYYY",
    	"DD-MM", "DD/MM"]
    	var formatter = new Intl.DateTimeFormat(country_locale);
    	console.log("apply_date_localization");

    	if(!date_format){
	    	Object.keys(client_data).forEach(function(key) {
			    if(key.slice(-5)==="_date"){
			    	console.log(key);
			    	console.log(client_data[key])
			    	date_ob = moment(client_data[key], allowed_date_formats);
			    	if(date_ob._isValid){
				    	client_data[key] = formatter.format(date_ob._d);
				    	console.log(client_data[key]);
				    }
			    }
			});
    	}
    	else {
    		Object.keys(client_data).forEach(function(key) {
			    if(key.slice(-5)==="_date"){
			    	console.log(key);
			    	console.log(client_data[key])
			    	date_ob = moment(client_data[key], allowed_date_formats);
			    	if(date_ob._isValid){
				    	client_data[key] = date_ob.format(date_format);
				    	console.log(client_data[key]);
				    }
			    }
			});
    	}
		return client_data;
    },
    apply_currency_localization: function(client_data, currency_format, country_locale) {
    	var formatter = new Intl.NumberFormat(country_locale, {
		  style: 'currency',
		  currency: currency_format,
		});
    	console.log("apply_currency_localization");
    	Object.keys(client_data).forEach(function(key) {
		    if(key.slice(-5)==="_curr"){
		    	//console.log(key);
		    	console.log(formatter.format(client_data[key]));
		    	client_data[key] = formatter.format(client_data[key]);
		    }
		});
		return client_data;
    },
    apply_localization: function(client_data, currency_format="USD", date_format=null, country_locale="en-US") {
    	console.log("Applying localization");
    	client_data = this.apply_currency_localization(client_data, currency_format, country_locale);
		client_data = this.apply_date_localization(client_data, country_locale, date_format);
		return client_data;
    },
    update_document_status: function(id, document_name) {
      return MongoClient.connect('mongodb://localhost:27017/docassist').then(function(db){
        var o_id = new mongo.ObjectID(id);
        console.log(o_id);
        let collection = db.db('docassist').collection('generated');
        return collection.updateOne({_id: o_id}, {$set : {document_name: document_name, status : "done"}});
    }).then(function(){
    })
    }
  };
  
  
