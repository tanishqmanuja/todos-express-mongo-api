/*
 * @type {import('prettier').Options}
 */
module.exports = {
  ...require("@tqman/prettier-config"),
  importOrder: ["^~/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
