"""
TESTING SCRIPT CONFIGURATION

DO NOT USE FOR DEPLOYMENT!
"""

from flask import Flask, url_for, render_template, request, redirect
from datetime import date


site_version = "*test site*"


app = Flask(__name__)


# make the page refresh after each load
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


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


if __name__ == '__main__':
    # local testing
    app.run(debug=True)
