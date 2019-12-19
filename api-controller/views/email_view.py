from flask import Blueprint,Response, jsonify, request
#from dataaccess.get_functions import *
from flask_cors import CORS, cross_origin
import json
import time
import datetime
import os
from flask import current_app as app
from dataccess.templates_setfunctions import add_template_to_db
from dataccess.templates_getfunctions import get_templates_for_user, get_template_by_id
from flask_cors import CORS, cross_origin
from utils.aes import encrypt,decrypt

from utils.utils import allowed_file_extensions
from werkzeug.utils import secure_filename
import yagmail


email_view = Blueprint('emai_view',__name__)

@email_view.route("/send/<name>", methods=['POST'])
@cross_origin()
def send_email(name):
    json_data = request.get_json(force=True)
    path = './output/user_a/'

    fileFormt = name.split('.')[1]
    print(name.split('.'))

    if(fileFormt == 'pdf'):
        print('sending pdf:', name)
        contents = [json_data['body'], path+'pdf/'+ name]
        yag = yagmail.SMTP("docassist.io")
        yag.send(json_data['email'], json_data['subject'], contents)
        return Response(status=200)
    else:
        print('sending nothing:', name)
        return Response(status=404)