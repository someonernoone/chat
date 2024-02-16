const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

const mongodb = require("./config/mongodb")
const user = require("./routers/userRouter")
const message = require("./routers/messageRouter")
const error = require("./middlewares/error")
const chat = require("./routers/chatRouter")

dotenv.config({ path: "./config/dot.env"})
mongodb()
 
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/v1/user", user)
app.use("/api/v1/chats", chat)
app.use("/api/v1/message", message)

const port = process.env.PORT || 3000

//app.use(express.static(path.join(__dirname, "build")));


/*app.use("*", (req, res) => {
  res.send(path.join(__dirname, "build", "index.html"))
})*/

app.use(error)

const server = app.listen(port);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: "https://390b7529-ce2b-4ef0-bbd9-22706636885e-00-2a961754apq64.janeway.replit.dev/"
})

io.on("connection", (socket) => {

  socket.on("setup", (data) => {
    socket.join(data._id)
    socket.emit("connected")
  })

  socket.on("chat-join", (data)=> {
    socket.join(data)
  })

  socket.on("typing", ({user, me}) => {
    socket.in(user).emit("typing", me)
  });

  socket.on("stop typing", ({user, me}) => socket.in(user).emit("stop typing", me));


  socket.on("new message", (data) => {
    let chat = data.chat
    
    data.chat.users.forEach((user) => {
      if (data.sender._id === user._id)  return;
        socket.in(user._id).emit("message received", data);
    })
  })
})
