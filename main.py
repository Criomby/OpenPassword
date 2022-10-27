from flask import Flask, url_for, render_template, request, redirect
from datetime import date


site_version = "v1.0.1:102022"


app = Flask(__name__)


@app.route('/', methods=["GET"])
def index():
    return render_template('openpassword.html',
        site_version=site_version
    )

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html',
        site_version=site_version
    ), 404
