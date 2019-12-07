from app import mongo, app

from utils.aes import encrypt,decrypt


def get_templates_for_user(username='user_a'):
    templates_collection = mongo.db.templates
    result = templates_collection.find({"username":username})
    return list(result)
    