from app import mongo, app
from bson.objectid import ObjectId
import time
def get_generated_document_by_filename(filename):
    result = mongo.db.generated.find_one({"document_name" : filename})
    return result

def get_generated_document_by_id(id):
    print(id)
    result = mongo.db.generated.find_one({"_id" : ObjectId(id)})
    return result

def get_generated_document_status(id):
    time.sleep(1.0)
    result = mongo.db.generated.find_one({"_id" : ObjectId(id)})
    return str(result["status"])+";"+str(result["document_name"])