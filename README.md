# Socket.io Cluster

Clustering Socket's Chat Server and Api Server.

## Libraries and Tech

1. Pm2 Js
2. Redis
3. Socket.io-redis (Redis Adapter)
4. Socket.io

### Setup

```bash
  npm i
  pm2 start App.js -i 2 // Number of cores or cluster
  pm2 start Chat.js -i 2
```

### Procedure to run.

```bash

  redis-server // starting redis server.

  POST Request on 'http://localhost:9000/signup'
  Body Data (application/json):
  {
	"name":"atul Kumar",
	"username":"atul",
	"age":10,
	"email":"atul@gmail.com"
}
{
	"name":"rajesh singh",
	"username":"rajesh",
	"age":10,
	"email":"atul@gmail.com"
}

And Use provided Nginx Configuration in Folder.

Open these Links in tabs:
  http://localhost:8000/chat/rajesh.atul
  http://localhost:8000/chat/atul.rajesh

Start Chatting!
```
