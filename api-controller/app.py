from flask import Flask, Response, request, render_template
from utils import allowed_file_extensions
from werkzeug.utils import secure_filename
import os


UPLOAD_FOLDER = os.getcwd() + '/template'

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.route("/api/v1/upload/template",methods=['POST'])
def uploadTemplate():
    ALLOWED_EXTENSIONS = set(['docx', 'pdf','json'])
    if request.method == 'POST':
        #print(request.files.to_dict(flat=False))
        
        #Check if my inout has those fields
        if 'template' not in request.files:
            return Response(status=400)
        if 'clientJson' not in request.files:
            return Response(status=400)

        template = request.files['template']
        clientJson = request.files['clientJson']

        if template.filename == '' or clientJson.filename == '':
            return Response(status=400)

        #If allowed extensions save the PDF
        if template and allowed_file_extensions(template.filename, ALLOWED_EXTENSIONS):
            template_filename = secure_filename(template.filename)
            template.save(os.path.join(app.config['UPLOAD_FOLDER'], template_filename))
        else:
            return Response('["file types not supported"]', status=400)


        #If allowed extensions save the JSON
        if clientJson and allowed_file_extensions(clientJson.filename, ALLOWED_EXTENSIONS):
            cJ_filename = secure_filename(clientJson.filename)
            clientJson.save(os.path.join(app.config['UPLOAD_FOLDER'], cJ_filename))
        else:
            return Response('["file types not supported"]', status=400)

        #Make a call to the string processing module
        return Response(status=200)
    else:
        Response(status=405)

@app.route("/api/v1/upload/clientJSON",methods=['POST'])
def uploadClientJson():
    ALLOWED_EXTENSIONS = set(['json'])
    if request.method == 'POST':
        print(request.files.to_dict(flat=False))
        # check if the post request has the file part
        if 'file' not in request.files:
            return Response(status=400)

        file = request.files['file']
        print(file)
        if file.filename == '':
            return Response(status=400)
        if file and allowed_file_extensions(file.filename,ALLOWED_EXTENSIONS):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return Response(status=200)
        else:
            return Response('["file types not supported"]', status=400)
    else:
        Response(status=405)


@app.route("/api/v1/health")
def healthCheck():
    return Response(status=200)

if __name__ == "__main__":
    app.run(debug=True)