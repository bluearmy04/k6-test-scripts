import http from "k6/http";
import { Counter } from "k6/metrics";
import { check, sleep } from "k6";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<500"],
    'http_req_duration{page: "order"}': ["p(95)<400"],
    http_errors: ["count==0"],
    'http_errors{page:"order"}': ["count==0"],
    checks: ["rate >= 0.99"],
    'checks{page:"order"}': ["rate >= 0.99"],
  },
};

let httpErrors = new Counter("http_errors");

export default function () {
  let res = http.get(
    "https://run.mocky.io/v3/83d849d3-05a5-4b33-bf3c-f258221ae0d5"
  );

  if (res.error) {
    httpErrors.add(1);
  }

  check(res, {
    "is status 200": (r) => r.status === 200,
  });

  //submit order
  res = http.get(
    "https://run.mocky.io/v3/22d5c878-fbee-4bba-8960-5a7162c2b1cc?mocky-delay=2000ms",
    {
      tags: {
        page: "order",
      },
    }
  );

  if (res.error) {
    httpErrors.add(1, { page: "order" });
  }

  check(
    res,
    {
      "is stsatus 201": (r) => r.status === 201,
    },
    { page: "order" }
  );
}
