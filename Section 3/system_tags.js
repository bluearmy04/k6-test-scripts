import http from "k6/http";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<500"],
    "http_req_duration{status:200}": ["p(95)<500"],
    "http_req_duration{status:201}": ["p(95)<500"],
  },
};

export default function () {
  http.get("https://run.mocky.io/v3/0e185806-847d-4439-b762-e7775024e42f");
  http.get(
    "https://run.mocky.io/v3/0da2cf1c-3ea4-4e4a-af7c-70e022c0b928?mocky-delay=2000ms"
  );
}
