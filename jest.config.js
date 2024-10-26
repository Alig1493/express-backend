/** @type {import('ts-jest').JestConfigWithTsJest} **/
console.log("INSIDE CONFIG JS")
const path = require("path");
require("dotenv").config()
module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};