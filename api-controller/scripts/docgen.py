from docxtpl import DocxTemplate, RichText
from sys import platform as _platform

import json
import os
import time
import subprocess
import sys

if os.name == 'nt': 
	import comtypes.client

def get_default_tags(template_file_name, docx_object, template_folder):
	print("get_default_tags: template_file_name:",template_file_name)
	print("fixed template folder:",template_folder)
	default_tags = {'page_break': RichText('\f')}
	directory = os.fsencode(template_folder)
	for docx_template in os.listdir(directory):
		filename = os.fsdecode(docx_template)
		if filename==template_file_name:
			continue
		subdoc_name = filename.split('.')[0]	# if filename is temp.docx, subdoc_name is temp

		default_tags[subdoc_name] = docx_object.new_subdoc(template_folder+"/"+filename)

	print(default_tags)
	return default_tags

def make_pdf(in_file, out_file):
	print("Making PDF")
	wdFormatPDF = 17

	word = comtypes.client.CreateObject('Word.Application')
	doc = word.Documents.Open(in_file)
	doc.SaveAs(out_file, FileFormat=wdFormatPDF)
	doc.Close()
	word.Quit()

def fill_subdocs(docx_object, file_name, client_name):
	default_tags = get_default_tags(docx_object, "./fixed_templates")
	docx_object.render(default_tags)
	temp_doc_location = "outputs/temp_" + client_name + '_' + file_name
	docx_object.save(temp_doc_location)
	return temp_doc_location	

def fill_client_data(docx_object, file_name, client_name, context):
	docx_object.render(context)

def generate_doc(template_location, context, username):
	"""
		Replaces the fields in data_dict with corresponding values.
	"""

	docx_object = DocxTemplate(template_location)
	file_name = template_location.split('/')[-1]
	client_name = context["jmf_client_name"]

	default_tags = get_default_tags(file_name, docx_object, os.path.abspath(os.path.dirname(__file__)) + "/template/"+username+"/")
	context.update(default_tags)

	docx_object.render(context)
	docx_object.render(context)

	gen_doc_location = os.path.abspath(os.path.dirname(__file__))+"/output/"+username+"/docx/" + client_name + '_' + str(int(time.time())) + '_' + file_name
	docx_object.save(gen_doc_location)

	return gen_doc_location

if __name__=="__main__":
	import argparse
	print("in docgen")
	parser = argparse.ArgumentParser()
	parser.add_argument('template_location', help="Enter location of template.", type=str)
	parser.add_argument('data_location', help="Enter location of data dictionary.", type=str)
	parser.add_argument('username', nargs='?', default="user_a", help="Enter username for whom document is being generated.", type=str)
	args = parser.parse_args()
	print("finished argparse")

	with open(args.data_location) as json_file:
		print("username:",args.username)

		print("Location of client data for docgen",args.data_location)
		client_data = json.load(json_file)

		gen_doc_loc = generate_doc(args.template_location, client_data, args.username)
		print("word doc generated at ", gen_doc_loc)

		pdf_name = gen_doc_loc.replace('docx', 'pdf')
		print("pdf location:",pdf_name)

		if os.name == 'nt':
			make_pdf(os.path.abspath(gen_doc_loc), os.path.abspath(pdf_name))
		elif os.name == 'posix':
			# linux
			if _platform == "linux" or _platform == "linux2":
				subprocess.check_call('/usr/lib/libreoffice/program/soffice --headless --convert-to pdf "' + os.path.abspath(gen_doc_loc)+'" --outdir "'+os.path.abspath(os.path.dirname(__file__))+'/output/'+args.username+'/pdf'+'"',shell=True)

			# MAC OS X
			elif _platform == "darwin":
				print("Support not yet added")

		print("Document Name :",gen_doc_loc.split("/")[-1].split(".")[0])

