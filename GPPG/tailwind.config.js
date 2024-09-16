module.exports = {
  content: ["./templates/**/*.html", "./node_modules/preline/dist/*.js", "/static/js/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin")],
};
