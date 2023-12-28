import http from "k6/http";
import { check } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export default function () {
  const credentials = JSON.stringify({
    username: "test_" + randomString(8),
    password: "test",
  });

  http.post("https://test-api.k6.io/user/register/", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  let res = http.post("https://test-api.k6.io/auth/token/login/", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  let access = res.json().access;
  //console.log(access);

  res = http.post(
    "https://test-api.k6.io/my/crocodiles/",
    JSON.stringify({
      name: "Riyad croc",
      sex: "M",
      date_of_birth: "1940-10-28",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }
  );

  res = http.get("https://test-api.k6.io/my/crocodiles/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  let newCrocodileId = res.json()[0].id;
  res = http.get(`https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  check(res, {
    "is status 200:": (r) => r.status === 200,
  });

  res = http.put(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
    JSON.stringify({
      name: "Updated Riyad croc",
      sex: "M",
      date_of_birth: "1940-10-28",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }
  );

  res = http.patch(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
    JSON.stringify({
      sex: "F",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }
  );

  res = http.del(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }
  );

  check(res, {
    "is status 204:": (r) => r.status === 204,
  });
}
