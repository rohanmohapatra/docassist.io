from flask import Blueprint,Response, jsonify, request
#from dataaccess.get_functions import *
from flask_cors import CORS, cross_origin
import json
import time
import datetime
import os
from flask import current_app as app
from dataccess.templates_setfunctions import add_template_to_db, set_jinja_fields
from dataccess.templates_getfunctions import get_templates_for_user, get_template_by_id, get_jinja_fields_by_id
from flask_cors import CORS, cross_origin
from utils.aes import encrypt,decrypt

from utils.utils import allowed_file_extensions
from werkzeug.utils import secure_filename

import mammoth
from html2docx import html2docx

templates_view = Blueprint('templates_view',__name__)

@templates_view.route("/", methods=['GET'])
def health_check():
    print("Working")
    return Response(status=200)

@templates_view.route("/create/", methods=['POST'])
@cross_origin()
def create_template():
    json_data = request.get_json(force=True)
    #print(json_data)
    html = json_data["html"]
    filename = json_data['filename']
    buf = html2docx(html, title="New Template")

    #print(location)
    with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), "wb") as fp:
        fp.write(buf.getvalue())
        template_id = add_template_to_db(filename,os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Now add the jinja-fields in the template to the template document in MongoDB
        template_location = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        modified_count = set_jinja_fields(template_location, template_id)

        if(modified_count):
            print("Added jinja-fields for",str(modified_count),"template")
            return Response(status=200)
        else:
            print("Failed to add jinja fields to mongo.db.template")
            return Response(status=409)
    return Response(status=200)


@templates_view.route("/upload/",methods=['POST'])
@cross_origin()
def upload_template():
    ALLOWED_EXTENSIONS = set(['docx'])
    if request.method == 'POST':
        #print(request.files.to_dict(flat=False))
        
        #Check if my inout has those fields
        if 'template' not in request.files:
            return Response(status=400)
        
        template = request.files['template']

        if template.filename == '':
            return Response(status=400)

        #If allowed extensions save the Docx
        if template and allowed_file_extensions(template.filename, ALLOWED_EXTENSIONS):
            template_filename = secure_filename(template.filename)
            try:
                template_id = add_template_to_db(template_filename,str(os.path.join(app.config['UPLOAD_FOLDER'], template_filename)))
                template.save(os.path.join(app.config['UPLOAD_FOLDER'], template_filename))
            except Exception as e:
                print("Error:",e)
                print("Something went wrong")
                return Response(status=409)
            else:

                # Now add the jinja-fields in the template to the template document in MongoDB
                template_location = os.path.join(app.config['UPLOAD_FOLDER'], template_filename)
                modified_count = set_jinja_fields(template_location, template_id)

                if(modified_count):
                    print("Added jinja-fields for",str(modified_count),"template")
                    return Response(status=200)
                else:
                    print("Failed to add jinja fields to mongo.db.template")
                    return Response(status=409)                  

        else:
            return Response('["file types not supported"]', status=400)

        #Make a call to the string processing module
        return Response(status=200)
    else:
        Response(status=405)


@templates_view.route("/view_list/",methods=['GET'])
@cross_origin()
def view_templates():
    result = get_templates_for_user()
    for i in result:
        i["location"] = str(i["location"])
    return jsonify(result) 

@templates_view.route('/<template_id>/edit/',methods=['GET'])
@cross_origin()
def edit_templates(template_id):
    result = get_template_by_id(template_id)
    location = decrypt(app.secret_key, result["location"])
    print(location)
    with open(location, "rb") as docx_file:
        result = mammoth.convert_to_html(docx_file)
        html = result.value # The generated HTML
        #print(html)
        return html


@templates_view.route('/<template_id>/save/',methods=['POST'])
@cross_origin()
def save_templates(template_id):
    json_data = request.get_json(force=True)
    #print(json_data)
    html = json_data["html"]
    buf = html2docx(html, title="Edited Template")
    result = get_template_by_id(template_id)
    location = decrypt(app.secret_key, result["location"])
    #print(location)
    with open(location, "wb") as fp:
        fp.write(buf.getvalue())
        add_template_to_db(result["filename"],location)
        template_filename = result["filename"];
        # Now add the jinja-fields in the template to the template document in MongoDB
        template_location = os.path.join(app.config['UPLOAD_FOLDER'], template_filename)
        modified_count = set_jinja_fields(template_location, template_id)

        if(modified_count):
            print("Added jinja-fields for",str(modified_count),"template")
            return Response(status=200)
        else:
            print("Failed to add jinja fields to mongo.db.template")
            return Response(status=409)
    return Response(status=200)


@templates_view.route('/<template_id>/jinja_fields/',methods=['GET'])
@cross_origin()
def get_required_jinja_fields(template_id):
    jinja_fields = get_jinja_fields_by_id(template_id)
    return jsonify(jinja_fields)