from flask import Blueprint, Response, jsonify, request, send_from_directory
#from dataaccess.get_functions import *
from dataccess.mapping_getfunctions import fetch_mapping_by_id
from dataccess.data_setfunctions import add_client_data
from dataccess.data_getfunctions import get_all_clients, get_client_by_id, get_all_docs
from dataccess.templates_getfunctions import get_jinja_fields_by_id
from flask_cors import CORS, cross_origin
import json
import time
import datetime
import os
from flask import current_app as app
from flask_cors import CORS, cross_origin
import subprocess

from utils.bulk_fill import bulk_fill
from utils.utils import allowed_file_extensions, reshape
from werkzeug.utils import secure_filename

from gensim.models import FastText

data_view = Blueprint('data_view', __name__)


@data_view.route("/upload/<mapping_id>/", methods=['POST'])
@cross_origin()
def upload_data(mapping_id):
    '''
    get a json list of client objects. Also gets mapping_id in the url.
    this mapping_id gets added to all the clients before storing.
    '''
    ALLOWED_EXTENSIONS = set(['json'])
    if request.method == 'POST':

        # Check if my inout has those fields
        if 'data' not in request.files:
            print('data not in request')
            print("Will try to use Json to save")
            json_data = request.get_json(force=True)
            print(json_data)

            # we check if the json_data is a list
            if type(json_data) == dict:
                print("single client as json")
                json_data["mapping_id"] = mapping_id
                inserted_client_id = add_client_data(json_data)
                return jsonify([inserted_client_id])
            elif type(json_data) == list:
                print("multiple client as json")
                inserted_clients = []
                for client_dict in json_data:
                    client_dict["mapping_id"] = mapping_id
                    inserted_client_id = add_client_data(client_dict)
                    inserted_clients.append(inserted_client_id)
                return jsonify(inserted_clients)
            else:
                # if the incoming data is neither list nor dict
                return Response(status=400)

        else:
            data = request.files['data']

            if data.filename == '':
                return Response(status=400)
            inserted_client_id = ''
            # If allowed extensions save the data json
            if data and allowed_file_extensions(data.filename, ALLOWED_EXTENSIONS):
                data_filename = secure_filename(data.filename)

                data_filename = data_filename.split(
                    '.')[0] + str(int(time.time()))[-6:] + '.json'

                print(data_filename)

                # in this block we read the file, convert it to a dict, and save it in mongoDB
                try:
                    data_text = data.read()
                    if (type(data_text)!=str):
                        print("Converting bytes object to string, so that it can be converted to dict")
                        data_text=data_text.decode("utf-8")

                    inserted_clients = []
                    json_data = json.loads(data_text)
                    #print(json_data)

                    if type(json_data)==dict:
                        print('Single client uploaded')
                        json_data["mapping_id"] = mapping_id
                        inserted_client_id = add_client_data(json_data)
                        inserted_clients.append(inserted_client_id)
                    elif type(json_data)==list:
                        print('multiple clients uploaded')
                        for client_dict in json_data:
                            client_dict["mapping_id"] = mapping_id
                            inserted_client_id = add_client_data(client_dict)
                            inserted_clients.append(inserted_client_id)
                    else:
                        # if 
                        return Response(status=400)

                except Exception as e:
                    print(e)
                    return Response(status=409)

                try:
                    data.seek(0)
                    data.save(os.path.join(
                        app.config['DATA_UPLOAD_FOLDER'], data_filename))

                except Exception as e:
                    print(e)
                    return Response(status=409)

            else:
                return Response('["file types not supported"]', status=400)

            return jsonify(inserted_clients)
    else:
        Response(status=405)

@data_view.route("/list_all_clients/", methods=["GET"])
@cross_origin()
def listAllClients():
    try:
        client_list=get_all_clients()
    except Exception as e:
        print(e)
        return Response(status=500)
    return jsonify(client_list)

