import http from "k6/http";
import { sleep, check, group } from "k6";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<500"],
    "group_duration{group:::Home Page}": ["avg<3000"],
    "group_duration{group:::Home Page::Assets}": ["avg<2000"],
  },
};

export default function () {
  group("Home Page", function () {
    let res = http.get("https://test.k6.io");
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
    sleep(1);

    group("Assets", function () {
      res = http.get("https://test.k6.io/static/js/prisms.js");
      check(res, {
        "is status 200": (r) => r.status === 200,
      });

      res = http.get("https://test.k6.io/static/css/site.css");
      check(res, {
        "is status 200": (r) => r.status === 200,
      });
    });
  });

  group("News Page", function () {
    let res = http.get("https://test.k6.io/news.php");
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
    sleep(1);
  });
}
