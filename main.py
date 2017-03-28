from flask import *
from build import *

app = Flask(__name__, static_url_path="", static_folder="static")
app.config.from_object(__name__)

app.config.update(dict(
    SECRET_KEY='development key',
    DEBUG='True'))

app.config.from_envvar('FLASKR_SETTINGS', silent=True)


def init_db():
    DatabaseConnection.db.connect()


@app.route('/')
def show_start_html():
    return render_template("start2.html")


@app.route('/board/<board_id>')
def show_board(board_id):
    return render_template("board.html")


@app.route('/boards/<id>', methods=['POST'])
def board_to_db(id):
    print(id)
    json_obj = request.get_json(force=True)
    new_board = Board(board_title=json_obj["board_title"],
                      board_id=json_obj["board_id"])
    new_board.save()
    return json.dumps(json_obj)


def main():
    app.run()
    init_db()

if __name__ == '__main__':
    main()
