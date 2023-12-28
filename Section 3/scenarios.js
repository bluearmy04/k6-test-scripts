import http from "k6/http";
import { check } from "k6";
import { sleep } from "k6";
import exec from "k6/execution";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95)<400"],
    http_req_duration: ["max<500"],
    http_req_failed: ["rate<0.03"],
    http_reqs: ["count>30"],
    http_reqs: ["rate>4"],
    vus: ["value>1"],
    checks: ["rate>=0.98"],
  },
};

export default function () {
  const res = http.get(
    "https://test.k6.io/" + (exec.scenario.iterationInTest === 1 ? "foo" : "")
  );
  //console.log();
  check(res, {
    "Status is 200": (r) => r.status === 200,
    "Page is start page": (r) =>
      r.body.includes(
        "Collection of simple web-pages suitable for load testing."
      ),
  });
  sleep(2);
}
