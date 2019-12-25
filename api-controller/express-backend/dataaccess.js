var MongoClient = require('mongodb').MongoClient;

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
            return collection.insertOne({document_name: document_name, client_id:client_id});
        }).then(function(){
        })
    }
  };
  
  