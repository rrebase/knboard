import json
import time
from locust import HttpUser, task


headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en;q=0.9",
    #"content-length": "0",
    "content-type": "application/json;charset=UTF-8",
    "origin": "https://knboard.com",
    "referer": "https://knboard.com/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36",
}

class TaskCreatingUser(HttpUser):
    host = "https://knboard.com"

    @task(1)
    def view_item(self):
        hdrs = headers.copy()
        hdrs["x-csrftoken"] = self.csrf_token
        boards_response = self.client.get("/api/boards/")
        board_id = boards_response.json()[0]["id"]
        board_response = self.client.get("/api/boards/{}".format(board_id))
        column_id = board_response.json()["columns"][0]["id"]
        for item_id in range(100):
            self.client.post(
                "/api/tasks/",
                headers=hdrs,
                cookies={ "sessionid": self.sessionid },
                data=json.dumps({
                "title": "hehe",
                "description": "hehe",
                "column": column_id,
                "labels": [],
                "assignees": [3],
                "priority": "M",
            }))
        self.stop()

    def on_start(self):
        response = self.client.post("/auth/guest/", headers=headers, json={"username": "foo", "password": "bar"})
        self.sessionid = response.cookies["sessionid"]
        self.csrf_token = response.cookies["csrftoken"]
