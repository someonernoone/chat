import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
//import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Stack, Avatar, Box, Modal, InputBase } from "@mui/material";
import PrimarySearchAppBar from "../components/Header";
//import SearchIcon from "@mui/icons-material/Search";

import {
  getUserAction,
  addUserChat,
  removeUserChat,
} from "../store/actions/userAction";
import axios from "../store/axios";
import Group from "../components/Group"

const Home = () => {
  const nevigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  const userChat = useSelector((state) => state.select);
  const [search, setSearch] = useState(false);
  const [group, setGroup] = useState(false);
  const [searchValue, setSearchValue] = useState([]);
  const [searchInp, setSearchInp] = useState("");
  const [allUser, setAllUser] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      nevigate("/login")
      return;
    }
    

    dispatch(getUserAction());
    dispatch(removeUserChat());
    console.log(userChat);
    axios.get("/chats").then((res) => {
      setAllUser(res.data);
    });

    //;
  }, [dispatch, nevigate]);

  const findUser = async(e) => {
    setSearchInp(e.target.value);
    let res = await axios
      .get(`/user/find?search=${e.target.value}`)
      .then((res) => {
        setSearchValue(res.data);        
      })
      .catch((err) => {
      });

    
  }

  
  const chatOpen = (item) => {
    dispatch(addUserChat(item));
    nevigate("/chat");
  };

  return (
    <>
      {!user ? (
        <div>loading....</div>
      ) : (
        <div>
          <PrimarySearchAppBar />
          <div
            className="p-2 rounded bg-grey-300"
            onClick={() => setGroup(true)}
          >
            create group
          </div>
          {group && <Group group={group} setGroup={setGroup} />}} 
          {/*<Modal open={search} onClose={() => setSearch(false)}>
        <Box className=" mx-auto py-2 mt-20 max-w-[300px] bg-white flex flex-col justify-center items-center">
          <label className="relative pb-2 block">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 20 20"></svg>
            </span>
            <input
              className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for anything..."
              type="text"
              name="search"
              onChange={(e) => findUser(e)}
            />
          </label>

          <Stack style={{ width: "100%" }} spacing={2}>
            {searchValue.length <= 0 ? (
              searchInp.length < 1 ? (
                <div>Please Enter user names</div>
              ) : (
                <div>Users not found</div>
              )
            ) : (
              searchValue.map((item) => {
                return (
                  <div key={item._id} className="w-full flex hover:text-white hover:bg-blue-200 font-bold p-2 w-full justify-between">
                    <div className="flex items-center w-full">
                      <div className="">
                        <Avatar />
                      </div>
                      <div className="px-2 font-size-md">{item.name}</div>
                    </div>
                    <div className="">
                      <MoreVertIcon />
                    </div>
                  </div>
                );
              })
            )}
          </Stack>
        </Box>
      </Modal>*/}
          <div>
            {allUser.length <= 1 ? (
              <div>less yhan one</div>
            ) : (
              allUser.map((item) => {
                return (
                  <div
                    onClick={() => chatOpen(item)}
                    key={item._id}
                    className="w-full flex hover:text-white hover:bg-blue-200 font-bold p-2 w-full justify-between"
                  >
                    <div className="flex items-center w-full">
                      <div className="">
                        <Avatar />
                      </div>
                      <div className="px-2 font-size-md">
                        {item.isGroup
                          ? item.chatName
                          : item.users[0]._id === user.user._id
                            ? item.users[1].name
                            : item.users[0].name}{" "}
                      </div>
                    </div>
                    <div className="">
                      <MoreVertIcon />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
