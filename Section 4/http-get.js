import http from "k6/http";
import { check } from "k6";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export default function () {
  let base_url = __ENV.BASE_URL;
  //console.log(base_url);
  let res = http.get(`${base_url}/public/crocodiles/`);
  let crocodiles = res.json();
  let crocodileids = crocodiles.map((item) => item.id);
  let crocodile_id = randomItem(crocodileids);
  let crodocdile_name = crocodiles[crocodileids.indexOf(crocodile_id)].name;
  res = http.get(`${base_url}/public/crocodiles/${crocodile_id}/`);

  //header properties
  console.log(res.headers.Allow);
  console.log(res.headers["Content-Type"]);

  check(res, {
    "is status 200": (r) => r.status === 200,
    "crocodile name": (r) => r.json().name === crodocdile_name,
  });
}
