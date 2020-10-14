// package: 
// file: my-proto.proto

var my_proto_pb = require("./my-proto_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MyService = (function () {
  function MyService() {}
  MyService.serviceName = "MyService";
  return MyService;
}());

MyService.MessageFile = {
  methodName: "MessageFile",
  service: MyService,
  requestStream: false,
  responseStream: false,
  requestType: my_proto_pb.MessageFileRequest,
  responseType: my_proto_pb.MessageFileResponse
};

MyService.Event = {
  methodName: "Event",
  service: MyService,
  requestStream: false,
  responseStream: true,
  requestType: my_proto_pb.EventRequest,
  responseType: my_proto_pb.EventResponse
};

exports.MyService = MyService;

function MyServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MyServiceClient.prototype.messageFile = function messageFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MyService.MessageFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MyServiceClient.prototype.event = function event(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(MyService.Event, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.MyServiceClient = MyServiceClient;

