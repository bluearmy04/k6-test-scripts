import http from "k6/http";
import { sleep } from "k6";
import exec from "k6/execution";

export const options = {
  vus: 10,
  duration: "60s",
};

export function setup() {
  let res = http.get("https://test.local.k6.io/status");
  if (res.error) {
    exec.test.abort("Setup failed: " + res.error);
  }
}

export default function () {
  http.get("https://test.local.k6.io/");
  sleep(1);
}
