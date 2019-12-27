from app import mongo, app
from bson.objectid import ObjectId
def get_generated_document_by_filename(filename):
    result = mongo.db.generated.find_one({"document_name" : filename})
    return result

def get_generated_document_by_id(id):
    print(id)
    result = mongo.db.generated.find_one({"_id" : ObjectId(id)})
    return result