let io;
const currentUrl = "http://localhost:8080"
// const currentUrl = "http://localhost:3000"
// const currentUrl = "https://ammarshop.herokuapp.com/"
module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer,{
        cors: {
          // origin: "http://localhost:8081",
          origin: currentUrl,
          methods: ["GET", "POST"]
            
        }
    })
    return io;
  },
  getIO: () => {
      console.log('started with socket');
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
