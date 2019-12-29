from flask import Blueprint, Response, jsonify, request, send_from_directory
#from dataaccess.get_functions import *
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


@data_view.route("/upload/", methods=['POST'])
@cross_origin()
def upload_data():
    ALLOWED_EXTENSIONS = set(['json'])
    if request.method == 'POST':
        # print(request.files.to_dict(flat=False))
        ''' Backend Revamped

        Upload and Generate Seperated
        Please refer older commits


        templateName = request.args.get('tempn')
        print(templateName)

        client_id = request.args.get('client_id')
        if (client_id):
            print("client_id detected in request, generating based on existing client data")
            client_data = get_client_by_id(client_id)

            try:
                temp_client_data_file = open('temp.json', 'w', encoding='utf-8')
            except Exception as e:
                print(e)
                return Response(status=409)
            else:
                with temp_client_data_file:
                    json.dump(client_data, temp_client_data_file, ensure_ascii=False)
                
                subprocess.run(['python3', 'docgen.py', 'template/user_a/' +
                                    templateName, 'temp.json'])
                print("removing temporary file")
                #os.remove('temp.json')
                return Response(status=200)
                
        else:
            print("No client_id in request, generating based on uploaded data")
        '''

        # Check if my inout has those fields
        if 'data' not in request.files:
            print('data not in request')
            return Response(status=400)

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

                data_dict = json.loads(data_text)
                #print(data_dict)
                inserted_client_id = add_client_data(data_dict)

            except Exception as e:
                print(e)
                return Response(status=409)

            try:
                data.seek(0)
                data.save(os.path.join(
                    app.config['DATA_UPLOAD_FOLDER'], data_filename))

                #subprocess.run(['python3', 'docgen.py', 'template/user_a/' +
                #                templateName, 'data/user_a/'+data_filename])

            except Exception as e:
                print(e)
                return Response(status=409)

        else:
            return Response('["file types not supported"]', status=400)

        # Make a call to the string processing module
        return jsonify({"client_id":inserted_client_id})
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



