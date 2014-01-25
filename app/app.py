from __future__ import print_function

import sys
import stepic

from flask import Flask
from PIL import Image

# much image, such steg
# ...
# ...
# Wooooooow
def encode_image(imagefile, message, outfile):
    image = Image.open(imagefile)
    encoded = stepic.encode(image, message)
    return encoded

def main():
    print("Hackathon winning application right here")

if __name__ == '__main__':
    main()
