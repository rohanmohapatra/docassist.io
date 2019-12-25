from app import app
from views.templates_view import templates_view
from views.data_view import data_view
from views.email_view import email_view
from views.media_view import media_view
base_url = '/api'

app.register_blueprint(templates_view, url_prefix=base_url+'/templates')
app.register_blueprint(data_view, url_prefix=base_url+'/data')
app.register_blueprint(email_view, url_prefix=base_url+'/email')
app.register_blueprint(media_view, url_prefix=base_url+'/media')

@app.errorhandler(500)
def server_error(e):
    return 'An internal error occurred.',500

if __name__=="__main__":
	app.run(host='0.0.0.0', port=5001, debug = True)