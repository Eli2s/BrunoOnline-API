{
  "config": {
    "BASE_URL": "https://api.whatsmiau.dev",
    "INSTANCE_NAME": "bruno-online_92679e64"
  },
  "steps": {
    "connect": {
      "ok": false,
      "status": 500,
      "data": {
        "error": "invalid instance id"
      }
    },
    "connectionState": {
      "ok": false,
      "status": 404,
      "data": "Cannot GET /evolution/instance/connectionState/bruno-online_92679e64"
    },
    "sendMessage": {
      "ok": false,
      "status": 500,
      "data": {
        "error": "whatsmiau error: {\"error\":[{}],\"message\":\"invalid request body\",\"errorMessage\":\"Key: 'SendTextRequest.Text' Error:Field validation for 'Text' failed on the 'required' tag\"}\n"
      }
    }
  }
}