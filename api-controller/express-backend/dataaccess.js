var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

module.exports = {
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
            return collection.insertOne({document_name: document_name, client_id:client_id, time_created: parseInt(new Date().getTime() / 1000)});
        }).then(function(){
        })
    },
    apply_date_localization: function(client_data, country_locale, date_format="DD-MM-YYYY") {
    	var allowed_date_formats = ["MM-DD-YYYY", "MM/DD/YYYY", "M-DD-YYYY", "M/DD/YYYY", "MM-D-YYYY", "MM/D/YYYY","M-D-YYYY", "M/D/YYYY",
    	"DD-MM-YYYY","DD/MM/YYYY", "D-MM-YYYY", "D/MM/YYYY", "DD-M-YYYY", "DD/M/YYYY", "D-M-YYYY", "D/M/YYYY",
    	"DD-MM", "DD/MM"]
    	var formatter = new Intl.DateTimeFormat("en-IN");
    	console.log("apply_date_localization");
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
    apply_localization: function(client_data, currency_format="USD", date_format="DD/MM/YYYY", country_locale="en-US") {
    	console.log("Applying localization");
    	client_data = this.apply_currency_localization(client_data, currency_format, country_locale);
		client_data = this.apply_date_localization(client_data, country_locale, date_format);
		return client_data;
    }
  };
  
  