from docxtpl import DocxTemplate, RichText

def save_xml(doc_location):
	docx_object = DocxTemplate(doc_location)
	print(docx_object.get_xml())
	'''
	for para in docx_object.paragraphs:
		print(para._p.r_lst)
		for r in para._p.r_lst:
			print("R:",r.xml)
		print(para.text)
	'''
if __name__=="__main__":
	import argparse

	parser = argparse.ArgumentParser()
	parser.add_argument('doc_location', help="Enter location of template.", type=str)
	args = parser.parse_args()
	save_xml(args.doc_location)