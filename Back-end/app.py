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
    for landing in landings.find({}).skip(page_start).limit(page_size):
        landing['_id'] = str(landing['_id'])
        data_to_return.append(landing)

    return make_response(jsonify(data_to_return), 200)


@app.route('/api/1/landings/<string:l_id>', methods=['GET'])
def view_specific_landing(l_id):
    landing = landings.find_one({"_id": ObjectId(l_id)})
    if landing is not None:
        landing['_id'] = str(landing['_id'])
        return make_response(jsonify(landing), 200)
    else:
        return make_response(jsonify({"error": "invalid business ID"}), 404)



@app.route('/api/1/landings/<string:l_id>', methods=['PUT'])
def update_landing(l_id):
    if 'name' in request.form and 'nametype' in request.form and 'fall' in request.form and 'mass (g)' in request.form\
            and 'reclat' in request.form and 'reclong' in request.form and 'year' in request.form and\
            'GeoLocation' in request.form:
        result = landings.update_one({'_id': ObjectId(l_id)},
                                     {'$set': {'name': request.form['name'],
                                               'nametype': request.form['nametype'],
                                               'fall': request.form['fall'],
                                               'mass (g)': request.form['mass (g)'],
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
            return make_response(jsonify({'error': 'Invalid business ID'}), 404)
    else:
        return make_response(jsonify({'error': 'Missing form data'}), 404)


@app.route('/api/1/landings', methods=['POST'])
def add_landing():
    if 'name' in request.form and 'nametype' in request.form and 'fall' in request.form and 'mass (g)' in request.form\
            and 'reclat' in request.form and 'reclong' in request.form and 'year' in request.form and\
            'GeoLocation' in request.form:
        new_landing = {
            'name': request.form['name'],
            'nametype': request.form['nametype'],
            'fall': request.form['fall'],
            'mass (g)': request.form['mass (g)'],
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


@app.route('/api/1/landings/<string:l_id>', methods=['DELETE'])
def delete_landing(l_id):
    result = landings.delete_one({'_id': ObjectId(l_id)})
    if result.deleted_count == 1:
        return make_response(jsonify({}), 204)
    else:
        return make_response({'error': 'Invalid Landing ID'})


if __name__ == "__main__":
    app.run(debug=True)


