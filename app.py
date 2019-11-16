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


if __name__ == "__main__":
    app.run(debug=True)


