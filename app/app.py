from __future__ import print_function

import sys
import stepic

from flask import Flask, render_template
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
def encode_image(imagefile, message, outfile):
    image = Image.open(imagefile)
    encoded = stepic.encode(image, message)
    return encoded

# set the secret key. dummy value right now
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == '__main__':
    main()
