from app import mongo, app
from dataccess.utilities import generate_id
from utils.aes import encrypt, decrypt
from pymongo import ReturnDocument


def add_template_to_db(filename, location, username='user_a'):
    templates_collection = mongo.db.templates
    location_encrypted = encrypt(app.secret_key, location)
    query_result = templates_collection.find_one({"filename": filename})
    if query_result == None:
        templates_collection.insert_one({"_id": "template_"+str(generate_id('templates')), "username": username,
                                         "filename": filename, "location": location_encrypted, "version": int(1)})
    else:
        templates_collection.find_one_and_update(
            filter={"filename": filename},
            update={"$inc": {"version": 1}},
            projection={"version": True, "_id": False},
            upsert=False,
            return_document=ReturnDocument.AFTER,
        )["version"]
