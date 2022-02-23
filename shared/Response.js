class Response {
  constructor() {
    this.oper = {
      status: 'success',
      message: null
    };
    this.payload = null;
  }

  setOperStatus(status = 'success') {
    this.oper.status = status;
  }

  setOperMessage(message = null) {
    this.oper.message = message;
  }

  setPayload(payload = null) {
    this.payload = payload;
  }
}

Response.OperStatus = {};
Response.OperStatus.SUCCESS = 'success';
Response.OperStatus.FAILED = 'failed';

module.exports = Response;
