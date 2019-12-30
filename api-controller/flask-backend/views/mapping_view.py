from flask import Blueprint, Response, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
import json
import os
from flask import current_app as app
from flask_cors import CORS, cross_origin

from dataccess.mapping_getfunctions import fetch_all_mappings, fetch_mapping_by_id
from dataccess.mapping_setfunctions import add_mapping_data, update_mapping

from utils.utils import allowed_file_extensions
from werkzeug.utils import secure_filename

mapping_view = Blueprint('mapping_view', __name__)

@mapping_view.route("/upload/", methods=['POST'])
@cross_origin()
def upload_mapping():
	if request.method == 'POST':
		ALLOWED_EXTENSIONS = set(['json','xml'])
		inserted_mapping_id = ''
		mapping_dict = {}

		if 'mapping' in request.files:
			print('mapping file in request')
			return Response(status=400)

			mapping = request.files['mapping']

			if mapping.filename == '':
				return Response(status=400)

			# If allowed extensions save the data json
			if mapping and allowed_file_extensions(mapping.filename, ALLOWED_EXTENSIONS):
				mapping_filename = secure_filename(mapping.filename)

				mapping_filename = mapping_filename.split(
					'.')[0] + str(int(time.time()))[-6:] + '.json'

				print(mapping_filename)

				# in this block we read the file, convert it to a dict, and save it in mongoDB
				try:
					mapping_text = mapping.read()
					if (type(mapping_text)!=str):
						print("Converting bytes object to string, so that it can be converted to dict")
						mapping_text=mapping_text.decode("utf-8")

					mapping_dict = json.loads(mapping_text)
				except Exception as e:
					print(e)
					return Response(status=409)
			else:
				return Response('["file types not supported"]', status=400)
		elif request.data:
			mapping_dict = request.get_json(force=True)
		else:
			print("Neither file nor json data in request")
			return Response(status=400)

		# if the execution reaches here, mapping_dict has been set
		inserted_mapping_id = add_mapping_data(mapping_dict)

		return jsonify({"mapping_id":inserted_mapping_id})

@mapping_view.route("/update/<mapping_id>/", methods=['POST'])
@cross_origin()
def update_mapping_with_mapping_id(mapping_id):
	if request.method == 'POST':
		if request.data:
			update_to_mapping_dict = request.get_json(force=True)
			updated_count = update_mapping(mapping_id, update_to_mapping_dict)

			if updated_count:
				return Response(status=200)
			else:
				return Response(status=409)
		else:
			print("No data in request")
			return Response(status=400)

@mapping_view.route("/list_all_mappings/", methods=['GET'])
@cross_origin()
def  list_all_mappings():
	result = fetch_all_mappings()
	return jsonify(result)

@mapping_view.route("/get_mapping/<mapping_id>/", methods=['GET'])
@cross_origin()
def get_mapping_by_id(mapping_id):
	result = fetch_mapping_by_id(mapping_id)
	return jsonify(result)