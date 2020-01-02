from app import mongo, app
from dataccess.utilities import generate_id

def add_mapping_data(mapping_dict):
	id_dict = {"_id":'mapping_'+str(generate_id('mapping'))}
	mapping_dict.update(id_dict)
	result = mongo.db.mapping.insert_one(mapping_dict)
	return (result.inserted_id)

def update_mapping(mapping_id, update_dict):
	result = mongo.db.mapping.update_one(
		{"_id":mapping_id},
		{"$set": update_dict}
	)
	return result.modified_count