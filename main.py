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
    boards = Board.select().order_by(Board.id.asc())
    for i in boards:
        print(i.board_title)
    return render_template("start2.html")


@app.route('/board/<board_id>')
def show_board(board_id):
    return render_template("board.html")


@app.route('/boards/<id>', methods=['POST'])
def board_to_db(id):
    json_obj = request.get_json(force=True)
    new_board = Board(board_title=json_obj["board_title"],
                      board_id=json_obj["board_id"])
    new_board.save()
    return json.dumps(json_obj)

@app.route('/boards/save_cards', methods=['POST'])
def card_to_db():
    json_obj = request.get_json(force=True)
    new_card_status_id = Status.select().where(Status.name == json_obj["card_status"]).get()
    new_card_board_id = Board.select().where(Board.board_title == json_obj["board_name"]).get()
    new_card = Cards(card_id=json_obj["card_id"],
                     card_title=json_obj["card_title"],
                     card_desc = json_obj["card_description"],
                     status = new_card_status_id,
                     board = new_card_board_id)
    new_card.save()
    return json.dumps(json_obj)


@app.route('/boards/update_status', methods=['POST'])
def update_card_status():
    json_obj = request.get_json(force=True)
    new_status_of_card = Status.select().where(Status.name == json_obj["card_status"]).get()
    Cards.update(status=new_status_of_card).where(Cards.card_id == json_obj["card_id"]).execute()
    return json.dumps(json_obj)


@app.route('/boards/delete_cards', methods=['POST'])
def delete_card():
    json_obj = request.get_json(force=True)
    Cards.delete().where(Cards.card_id == json_obj["card_id"]).execute()
    return json.dumps({ "status" : "OK" })

@app.route('/boards/<title>', methods=['DELETE'])
def del_board(title):
    # json_obj = request.get_json(force=True)
    board_obj = Board.select().where(Board.board_title == title).get()
    Cards.delete().where(Cards.board_id == board_obj.id).execute()
    Board.delete().where(Board.board_title == title).execute()
    return json.dumps({ "status" : "OK" })

def main():
    app.run()
    init_db()

if __name__ == '__main__':
    main()
