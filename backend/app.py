import datetime
import math
import _json
import jwt
import bcrypt
from flask import Flask, request, jsonify, make_response
from flask.json import JSONEncoder
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId, json_util
import json
from functools import wraps

app = Flask(__name__)
CORS(app)
app.secret_key = 'kFbAYIQgh2rA'

client = MongoClient('mongodb://127.0.0.1:27017')
db = client.Space_Rocks
landings = db.landings

PAGE_SIZE = 18


@app.route('/api/1/page-limit', methods=['GET'])
def calculate_page_number():
    data_to_return = []
    for landing in landings.find():
        landing['_id'] = str(landing['_id'])
        data_to_return.append(landing)

    page_limit = math.ceil(len(data_to_return) / PAGE_SIZE)
    return make_response(jsonify(page_limit), 200)


@app.route('/api/1/landings', methods=['GET'])
def view_all_landings():
    page_num, page_size = 1, PAGE_SIZE
    if request.args.get('pn'):
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    page_start = page_size * (page_num - 1)

    data_to_return = []
    for landing in landings.find().skip(page_start).limit(page_size):
        landing['_id'] = str(landing['_id'])
        data_to_return.append(landing)
    json_landings = json.loads(json_util.dumps(data_to_return))
    return make_response(jsonify(json_landings), 200)


@app.route('/api/1/landings/locations', methods=['GET'])
def get_landing_locations():
    data_to_return = []
    for landing in landings.find():
        landing['_id'] = str(landing['_id'])
        data_to_return.append(landing)
    json_locations = json.loads(json_util.dumps(data_to_return))
    return make_response((jsonify(json_locations)), 200)


@app.route('/api/1/landings/<string:l_id>', methods=['GET'])
def view_specific_landing(l_id):
    landing = landings.find_one({"_id": ObjectId(l_id)})
    if landing is not None:
        landing['_id'] = str(landing['_id'])
        json_landing = json.loads(json_util.dumps(landing))
        return make_response(jsonify(json_landing), 200)
    else:
        return make_response(jsonify({"error": "invalid business ID"}), 404)


@app.route('/api/1/landings/<string:id>/reviews', methods=['GET'])
def view_landing_reviews(id):
    data_to_return = []
    landing = landings.find_one({"_id": ObjectId(id)}, {"reviews": 1, "_id": 0})
    for review in landing["reviews"]:
        review["_id"] = str(review["_id"])
        data_to_return.append(review)
    json_reviews = json.loads(json_util.dumps(data_to_return))
    return make_response(jsonify(json_reviews), 200)


@app.route('/api/1/landings/<string:l_id>', methods=['PUT'])
def update_landing(l_id):
    if 'name' in request.form and 'nametype' in request.form and 'fall' in request.form and 'mass (g)' in request.form\
            and 'reclat' in request.form and 'reclong' in request.form and 'year' in request.form and\
            'GeoLocation' in request.form:
        result = landings.update_one({'_id': ObjectId(l_id)},
                                     {'$set': {'name': request.form['name'],
                                               'nametype': request.form['nametype'],
                                               'reclass': request.form['reclass'],
                                               'fall': request.form['fall'],
                                               'mass': request.form['mass'],
                                               'reclat': request.form['reclat'],
                                               'reclong': request.form['reclong'],
                                               'year': request.form['year'],
                                               'GeoLocation': request.form['GeoLocation']
                                               }
                                      })
        if result.matched_count == 1:
            edited_landing_link = "http://localhost:5000/api/v1.0/landings/" + l_id
            return make_response(jsonify({'url': edited_landing_link}), 200)
        else:
            return make_response(jsonify({'error': 'Invalid Landing ID'}), 404)
    else:
        return make_response(jsonify({'error': 'Missing form data'}), 404)


