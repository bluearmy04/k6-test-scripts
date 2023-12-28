import http from "k6/http";
import { sleep } from "k6";
import { Counter, Trend } from "k6/metrics";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  vus: 10,
  duration: "15s",
  thresholds: {
    http_req_duration: ["p(95)<400"],
    my_counter: ["count>40"],
    news_page_response_time: ["p(95)<400", "p(99)<450"],
  },
};

let myCounter = new Counter("my_counter");
let newsPageResponseTrend = new Trend("news_page_response_time");

export default function () {
  let res = http.get("https://test.k6.io/");
  myCounter.add(1);
  sleep(randomIntBetween(1, 5));

  res = http.get("https://test.k6.io/news.php");
  newsPageResponseTrend.add(res.timings.duration);
}
