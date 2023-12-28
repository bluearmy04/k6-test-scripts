import http from "k6/http";
import { sleep } from "k6";

let projectID = __ENV.PROJECT_ID;

export const options = {
  vus: 10,
  duration: "20s",
  ext: {
    loadimpact: {
      projectID: projectID,
    },
  },
};

export default function () {
  http.get("https://test.k6.io");
  sleep(1);
}
