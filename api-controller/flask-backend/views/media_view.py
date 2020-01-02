from flask import Blueprint, Response, jsonify, request, send_from_directory
#from dataaccess.get_functions import *
from dataccess.data_setfunctions import add_client_data
from dataccess.data_getfunctions import get_all_clients, get_client_by_id
from dataccess.media_getfunctions import get_generated_document_by_filename, get_generated_document_by_id, get_generated_document_status
from flask_cors import CORS, cross_origin
import json
import time
import datetime
import os
from flask import current_app as app
from flask_cors import CORS, cross_origin
import subprocess

from utils.bulk_fill import bulk_fill
from utils.utils import allowed_file_extensions
from werkzeug.utils import secure_filename
import mammoth

from html2docx import html2docx

media_view = Blueprint('media_view', __name__)

@media_view.route("/download/<name>/", methods=['GET'])
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

@media_view.route('/<generated_id>/edit/',methods=['GET'])
@cross_origin()
def edit_generated_doc(generated_id):
    location = "../scripts/output/user_a/docx/"
    result = get_generated_document_by_id(generated_id)
    print(result)
    with open(location+result["document_name"]+'.docx', "rb") as docx_file:
        result = mammoth.convert_to_html(docx_file)
        html = result.value # The generated HTML
        #print(html)
        return html




@media_view.route('/<generated_id>/save/',methods=['POST'])
@cross_origin()
def save_generated_doc(generated_id):
    location = "../scripts/output/user_a/docx/"
    json_data = request.get_json(force=True)
    #print(json_data)
    html = json_data["html"]
    buf = html2docx(html, title="Edited Document")
    result = get_generated_document_by_id(generated_id)
    #print(location)
    with open(location+result["document_name"]+".docx", "wb") as fp:
        fp.write(buf.getvalue())
    return Response(status=200)

@media_view.route('/<generated_id>/status/')
@cross_origin()
def stream(generated_id):
    #result = get_generated_document_by_id(generated_id)
    def eventStream():
        while True:
            # wait for source data to be available, then push it
            yield 'data: {}\n\n'.format(get_generated_document_status(generated_id))
    return Response(eventStream(), mimetype="text/event-stream")


@media_view.route("/download_template/<template_name>/", methods=['GET'])
@cross_origin()
def template_download(template_name):
    print(template_name)
    folder = app.config['UPLOAD_FOLDER']
    location = os.path.join(folder, template_name)
    return send_from_directory(folder, template_name)


