class Response {
  constructor() {
    this.oper = {
      status: 'success',
      message: null,
      code: null
    };
    this.payload = null;
  }

  setOperStatus(status = 'success') {
    this.oper.status = status;
  }

  setOperMessage(message = null) {
    this.oper.message = message;
  }

  setOperStatusCode(code = null) {
    this.oper.code = code;
  }

  setPayload(payload = null) {
    this.payload = payload;
  }
}

Response.OperStatus = {};
Response.OperStatus.SUCCESS = 'success';
Response.OperStatus.FAILED = 'failed';

module.exports = Response;
