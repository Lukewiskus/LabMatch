from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from scripts.queries import search_entities, get_author_details, is_author_in_database, insert_author_name_into_queue, get_queue_id_step, get_author_using_queue_id
from scripts.pubmed import is_author_in_pubmed
from time import sleep
app = Flask(__name__)
CORS(app)

@app.route('/search')
def search_database():
    search_query = request.args.get('query')
    retval = search_entities(search_query)
    return jsonify(retval)

@app.route('/author')
def get_author():
    sleep(1)
    id = request.args.get('id')
    print(id)
    retval = get_author_details(id)
    print(retval)
    return jsonify(retval)

@app.route("/is-author-in-db")
def get_is_author_in_db():
    author_name = request.args.get('authorName')
    retval = is_author_in_database(author_name)
    return jsonify(retval)

@app.route("/is-author-in-pubmed")
def get_is_author_in_pubmed():
    author_name = request.args.get('authorName')
    retval = is_author_in_pubmed(author_name)
    return jsonify(retval)

@app.route("/put_author_name_into_queue")
def put_author_name_into_queue():
    author_name = request.args.get('authorName')
    queue_id = insert_author_name_into_queue(author_name)
    return jsonify({"author_queue_id": queue_id})

@app.route("/get_queue_step")
def get_queue_step():
    queue_id = request.args.get('queue_id')
    step = get_queue_id_step(queue_id)
    return jsonify({"step": step})

@app.route("/get_author_from_queue_id")
def get_author_from_queue_id():
    queue_id = request.args.get('queue_id')
    retval = get_author_using_queue_id(queue_id)
    return jsonify(retval)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)