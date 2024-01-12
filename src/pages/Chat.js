
import { Stack, Avatar, Box, Modal} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"
import Group from "../components/UpdateGroup";
import ChatModel from "../components/chatModel"
import axios from "../store/axios"
let socket, selectedChat

const Chat = ({ users }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.select);
  const { user: me } = useSelector((state) => state.login)
  const [model, setModel] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [update, setUpdate] = useState(false)
  const [message, setMessage] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [messageInput, setMessageInput] = useState("")


  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    socket = io("https://d618f0ea-cae1-4bd4-954e-88acbd42a1b8-00-2xza46xilhmbu.kirk.replit.dev/")
    socket.emit("setup", me.user)
    console.log(me.user)
    socket.on("connected", () => setSocketConnected(true));
    socket.emit("chat-join", user._id)
    /*socket.on("message received", (data) => {
      console.log("fggggg",data)
      setMessage([...message, data]);
    })
    //socket.on("typing", () => setIsTyping(true));
    //socket.on("stop typing", () => setIsTyping(false));*/
  });

  useEffect(() => {
    socket.on("message received", (data) => {
      console.log("fggggg",data)
      setMessage([...message, data]);
      /*if (
        !user || // if chat is not selected or doesn't match current chat
        user._id !== newMessageRecieved.sender._id
      ) {
        /*if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }*/
    });
  }); 

  const getMessage = async () => {
    try {
      const {data} = await axios.get(`/message/${user._id}`)

      setMessage(data.message)
      
    } catch (error) {
      
    }
    
  }

    const sendMessage = async(e) => {
    e.preventDefault()
    setMessageInput("")
    if (messageInput.length <= 0) {
      return;
    }
    try {
      const {data} = await axios.post('/message/', {content: messageInput, chatId: user._id})
      console.log(data)
      socket.emit("new message", data)
      setMessage([...message, data])
        
    } catch (error) {
      
    }
    
    }



  useEffect(() => {
    getMessage()
  }, [user])

  

  return (
    <>
      <Box className="py-4 px-2 flex justify-between">
        <div className="flex item-center text-red-900">
          <Avatar />
          <h1 className="font-size-xl font-bold">{user.chatName}</h1>
        </div>
        <div>
          <VisibilityIcon onClick={() => setUserInfo(true)} />
        </div>
      </Box>
      {user && user.isGroup && userInfo ? (
        <Modal open={userInfo} onClose={() => setUserInfo(false)}>
          <Box className=" mx-auto py-2 mt-20 border-0 outline-0 max-w-[300px] bg-white flex flex-col justify-center items-center">
            {model ? (
              <Group open={model} setModel={() =>setModel(false)} group={user} you={me} />
            ) : (
              <div>
                <div className="font-size-xl font-bold">Group Info</div>
                <div className="flex">
                  {user.users &&
                    user.users.map((user) => {
                      return (
                        <div
                          style={{ fontSize: "12px" }}
                          key={user._id}
                          className="p-[3px] text-white mx-1 bg-green-300 rounded"
                        >
                          {user.name} X
                        </div>
                      );
                    })}
                </div>
                <button className="p-2 bg-blue-300 text-white rounded" onClick={() => setModel(true)}>Update
                </button>
              </div>
            )}
          </Box>
        </Modal>
      ) : (
        <Modal open={userInfo} onClose={() => setUserInfo(false)}>
          <Box className=" mx-auto py-2 mt-20 border-0 outline-0 max-w-[300px] bg-white flex flex-col justify-center items-center">
            <Box className="flex flex-col justify-center items-center">
              <Avatar />
              <h1 className="font-bold font-size-xl">hii</h1>
            </Box>
          </Box>
        </Modal>
      )}

      {message && <ChatModel user={me.user}  message={message} />
    }
      <form onSubmit={(e) => sendMessage(e)} style={{ position: "fixed", bottom: "100px", left: "0" }}>
        <input value={messageInput} type="text" onChange={(e) => setMessageInput(e.target.value)} placeholder="Enter your message" />
        <SendIcon type="submit"/>
      </form>
    </>
  );
};

export default Chat;
