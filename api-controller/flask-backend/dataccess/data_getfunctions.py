from app import mongo, app

def get_all_clients():
	result = list(mongo.db.clients.find(
		projection={'_id': True, 'jmf_client_name':True}))
	return result

def get_client_by_id(id):
	result = mongo.db.clients.find_one(
		{"_id":id}
	)
	return result

def get_all_docs():
	result = mongo.db.generated.find()
	return list(result)