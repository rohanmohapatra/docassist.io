from app import mongo, app

def fetch_all_mappings():
	result = mongo.db.mapping.find()
	return list(result)

def fetch_mapping_by_id(mapping_id):
	result = mongo.db.mapping.find_one(
		{"_id": mapping_id}
	)
	return result