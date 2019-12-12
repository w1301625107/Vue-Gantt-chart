module.exports = {
  publicPath: "",
  css: { extract: false },
  outputDir: process.env.NODE_ENV === "DEMO" ? "demo/" : "dist/"
};
