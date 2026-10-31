from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    # use_reloader=False makes local execution in Spyder more reliable.
    # Debug mode is ONLY for running on your own computer.
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
