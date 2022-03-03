const Response = require('./Response');

class View {
  constructor(isSsr, template) {
    this.isSsr = isSsr;
    this.template = template;
    this.httpCode = false;
    this.resp = new Response();
  }
}

module.exports = View;
