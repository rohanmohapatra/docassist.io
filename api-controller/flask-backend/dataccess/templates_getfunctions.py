from app import mongo, app

from utils.aes import encrypt,decrypt


def get_templates_for_user(username='user_a'):
    templates_collection = mongo.db.templates
    result = templates_collection.find({"username":username})
    return list(result)

def get_template_by_id(template_id):
    templates_collection = mongo.db.templates
    result = templates_collection.find_one({"_id":template_id})
    return result

def get_jinja_fields_by_id(template_id, username="user_a"):
    default_fields = ["page_break"]

    result = mongo.db.templates.find_one(
        {"_id": template_id},
        projection = {"jinja_fields":True, "sub_templates":True}
    )

    jinja_fields = result["jinja_fields"]
    sub_templates = result["sub_templates"]

    for sub_template_name in sub_templates:
        sub_template_jinja_fields = mongo.db.templates.find_one(
            {"filename":sub_template_name},
            projection = {"jinja_fields":True}
        )["jinja_fields"]
        print(sub_template_name)
        print(sub_template_jinja_fields)
        difference = list(set(sub_template_jinja_fields) - set(jinja_fields))
        jinja_fields.extend(difference)
    print(jinja_fields)

    # remove stuff like page_break etc
    for field in jinja_fields:
        if field in default_fields:
            jinja_fields.remove(field)
    return jinja_fields