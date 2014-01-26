from __future__ import print_function

import sys
import stepic
import urllib
import requests as r

from StringIO import StringIO
from flask import Flask, render_template, request, send_file
from PIL import Image

from pprint import pprint

app = Flask(__name__)

def main():
    app.run(debug=True)

@app.route('/')
def index():
    return render_template('index.html')

# much image, such steg
# ...
# ...
# Wooooooow

@app.route('/encoder/', methods = ['POST'])
def encode():
    print("ENCODE ENDPOINT HIT")
    pprint(request.form)
    # The url of the original image
    img_url = request.form['img_url']
    message = request.form['message']
    raw_img = Image.open(StringIO(r.get(img_url).content))
    steg_encoded = stepic.encode(raw_img, message)
    out_buf = StringIO()
    steg_encoded.save(out_buf, 'PNG')
    out_buf.seek(0)
    encoded = out_buf.getvalue().encode("base64")
    return 'data:image/png;base64,' + encoded

@app.route('/decoder/', methods = ['POST'])
def decode():
    print("DECODE ENDPOINT HIT")
    pprint(request.form)
    img_url = request.form['img_url']
    raw_img = Image.open(StringIO(r.get(img_url).content))
    steg_decoded = stepic.decode(raw_img)
    return 'data:text/' + steg_decoded

# set the secret key. dummy value right now
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == '__main__':
    main()
