const Response = require('./Response');

class View {
  constructor(isSsr, template) {
    this.isSsr = isSsr;
    this.template = template;
    this.httpStatusCode = false;
    this.resp = new Response();
  }
}

module.exports = View;
