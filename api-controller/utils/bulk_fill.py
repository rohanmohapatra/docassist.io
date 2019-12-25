from dataccess.templates_getfunctions import get_template_by_id
from dataccess.data_getfunctions import get_client_by_id
from utils.aes import decrypt
import json
import subprocess

def bulk_fill(secret_key, templates, clients):
    for template_id in templates:
        template = get_template_by_id(template_id)
        template_location = decrypt(secret_key, template['location'])

        for client_id in clients:
            client_data = get_client_by_id(client_id)

            try:
                temp_client_data_file = open('temp.json', 'w', encoding='utf-8')
            except Exception as e:
                print(e)
                return Response(status=409)
            else:
                with temp_client_data_file:
                    json.dump(client_data, temp_client_data_file, ensure_ascii=False)
                
                subprocess.run(['python3', 'docgen.py', template_location, 'temp.json'])
                print("removing temporary file")

    