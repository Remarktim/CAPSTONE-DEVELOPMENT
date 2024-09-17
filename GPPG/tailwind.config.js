module.exports = {
  content: ["./templates/**/*.html", "./static/**/*.js", "./static/**/*.css", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require("preline/plugin"),
    // Preline plugin for Tailwind
  ],
};
