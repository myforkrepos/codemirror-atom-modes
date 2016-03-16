function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __browser_json = require.resolve("./browser.json"),
      __loadTag = __helpers.t,
      lasso_page = __loadTag(require("lasso/taglib/page-tag")),
      lasso_head = __loadTag(require("lasso/taglib/head-tag")),
      lasso_body = __loadTag(require("lasso/taglib/body-tag"));

  return function render(data, out) {
    lasso_page({
        packagePath: __browser_json,
        dirname: __dirname,
        filename: __filename
      }, out);

    out.w("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Document</title>");

    lasso_head({}, out);

    out.w("</head><body><textarea id=\"code\">\n<!DOCTYPE html>\nhtml lang=\"en\"\n    head\n        title - Marko Templating Engine\n    body\n        h1 - Hello ${data.name}!\n        ul if(notEmpty(data.colors))\n            li for(color in data.colors)\n                ${color}\n        div else\n            - No colors!\n</textarea>");

    lasso_body({}, out);

    out.w("</body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