@app.route("/api/1/reviews/<string:l_id>/<string:r_id>", methods=["GET"])
def get_review(l_id, r_id):
    landing = landings.find_one({"_id": ObjectId(l_id)})
    review = landings. find_one({"reviews._id": ObjectId(r_id)}, {"_id": 0, "reviews.$": 1})
    if review is None:
        return make_response(jsonify({"error": "Invalid business ID or review ID"}), 404)
    landing['reviews'][0]['_id'] = str(landing['reviews'][0]['_id'])
    data_to_return = dict()
    data_to_return["_id"] = review["reviews"][0]["_id"]
    data_to_return["user"] = review["reviews"][0]["user"]
    data_to_return["comment"] = review["reviews"][0]["comment"]
    data_to_return["rating"] = review["reviews"][0]["rating"]
    data_to_return["date"] = review["reviews"][0]["date"]
    data_to_return["l_id"] = str(landing["_id"])

    json_data = json.loads(json_util.dumps(data_to_return))
    return make_response(jsonify(json_data), 200)


@app.route('/api/1/landings/reviews/<string:user>')
def view_user_reviews(user):
    data_to_return = []
    for landing in landings.find({"reviews.user": user}):
        for review in landing["reviews"]:
            if review["user"] == user:
                data = dict()
                data["id"] = str(review["_id"])
                data["date"] = review["date"]
                data["comment"] = review["comment"]
                data["rating"] = review["rating"]
                data["landing_name"] = landing["name"]
                data["landing_id"] = str(landing["_id"])
                data_to_return.append(data)
    json_reviews = json.loads(json_util.dumps(data_to_return))
    return make_response(jsonify(json_reviews), 200)


@app.route('/api/1/landings', methods=['POST'])
def add_landing():
    if 'name' in request.form and 'nametype' in request.form and 'fall' in request.form and 'mass (g)' in request.form\
            and 'reclat' in request.form and 'reclong' in request.form and 'year' in request.form and\
            'GeoLocation' in request.form:
        new_landing = {
            'name': request.form['name'],
            'nametype': request.form['nametype'],
            'reclass': request.form['reclass'],
            'fall': request.form['fall'],
            'mass': request.form['mass'],
            'reclat': request.form['reclat'],
            'reclong': request.form['reclong'],
            'year': request.form['year'],
            'GeoLocation': request.form['GeoLocation']
            }
        new_landing_id = landings.insert_one(new_landing)
        new_landing_url = 'http://localhost:5000/api/1/landings/' + str(new_landing_id.inserted_id)
        return make_response(jsonify({'url': new_landing_url}), 201)
    else:
        return make_response(jsonify({'error': 'Missing form data'}))


@app.route('/api/1/landings/<string:l_id>/reviews', methods=['POST'])
def add_landing_review(l_id):
    new_review = {
        "_id": ObjectId(),
        "user": request.form["user"],
        "date": str(datetime.date.today()),
        "comment": request.form["comment"],
        "rating": request.form["rating"]
    }
    landings.update_one({"_id": ObjectId(l_id)}, {"$push": {"reviews": new_review}})
    new_review_link = "http://localhost:5000/api/1/landings/" + l_id + "/reviews/" + str(new_review['_id'])
    return make_response(jsonify({"url": new_review_link}), 201)


@app.route('/api/1/reviews/<string:r_id>', methods=['PUT'])
def edit_review(r_id):
    edited_review = {
        "reviews.$.comment": request.form["comment"],
        "reviews.$.rating": request.form['rating'],
        "reviews.$.date": str(datetime.date.today())
    }
    landings.update_one(
        {"reviews._id": ObjectId(r_id)},
        {"$set": edited_review})
    edit_review_url = "http://localhost:5000/api/v1/reviews/" + r_id
    return make_response(jsonify({"url": edit_review_url}), 200)


@app.route('/api/1/landings/<string:l_id>/reviews/<string:r_id>', methods=['DELETE'])
def delete_review(l_id, r_id):
    landings.update_one(
        {"_id": ObjectId(l_id)},
        {"$pull": {"reviews": {"_id": ObjectId(r_id)}}})
    edit_review_url = "http://localhost:5000/api/v1/reviews/" + r_id
    return make_response(jsonify({"url": edit_review_url}), 204)


if __name__ == "__main__":
    app.run(debug=True)


