from flask import *
from flask_cors import CORS
import codefile_reader as cfr

main_app = Flask('rytech-dev-io')
CORS(main_app)

@main_app.route('/')
@main_app.route('/home')
def home():
    return render_template('index.html', code_buttons=cfr.get_code_file_names())


@main_app.route('/load_code/<codetag>', methods=["GET", "POST"])
def load_code(codetag: str):
    if request.method == "GET":
        code_contents = cfr.load_code_file(codetag)
        return code_contents

    return "code not found..."


if __name__ == "__main__":
    main_app.run(debug=True)