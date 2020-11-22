from locust import HttpUser, task
from locust.clients import HttpSession

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


def register_test_users():
    class FakeRequestHandler:
        def fire(self, *args, **kwargs):
            return

    print("Attempting to register test users...")
    for i in range(100):
        client = HttpSession(
            "https://knboard.com",
            request_failure=FakeRequestHandler(),
            request_success=FakeRequestHandler()
        )

        username = "locusttest{}".format(i)
        response = client.post(
            "/auth/registration/",
            headers=headers,
            json={
                "username": username,
                "email": "{}@example.org".format(username),
                "password1": "locusttestpwd",
                "password2": "locusttestpwd",
            }
        )
        if response.status_code != 201:
            print("Test users seem to have been already registered. Skipping.")
            return
        else:
            print("Registered test user no. {}".format(i), end="\r")

    print("Test users registered       ")


register_test_users()


class LoggingInUser(HttpUser):
    user_counter = 0
    host = "https://knboard.com"

    @task(1)
    def login(self):
        self.client.post(
            "/auth/login/",
            headers=headers,
            json={"username": "locusttest{}".format(self.__class__.user_counter), "password": "locusttestpwd"}
        )
        self.__class__.user_counter += 1
        self.stop()
