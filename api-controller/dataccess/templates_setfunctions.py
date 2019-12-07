from app import mongo, app
from dataccess.utilities import generate_id
from utils.aes import encrypt,decrypt
def add_template_to_db(filename, location, username = 'user_a'):
    templates_collection = mongo.db.templates
    location_encrypted = encrypt(app.secret_key, location)
    #query_result = templates_collection.find_one({"location": location_encrypted})
    templates_collection.insert_one({"_id": "template_"+str(generate_id('templates')), "username": username, "filename":filename,"location": location_encrypted})
    