from app import mongo, app
from dataccess.utilities import generate_id
from utils.aes import encrypt, decrypt
from utils.utils import get_all_jinja_fields
from pymongo import ReturnDocument


def add_template_to_db(filename, location, username='user_a'):
    templates_collection = mongo.db.templates
    location_encrypted = encrypt(app.secret_key, location)
    query_result = templates_collection.find_one({"filename": filename})
    if query_result == None:
        result = templates_collection.insert_one({"_id": "template_"+str(generate_id('templates')), "username": username,
                                         "filename": filename, "location": location_encrypted, "version": int(1)})
        template_id = result.inserted_id
    else:
        print("Found existing template of same name")
        template_id = templates_collection.find_one_and_update(
            filter={"filename": filename},
            update={"$inc": {"version": 1}},
            projection={"version": True, "_id": True},
            upsert=False,
            return_document=ReturnDocument.AFTER,
        )["_id"]
    return template_id

def set_jinja_fields(template_location, template_id, username='user_a'):
    print("In set_jinja_fields")
    jinja_fields, sub_templates = get_all_jinja_fields(template_location)
    print(jinja_fields)
    print(sub_templates)
    update_result = mongo.db.templates.update_one(
        {"_id": template_id},
        {"$set":{"jinja_fields": jinja_fields, "sub_templates": sub_templates}}
    )
    return update_result.modified_count