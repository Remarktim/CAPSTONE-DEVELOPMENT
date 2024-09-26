module.exports = {
  content: ["./templates/**/*.html", "./static/**/*.js", "./static/**/*.css", "node_modules/preline/dist/*.js", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin", "flowbite/plugin")],
  purge: ["./templates/**/*.html", "./static/js/**/*.js"],
};
