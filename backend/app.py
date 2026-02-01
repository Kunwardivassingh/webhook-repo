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
    try:
        payload = request.json
        event = request.headers.get("X-GitHub-Event")

        data = None

        if event == "push":
            data = {
                "request_id": payload.get("after"),
                "author": payload.get("pusher", {}).get("name"),
                "action": "PUSH",
                "from_branch": None,
                "to_branch": payload.get("ref", "").split("/")[-1],
                "timestamp": utc_time()
            }

        elif event == "pull_request":
            pr = payload.get("pull_request", {})
            action_type = payload.get("action")

            if action_type == "closed" and pr.get("merged"):
                data = {
                    "request_id": str(pr.get("id")),
                    "author": pr.get("merged_by", {}).get("login"),
                    "action": "MERGE",
                    "from_branch": pr.get("head", {}).get("ref"),
                    "to_branch": pr.get("base", {}).get("ref"),
                    "timestamp": utc_time()
                }
            else:
                data = {
                    "request_id": str(pr.get("id")),
                    "author": pr.get("user", {}).get("login"),
                    "action": "PULL_REQUEST",
                    "from_branch": pr.get("head", {}).get("ref"),
                    "to_branch": pr.get("base", {}).get("ref"),
                    "timestamp": utc_time()
                }

        if data:
            result = collection.insert_one(data)
            print("Inserted document ID:", result.inserted_id)

        return jsonify({"status": "success"}), 200
    
        # if data:
        #     result = collection.insert_one(data)
        #     print("Inserted document ID:", result.inserted_id)


    except Exception as e:
        print("Webhook error:", e)
        return jsonify({"error": "internal error"}), 500


    


@app.route("/events", methods=["GET"])
def get_events():
    events = list(
        collection.find({}, {"_id": 0}).sort("timestamp", -1)
    )
    return jsonify(events)
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
