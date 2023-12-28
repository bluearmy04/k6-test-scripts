import http from "k6/http";
import { sleep, check, group } from "k6";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<500"],
    "http_req_duration{expected_response:true}": ["p(95)<300"],
    "group_duration{group:::Home Page}": ["avg<3000"],
    "group_duration{group:::Home Page::Assets}": ["avg<2000"],
  },
};

export default function () {
  group("Home Page", function () {
    let res = http.get(
      "https://run.mocky.io/v3/22d5c878-fbee-4bba-8960-5a7162c2b1cc"
    );
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
    sleep(1);

    group("Assets", function () {
      res = http.get(
        "https://run.mocky.io/v3/22d5c878-fbee-4bba-8960-5a7162c2b1cc"
      );
      check(res, {
        "is status 200": (r) => r.status === 200,
      });

      res = http.get(
        "https://run.mocky.io/v3/22d5c878-fbee-4bba-8960-5a7162c2b1cc"
      );
      check(res, {
        "is status 200": (r) => r.status === 200,
      });
    });
  });

  group("News Page", function () {
    let res = http.get(
      "https://run.mocky.io/v3/8b532eca-6904-4318-b27d-0f18fb099b0b"
    );
    check(res, {
      "is status 503": (r) => r.status === 503,
    });
    sleep(1);
  });
}
