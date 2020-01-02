from app import mongo, app

def get_all_clients():
	result = list(mongo.db.clients.find())
	return result

def get_client_by_id(id):
	result = mongo.db.clients.find_one(
		{"_id":id}
	)
	return result

def get_all_docs():
	result = mongo.db.generated.find()
	return list(result)

def get_client_email_by_doc_name(doc_name):
	email_field = "jmf_client_email"

	client_id = mongo.db.generated.find_one(
		{"document_name":doc_name},
		projection = {"client_id":True}
	)["client_id"]
	
	client_data = mongo.db.clients.find_one(
		{"_id": client_id}
	)
	mapping_id = client_data["mapping_id"]
	mapping_dict = mongo.db.mapping.find_one(
		{"_id":mapping_id}
	)
	if "jmf_client_email" in mapping_dict:
		email_field = mapping_dict["jmf_client_email"]

	if (email_field in client_data):
		return client_data[email_field]
	else:
		return None