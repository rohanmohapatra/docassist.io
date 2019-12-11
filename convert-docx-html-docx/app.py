from flask import Flask, escape, request, Response
import mammoth
from html2docx import html2docx
from flask_cors import cross_origin

app = Flask(__name__)

@app.route('/api/templates/edit/', methods=['GET'])
@cross_origin()
def edit_templates():
    with open("document.docx", "rb") as docx_file:
        result = mammoth.convert_to_html(docx_file)
        html = result.value # The generated HTML
        return html

@app.route('/api/templates/save/', methods=['POST'])
@cross_origin()
def save_templates():
    json_data = request.get_json(force=True)
    #print(json_data)
    html = json_data["html"]
    buf = html2docx(html, title="Edited Template")

    with open("document.docx", "wb") as fp:
        fp.write(buf.getvalue())
    return Response(status=200)


if __name__=="__main__":
	app.run(host='0.0.0.0', port=5000, debug = True)