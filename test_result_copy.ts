{
  "config": {
    "BASE_URL": "https://api.whatsmiau.dev",
    "INSTANCE_NAME": "bruno-online"
  },
  "tests": {
    "list": {
      "ok": true,
      "status": 200,
      "data": null
    },
    "connection": {
      "ok": false,
      "status": 404,
      "data": "Cannot GET /evolution/instance/connectionState/bruno-online"
    },
    "sendMessage": {
      "ok": false,
      "status": 500,
      "data": {
        "error": "instance not found or not owned by user"
      }
    }
  }
}