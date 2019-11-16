import datetime
import jwt
import bcrypt
from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson import ObjectId
from functools import wraps

app = Flask(__name__)
app.secret_key = 'kFbAYIQgh2rA'

client = MongoClient('mongodb://127.0.0.1:27017')
db = client.Space_Rocks
landings = db.landings


@app.route('/api/1/landings', methods=['GET'])
def view_all_landings():
    page_num, page_size = 1, 10
    if request.args.get('pn'):
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    page_start = page_size * (page_num - 1)

    data_to_return = []
    for landing in landings.find().skip(page_start).limit(page_size):
        landing['_id'] = str(landing['_id'])
        data_to_return.append(landing)

    return make_response(jsonify(data_to_return), 200)


if __name__ == "__main__":
    app.run(debug=True)


