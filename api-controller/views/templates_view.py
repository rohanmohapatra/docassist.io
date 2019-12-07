from flask import Blueprint,Response, jsonify, request
#from dataaccess.get_functions import *
from flask_cors import CORS, cross_origin
import json
import time
import datetime
import os
from flask import current_app as app
from dataccess.templates_setfunctions import add_template_to_db

from utils.utils import allowed_file_extensions
from werkzeug.utils import secure_filename

templates_view = Blueprint('templates_view',__name__)

@templates_view.route("/")
def health_check():
    print("Working")
    return Response(status=200)

@templates_view.route("/upload/",methods=['POST'])
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
            template.save(os.path.join(app.config['UPLOAD_FOLDER'], template_filename))
            add_template_to_db(template_filename,str(os.path.join(app.config['UPLOAD_FOLDER'], template_filename)))

        else:
            return Response('["file types not supported"]', status=400)

        #Make a call to the string processing module
        return Response(status=200)
    else:
        Response(status=405)