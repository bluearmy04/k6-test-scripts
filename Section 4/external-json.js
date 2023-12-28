import http from "k6/http";
import { sleep, check } from "k6";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { SharedArray } from "k6/data";

const userCrendentials = new SharedArray("users with credentials", function () {
  return JSON.parse(open("./users.json")).users;
});

//console.log(userCrendentials);

export default function () {
  userCrendentials.forEach((user) => {
    const credentials = JSON.stringify({
      username: user.username,
      password: user.password,
    });

    let res = http.post("https://test-api.k6.io/user/register/", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    check(res, {
      "is status 201:": (r) => r.status === 201,
    });
  });

  const random_credentials = randomItem(userCrendentials);

  http.post(
    "https://test-api.k6.io/auth/token/login/",
    JSON.stringify(random_credentials),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
