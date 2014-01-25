from __future__ import print_function

from flask import Flask, flask, flask.views, session, redirect, url_for, escape, request

def main():
    print("Hackathon winning application right here")

if __name__ == '__main__':
    main()

DROPBOX_APP_KEY = 'ieifl4jkzmb84yv'
DROPBOX_APP_SECRET = '71t9g8blcf4652t'

@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'

@app.route('/')
def home():
    if not 'access_token' in session:
        return redirect(url_for('dropbox_auth_start'))
    return 'Authenticated.'

@app.route('/dropbox-auth-start')
def dropbox_auth_start():
    return redirect(get_auth_flow().start())

@app.route('/dropbox-auth-finish')
def dropbox_auth_finish():
    try:
        access_token, user_id, url_state = get_auth_flow().finish(request.args)
    except:
        abort(400)
    else:
        session['access_token'] = access_token
    return redirect(url_for('home'))

def get_auth_flow():
    redirect_uri = url_for('dropbox_auth_finish', _external=True)
    return DropboxOAuth2Flow(DROPBOX_APP_KEY, DROPBOX_APP_SECRET, redirect_uri,
                             session, 'dropbox-auth-csrf-token')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return '''
        <form action="" method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))

# set the secret key. dummy value right now
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
