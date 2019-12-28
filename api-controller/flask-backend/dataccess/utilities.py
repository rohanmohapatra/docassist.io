from app import mongo
from pymongo import ReturnDocument

def generate_id(collection):
	"""
		Generates new id for document being inserted
		in given collection
	"""
	try:
		new_id = mongo.db.counters.find_one_and_update(
			filter = {"_id": collection},
			update = {"$inc" : {"seq" : 1}},
			projection = {"seq": True, "_id": False},
			upsert = False,
			return_document = ReturnDocument.AFTER,
		)["seq"]
	except:
		mongo.db.counters.insert_one({
			"_id": collection,
			"seq": int(0)})
		new_id = mongo.db.counters.find_one_and_update(
			filter = {"_id": collection},
			update = {"$inc" : {"seq" : 1}},
			projection = {"seq": True, "_id": False},
			upsert = False,
			return_document = ReturnDocument.AFTER,
		)["seq"]
	
	print("In generate_id:")
	print(new_id)
	return str(int(new_id))