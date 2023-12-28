import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import http from "k6/http";
import { SharedArray } from "k6/data";

let userCrendentials = new SharedArray("users with credentials", function () {
  return papaparse.parse(open("./users.csv"), { header: true }).data;
});

export default function () {
  userCrendentials.forEach((user) => {
    const credentials = JSON.stringify({
      username: user.username,
      password: user.password,
    });

    http.post("https://test-api.k6.io/user/register/", credentials, {
      headers: { "Content-Type": "application/json" },
    });
  });
}
