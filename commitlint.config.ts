export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "revert"],
    ],
    "scope-enum": [2, "always", ["fs", "rpc", "deps"]],
  },
};