@data_view.route("/docs/", methods=['GET'])
@cross_origin()
def completedDocs():
    path = os.path.abspath('../scripts/output/user_a/docx')
    with os.scandir(path) as ls:
        docxFiles = [{
            "filename": entry.name,
            "createdTime": entry.stat().st_ctime_ns,
            "docLink": "http://localhost:5000/api/data/download/"+entry.name,
            "pdfLink": "http://localhost:5000/api/data/download/"+(entry.name.split('.')[0] + '.pdf')
        }
            for entry in ls if entry.is_file()]
    print(docxFiles)
    return jsonify(docxFiles)

@data_view.route("/generated_docs_list/", methods=['GET'])
@cross_origin()
def generated_docs():
    result = get_all_docs()
    docxFiles = [{
            "id" : str(entry["_id"]),
            "filename": entry["document_name"],
            "createdTime": entry["time_created"],
            "docLink": "http://localhost:5000/api/data/download/"+entry["document_name"]+'.docx',
            "pdfLink": "http://localhost:5000/api/data/download/"+entry["document_name"]+'.pdf'
        }
            for entry in result]
    return jsonify(docxFiles)


@data_view.route("/download/<name>/", methods=['GET'])
@cross_origin()
def downloadDocs(name):
    path = '../scripts/output/user_a/'

    fileFormt = name.split('.')[1]
    print(name.split('.'))

    if(fileFormt == 'docx'):
        print('sending docx:', name)
        return send_from_directory(path+'docx', name)
    elif(fileFormt == 'pdf'):
        print('sending pdf:', name)
        return send_from_directory(path+'pdf', name)
    else:
        print('sending nothing:', name)
        return Response(status=404)

@data_view.route("/bulk/", methods=['POST'])
@cross_origin()
def bulk_filling():
    json_data = request.get_json(force=True)
    clients = json_data["clients"]
    templates = json_data["templates"]
    try:
        bulk_fill(app.secret_key, templates, clients)
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)
    
@data_view.route("/check_template_schema_compatibility/<template_id>/<client_id>/", methods=["GET"])
@cross_origin()
def check_template_schema_compatibility(template_id, client_id):
    '''
    gets jinja fields of template
    gets mapping of client
    checks if jinja fields of template are there in mapping
    returns a dict of missing template fields with AI suggestion of corresponding client_field
    '''
    template_jinja_fields = get_jinja_fields_by_id(template_id)
    client_data = get_client_by_id(client_id)
    mapping_id = client_data["mapping_id"]
    mapping_dict = fetch_mapping_by_id(mapping_id)
    #remove mapping_id during gensim
    missing_fields = {}

    for jinja_field in template_jinja_fields:
        if not(jinja_field in mapping_dict):
            # make the value equal to gensim suggestion
            missing_fields[jinja_field] = ""

    return jsonify(missing_fields)


@data_view.route("/mapping/autopopulate/",  methods=["POST"])
@cross_origin()
def autopopulate():
    json_data = request.get_json(force=True)
    template_id = json_data["template_id"]
    client_id = json_data["client_id"]

    template_jinja_fields = get_jinja_fields_by_id(template_id)
    client_data = get_client_by_id(client_id)

    template_jinja_fields_reshaped = reshape(template_jinja_fields,(-1,1))
    
    #Mapping Dictionary
    mapping = dict()

    #build the fasttext Model 
    model = FastText(template_jinja_fields_reshaped,size=30, window=5, min_count=1, iter=20)

    #Check if the tag gives value of 1, else get the most similar word
    for client_info in list(client_data.keys())[1:]:
        print("Client Data: ",client_info)
        if(client_info in template_jinja_fields):
            print("Client_Data_Matched in Jinja")
            mapping[client_info.strip()] = client_info
        else:
            matched_template_field = model.wv.most_similar(client_info)[0][0]
            print("Intelligence used, Template Matched: ",model.wv.most_similar(client_info)[0])
            mapping[matched_template_field.strip()] = client_info
        print("----------------")
    print(mapping)
    #print(client_data.keys())
    return jsonify(mapping)   



