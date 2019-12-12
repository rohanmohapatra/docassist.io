from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os

app = Flask(__name__)
cors = CORS(app, resources={r'/api/*': {"origins": 'http://localhost:5000'}})

#Global Variables
UPLOAD_FOLDER = os.getcwd() + '/template/user_a'
DATA_UPLOAD_FOLDER = os.getcwd() + '/data/user_a'

app.config["MONGO_URI"] = "mongodb://localhost:27017/docassist_io"
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DATA_UPLOAD_FOLDER'] = DATA_UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
mongo = PyMongo(app)