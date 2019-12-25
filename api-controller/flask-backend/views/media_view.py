from flask import Blueprint, Response, jsonify, request, send_from_directory
#from dataaccess.get_functions import *
from dataccess.data_setfunctions import add_client_data
from dataccess.data_getfunctions import get_all_clients, get_client_by_id
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

