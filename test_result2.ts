{
  "config": {
    "BASE_URL": "https://api.whatsmiau.dev",
    "INSTANCE_NAME": "bruno-online"
  },
  "steps": {
    "create": {
      "ok": false,
      "status": 400,
      "data": {
        "error": "instance limit reached for your plan (1/1)"
      }
    },
    "list": {
      "ok": true,
      "status": 200,
      "data": [
        {
          "id": "69a4b6e99cf22707df138d3d",
          "user_id": "69a085d94b65a18e92679e64",
          "whatsmiau_instance_id": "bruno-online_92679e64",
          "webhook_url": "",
          "webhook_events": null,
          "reject_call": false,
          "always_online": false,
          "read_messages": false,
          "sync_full_history": false,
          "read_status": false,
          "suspended": false,
          "status": "DISCONNECTED",
          "created_at": "2026-03-01T22:00:09.577Z"
        }
      ]
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