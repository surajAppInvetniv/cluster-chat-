const express = require("express");
const app = express();
const redis = require("redis"),
  client = redis.createClient({ host: "localhost", port: 6379 });

app.use(express.json());

// User Sign Up and Stored in Redis
app.post("/signup", (req, res) => {
  let { name, username, age, email } = req.body;
  let userdetail = {};
  userdetail.name = name;
  userdetail.username = username;
  userdetail.age = age;
  userdetail.email = email;
  client.set(username, JSON.stringify(userdetail));
  return res.status(200).json({
    message: "added successfully"
  });
});

// Internal API for Chat Server

// To Get User Detail from Redis and Send Back to the Chat Server.
app.get("/userdetail", (req, res) => {
  let socketId = req.query.socketId; // Getting SocketId from chat server
  client.get(socketId, (err, username) => {
    // Fetching Username by socketId from redis.
    client.get(username, (err, userDetail) => {
      // From Username getting User Details from redis.
      res.status(200).json({
        userDetail
      });
    });
  });
});

//              For Testing Purpose.
// To Get User Detail from Redis and Sed Back to Client
app.get("/user", (req, res) => {
  console.log("hello");
  let username = req.query.username;

  client.get(username, (err, userDetail) => {
    if (err) console.log(err.message);

    // From Username getting User Details from redis.
    res.status(200).json({
      userDetail: JSON.parse(userDetail),
      processId: process.pid
    });
  });
});

app.get("/test", (req, res) => {
  res.send("Okay Tested");
});
app.get("/", (req, res) => {
  res.status(200).json({
    data: "req.query.name"
  });
});
// Server configuration
const PORT_NUMBER = 9000;
app.listen(PORT_NUMBER, () => {
  console.log(
    `App Server is running on ${PORT_NUMBER} Process ID: ${process.pid}`
  );
});
