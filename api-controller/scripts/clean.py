import os, shutil
import pymongo

#Remove Files
folders = ['data/user_a', 'output/user_a/docx','output/user_a/pdf', 'template/user_a']
for folder in folders:
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))



#Remove Local Mongo COllections
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")

db = mongo_client["docassist"]
collections = ['templates', 'generated', 'clients' , 'counters']
for collection in collections:
    db[collection].drop()

print("Success in Cleaning, You can now push ")
