from __future__ import print_function

import sys
import stepic
import requests as r

from StringIO import StringIO
from flask import Flask, render_template, request, send_file
from PIL import Image

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

@app.route('/encoder/', methods=['POST'])
def encode():
    # The url of the original image
    img_url = request.form['img_url']
    # The message to encoder
    message = request.form['message']
    raw_img = Image.open(StringIO(r.get(img_url).content))
    steg_encoded = stepic.encode(raw_img, message)
    out_buf = StringIO()
    steg_encoded.save(out_buf, 'JPEG', quality=100)
    out_buf.seek(0)
    return send_file(out_buf, mimetype='image/jpeg')

@app.route('/decoder/', methods = ['POST', 'GET'])
def decode():
    


# set the secret key. dummy value right now
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == '__main__':
    main()
