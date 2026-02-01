import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from models import collection

app = Flask(__name__)
CORS(app)

def utc_time():
    return datetime.utcnow().strftime("%d %B %Y - %I:%M %p UTC")

@app.route("/webhook", methods=["POST"])
def github_webhook():
    payload = request.json
    event = request.headers.get("X-GitHub-Event")

    data = {}

    # PUSH EVENT
    if event == "push":
        data = {
            "request_id": payload["after"],
            "author": payload["pusher"]["name"],
            "action": "PUSH",
            "from_branch": None,
            "to_branch": payload["ref"].split("/")[-1],
            "timestamp": utc_time()
        }

    # PULL REQUEST EVENT
    elif event == "pull_request":
        pr = payload["pull_request"]
        action_type = payload["action"]

        # MERGE
        if action_type == "closed" and pr["merged"]:
            data = {
                "request_id": str(pr["id"]),
                "author": pr["merged_by"]["login"],
                "action": "MERGE",
                "from_branch": pr["head"]["ref"],
                "to_branch": pr["base"]["ref"],
                "timestamp": utc_time()
            }
        else:
            data = {
                "request_id": str(pr["id"]),
                "author": pr["user"]["login"],
                "action": "PULL_REQUEST",
                "from_branch": pr["head"]["ref"],
                "to_branch": pr["base"]["ref"],
                "timestamp": utc_time()
            }

    if data:
        collection.insert_one(data)

    return jsonify({"status": "success"}), 200


@app.route("/events", methods=["GET"])
def get_events():
    events = list(
        collection.find({}, {"_id": 0}).sort("timestamp", -1)
    )
    return jsonify(events)
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
