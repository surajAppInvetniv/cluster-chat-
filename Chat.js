const express = require("express");
const app = express();

// Server config
const PORT_NUMBER = 4000;
const server = app.listen(PORT_NUMBER, () => {
  console.log(
    `Chat Server is running on ${PORT_NUMBER} Process ID: ${process.pid}`
  );
});

const io = require("socket.io").listen(server);

const fetch = require("node-fetch");
const redis = require("redis"),
  client = redis.createClient();

// Redis Adapter will automatically Handle all process or socket id in clustered Mode.
const redisAdapter = require("socket.io-redis");
io.adapter(redisAdapter({ host: "localhost", port: 6379 }));
// Redis Adapter will automatically Handle all process or socket id in clustered Mode.

// For User Interface of Chat Application
app.get("/chat/:userName", (requst, respone) => {
  respone.sendFile(__dirname + "/Public/index.html");
});

let connections = [];

// Geting UserDetail from API server (App.js) and Sending Back to the Client Html.
async function getUserData(socket) {
  try {
    let response = await fetch(
      `http://127.0.0.1:9000/userdetail?socketId=${socket.id}`
    );
    let jsonResponse = await response.json();
    return JSON.parse(jsonResponse.userDetail);
  } catch (err) {
    console.log(err.message);
  }
}

io.sockets.on("connection", socket => {
  connections.push(socket);
  console.log(`Connceted ${connections.length}`);

  // Join Private Room
  socket.on("join pv", pv => {
    console.log(pv);
    socket.join(pv.room1);
    socket.join(pv.room2);
  });

  // Getting Current User name from Client Side
  socket.on("current user", currentuser => {
    console.log(currentuser);
    client.set(socket.id, currentuser);
  });

  socket.on("send message", async (data, callback) => {
    console.log(data);

    let userDetail = await getUserData(socket);

    io.to(data.room).emit("new message", { msg: data.message, userDetail });
    callback();
  });

  socket.on("disconnect", data => {
    client.del(socket.id);
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected ${connections.length}`);
  });
});
