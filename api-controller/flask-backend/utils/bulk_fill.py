from dataccess.templates_getfunctions import get_template_by_id, get_jinja_fields_by_id
from dataccess.data_getfunctions import get_client_by_id
from dataccess.data_setfunctions import add_document_generated
from dataccess.mapping_getfunctions import fetch_mapping_by_id
from utils.aes import decrypt

import json
import subprocess

def bulk_fill(secret_key, templates, clients):
    for template_id in templates:
        template = get_template_by_id(template_id)
        template_location = decrypt(secret_key, template['location']).decode()

        for client_id in clients:
            client_data = get_client_by_id(client_id)
            mapping_id = client_data["mapping_id"]
            mapping_dict = fetch_mapping_by_id(mapping_id)
            mapped_client_data = map_client_data_to_template(client_data, template_id, mapping_dict)
            
            try:
                temp_client_data_file = open('../scripts/temp.json', 'w', encoding='utf-8')
            except Exception as e:
                print(e)
                return Response(status=409)
            else:
                with temp_client_data_file as f:
                    json.dump(mapped_client_data, f, ensure_ascii=False)
                print(type(template_location))
                template_location = template_location.replace('\\','/')
                print(template_location)
                result = subprocess.run(['python3', '../scripts/docgen.py', template_location, '../scripts/temp.json'], encoding='utf-8', stdout=subprocess.PIPE)
                print("result")                
                result = result.stdout.split("\n")
                print(result)
                document_name = result[-2].split(":")[1].strip()
                print(document_name)
                add_document_generated(document_name, client_id)
                
def map_client_data_to_template(client_data, template_id, mapping_dict):
    jinja_fields = get_jinja_fields_by_id(template_id)
    print("In map of bulk_fill")
    print(jinja_fields)
    print(mapping_dict)
    new_client_data = {}

    for template_field in jinja_fields:
        if template_field in mapping_dict:
            client_field = mapping_dict[template_field]
            if client_field in client_data:
                new_client_data[template_field] = client_data[client_field]
            else:
                print(template_field+":"+client_field+" --client field not found in client data, skipping")
        else:
            print(template_field+" --template field not found in mapping dict, skipping")

    print(new_client_data)
    return new_client_data