from flask import Blueprint, Response, jsonify, request, send_from_directory
#from dataaccess.get_functions import *
from flask_cors import CORS, cross_origin
import json
import time
import datetime
import os
from flask import current_app as app
from flask_cors import CORS, cross_origin
import subprocess


from utils.utils import allowed_file_extensions
from werkzeug.utils import secure_filename

data_view = Blueprint('data_view', __name__)


@data_view.route("/upload", methods=['POST'])
@cross_origin()
def upload_data():
    ALLOWED_EXTENSIONS = set(['json'])
    if request.method == 'POST':
        # print(request.files.to_dict(flat=False))

        templateName = request.args.get('tempn')
        print(templateName)

        # Check if my inout has those fields
        if 'data' not in request.files:
            print('data not in request')
            return Response(status=400)

        data = request.files['data']

        if data.filename == '':
            return Response(status=400)

        # If allowed extensions save the data json
        if data and allowed_file_extensions(data.filename, ALLOWED_EXTENSIONS):
            data_filename = secure_filename(data.filename)

            data_filename = data_filename.split(
                '.')[0] + str(int(time.time()))[-6:] + '.json'

            print(data_filename)

            try:
                # add_data_to_db(data,str(os.path.join(app.config['DATA_UPLOAD_FOLDER'], data_filename)))
                data.save(os.path.join(
                    app.config['DATA_UPLOAD_FOLDER'], data_filename))

                subprocess.run(['python3', 'docgen.py', './template/user_a/' +
                                templateName, './data/user_a/'+data_filename])

            except Exception as e:
                print(e)
                return Response(status=409)

        else:
            return Response('["file types not supported"]', status=400)

        # Make a call to the string processing module
        return Response(status=200)
    else:
        Response(status=405)


@data_view.route("/docs", methods=['GET'])
@cross_origin()
def completedDocs():
    path = './output/user_a/docx'
    with os.scandir(path) as ls:
        docxFiles = [{"filename": entry.name, "createdTime": entry.stat().st_ctime_ns}
                     for entry in ls if entry.is_file()]
    print(docxFiles)
    return jsonify(docxFiles)


@data_view.route("/download/<name>", methods=['GET'])
@cross_origin()
def downloadDocs(name):
    path = './output/user_a/'

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
