from app import mongo, app
from dataccess.utilities import generate_id
from utils.aes import encrypt, decrypt
from pymongo import ReturnDocument


def add_docgen(dataname, template, username='user_a'):
    docgen_collection = mongo.db.docgen
    