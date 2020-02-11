#!/usr/bin/env node

const { resolve: pathResolve } = require("path");
const { readdirSync } = require("fs");
const { spawn } = require("tap");

console.log(`tap --no-coverage --timeout=60 test/unit/*-test.js`);
spawn("tap", ["--no-coverage", "--timeout=60", "test/unit/*-test.js"], {
  name: "unit tests",
  env: { PATH: process.env.PATH }
  //     ^ might be unnecessary in ci?
});

const apis = readdirSync(pathResolve(__dirname, "..", "openapi"));
for (const api of apis) {
  const GHE_VERSION = api.replace(/^ghe-(\d+\.\d+)$/, "$1") || null;
  console.log(
    `${
      GHE_VERSION ? `GHE_VERSION=${GHE_VERSION} ` : ""
    }tap --no-coverage --timeout=60 test/unit/*-test.js`
  );
  spawn(
    "tap",
    ["--no-coverage", "--timeout=60", "test/integration/*-test.js"],
    {
      name: `${api} integration tests`,
      env: { GHE_VERSION: GHE_VERSION, PATH: process.env.PATH }
      //                               ^ might be unnecessary in ci?
    }
  );
}
