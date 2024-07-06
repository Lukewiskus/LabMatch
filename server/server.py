from flask import Flask, jsonify, request
from flask_cors import CORS
from sql.queries import search_entities

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/search')
def search_database():
    search_query = request.args.get('query')
    retval = search_entities(search_query)
    return jsonify(retval)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)