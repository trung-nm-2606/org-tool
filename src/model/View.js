const Response = require('./Response');

class View {
  constructor(isSsr = false, template = '') {
    this.isSsr = isSsr;
    this.template = template;
    this.httpCode = false;
    this.resp = new Response();
  }
}

module.exports = View;
