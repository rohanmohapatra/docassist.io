from app import mongo, app
from dataccess.utilities import generate_id
from utils.aes import encrypt, decrypt
from pymongo import ReturnDocument
import time


def add_docgen(dataname, template, username='user_a'):
    docgen_collection = mongo.db.docgen

def add_client_data(client_data):
    id_dict = {"_id":'client_'+str(generate_id('clients'))}
    client_data.update(id_dict)
    result = mongo.db.clients.insert_one(client_data)
    return (result.inserted_id)

def add_document_generated(document_name, client_id):
    collection = mongo.db.generated
    collection.insert_one({"document_name" : document_name, "client_id": client_id, "time_created":time.time(),"status":"done"})
    print("Added")
