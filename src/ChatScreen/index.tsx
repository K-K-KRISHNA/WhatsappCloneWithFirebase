import {
  Button,
  Icon,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { chatScreen, contactsScreen, conversationScreen } from "../Styles";
import SendIcon from "@mui/icons-material/Send";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import AdjustIcon from "@mui/icons-material/Adjust";
import AddCommentIcon from "@mui/icons-material/AddComment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { EachContact } from "../EachContact";
import { getAuth, signOut } from "firebase/auth";
import { app, db } from "../firebaseConfig";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import webPic from "../assets/webWhatsapp.png";
import { ChatContext } from "../context/ChatContext";

interface singleUser {
  name: string;
  photoUrl: string;
  uid: string;
}

const MessageBox = () => {
  const [messageBody, setMessageBody] = useState("");
  const { activeChatUser, activeUserChatList, setActiveUserChatList } =
    useContext(ChatContext);
  const uid = localStorage.getItem("uid")!;

  const sendingMessage = () => {
    const time = new Date(Date.now()).toLocaleString();
    const updateData = [
      ...activeUserChatList,
      {
        text: messageBody,
        type: "SENT",
        uid: activeChatUser.uid,
        time: new Date(Date.now()).toLocaleString(),
      },
    ];
    setDoc(doc(db, "messages", uid), { messages: updateData })
      .then((res) => console.log("message Sent", res))
      .catch((error) => console.log("message not sent", error));
    getDoc(doc(db, "messages", activeChatUser.uid))
      .then((response) => {
        if (response.exists()) {
          let othersChatData = response.data().messages;
          setDoc(doc(db, "messages", activeChatUser.uid), {
            messages: [
              ...othersChatData,
              {
                text: messageBody,
                type: "RECEIVED",
                uid: uid,
                time: time,
              },
            ],
          })
            .then((response) =>
              console.log("date inserted into others chat history", response)
            )
            .catch((error) =>
              console.log("not inserted in others account", error)
            );
        } else {
          setDoc(doc(db, "messages", activeChatUser.uid), {
            messages: [
              {
                text: messageBody,
                type: "RECEIVED",
                uid: uid,
                time: time,
              },
            ],
          })
            .then((response) =>
              console.log("date inserted into others chat history", response)
            )
            .catch((error) =>
              console.log("not inserted in others account", error)
            );
        }
      })
      .catch((error) => console.log("not retrived the others data"));
    setActiveUserChatList(updateData);
    setMessageBody("");
  };
  return (
    <>
      <TextField
        variant="outlined"
        placeholder="Type a message"
        sx={{
          width: "80%",
          "& fieldset": { border: "none" },
          backgroundColor: "white",
        }}
        InputProps={{
          sx: {
            backgroundColor: "white",
            height: "30px",
            m: 1,
            outline: "none",
          },
        }}
        value={messageBody}
        onChange={(e) => setMessageBody(e.target.value)}
      />
      <Stack direction={"row"} spacing={1}>
        <IconButton onClick={sendingMessage}>
          <SendIcon sx={{ fontSize: "30px", color: "#1f9688" }} />
        </IconButton>
        <IconButton>
          <MicIcon sx={{ fontSize: "30px", color: "#546570" }} />
        </IconButton>
      </Stack>
    </>
  );
};

const ChatScreen = () => {
  let navigate = useNavigate();
  const context = useContext(ChatContext);
  const [otherUsers, setOtherUsers] = useState([]);
  const {
    setActiveUser,
    activeUser,
    activeChatUser,
    setActiveChatUser,
    activeUserChatList,
    setActiveUserChatList,
  } = context;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [mobileActiveScreen, setMobileActiveScreen] =
    useState<string>("contact");
  const [receiver, setReceiver] = useState<number>(-1);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickContact = (user: singleUser) => {
    setMobileActiveScreen("chat");
    setReceiver(1);
    setActiveChatUser(user);
  };

  const gettingData = async () => {
    let uid = localStorage.getItem("uid")!;
    const userCollection = collection(db, "users");
    const othersData = await getDocs(userCollection);
    let data: any = [];
    othersData.forEach((doc) => {
      if (doc.id !== uid) {
        data.push({ ...doc.data(), uid: doc.id });
      }
    });
    setOtherUsers(data);
    try {
      const dataRef = await getDoc(doc(db, "users", uid));
      console.log(dataRef.data());
      if (dataRef.exists()) {
        let userDetails = dataRef.data();
        setActiveUser({
          name: userDetails?.name,
          photoUrl: userDetails?.photoUrl,
        });
      }
    } catch (error) {
      console.log(error);
    }
    getDoc(doc(db, "messages", uid)).then((dataRef) => {
      if (dataRef.exists()) {
        setActiveUserChatList(dataRef.data().messages);
      } else {
        console.log("data not exitsted");
        setDoc(doc(db, "messages", uid), { messages: [] })
          .then((response) => {
            setActiveUserChatList([]);
          })
          .catch((error) => console.log(error.mesaage));
      }
    });
  };

  useEffect(() => {
    gettingData();
    const unsub = onSnapshot(
      doc(db, "messages", localStorage.getItem("uid")!),
      (doc) => {
        console.log(doc.data());
        if (doc.data() !== undefined)
          setActiveUserChatList(doc.data()?.messages);
      }
    );
    return () => unsub();
  }, []);

  const filteredMessages = activeUserChatList.filter(
    (each) => each.uid === activeChatUser.uid
  );

  return (
    <Box sx={chatScreen.container}>
      <Box
        sx={{
          ...contactsScreen.container,
          display: {
            md: "block",
            xs: mobileActiveScreen === "contact" ? "block" : "none",
          },
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          px={2}
          alignItems={"center"}
          sx={contactsScreen.header}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Box
              component={"img"}
              src={activeUser.photoUrl}
              sx={contactsScreen.picSizing}
            />
            <Typography>{activeUser.name}</Typography>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <IconButton>
              <GroupsIcon
                sx={{
                  fontSize: "25px",
                  color: "#546570",
                  display: { xs: "none", md: "block" },
                }}
              />
            </IconButton>
            <IconButton>
              <AdjustIcon sx={{ fontSize: "25px", color: "#546570" }} />
            </IconButton>
            <IconButton>
              <AddCommentIcon sx={{ fontSize: "25px", color: "#546570" }} />
            </IconButton>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon sx={{ fontSize: "25px", color: "#546570" }} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  let auth = getAuth(app);
                  localStorage.removeItem("uid");
                  signOut(auth);
                  navigate("/login");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          height={"8%"}
          alignItems={"center"}
        >
          <TextField
            variant="outlined"
            placeholder="search or start new chat"
            sx={{
              width: "80%",
              "& fieldset": { border: "none" },
              color: "#546570",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "25px", color: "#546570" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#f0f2f5",
                height: "30px",
                m: 1,
                outline: "none",
              },
            }}
          />
          <IconButton>
            <FilterListIcon sx={{ fontSize: "25px" }} />
          </IconButton>
        </Stack>
        <Stack sx={{ overflowY: "scroll", height: "82%" }}>
          {otherUsers.map(
            (
              each: { name: string; photoUrl: string; uid: string },
              index: number
            ) => {
              return (
                <Stack
                  key={index}
                  onClick={() => onClickContact(each)}
                  sx={{ cursor: "pointer" }}
                >
                  <EachContact personData={each} />
                </Stack>
              );
            }
          )}
        </Stack>
      </Box>
      {receiver !== -1 ? (
        <Box
          sx={{
            ...conversationScreen.container,
            display: {
              md: "block",
              xs: mobileActiveScreen === "chat" ? "block" : "none",
            },
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            px={2}
            alignItems={"center"}
            sx={conversationScreen.header}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                sx={{ display: { md: "none" } }}
                onClick={() => setMobileActiveScreen("contact")}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box
                component={"img"}
                src={activeChatUser.photoUrl}
                sx={contactsScreen.picSizing}
              />
              <Stack>
                <Typography>{activeChatUser.name}</Typography>
                <Typography variant="body2" sx={{ color: "green" }}>
                  ...typing
                </Typography>
              </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <IconButton>
                <SearchIcon sx={{ fontSize: "25px", color: "#546570" }} />
              </IconButton>
              <IconButton>
                <MoreVertIcon sx={{ fontSize: "25px", color: "#546570" }} />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={conversationScreen.chatHolder} justifyContent={"flex-end"}>
            {filteredMessages.map((each, index) => {
              if (each.type === "SENT")
                return (
                  <Stack sx={conversationScreen.outgoing} key={index}>
                    <Typography variant="body1">{each.text}</Typography>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={1}
                      alignSelf={"flex-end"}
                    >
                      <Typography
                        variant="body2"
                        sx={{ alignSelf: "flex-end" }}
                      >
                        {each.time}
                      </Typography>
                      <DoneAllIcon fontSize="small" />
                    </Stack>
                  </Stack>
                );
              return (
                <Stack sx={conversationScreen.incoming} key={index}>
                  <Typography variant="body1">{each.text}</Typography>
                  <Typography variant="body2" sx={{ alignSelf: "flex-end" }}>
                    {each.time}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            px={2}
            alignItems={"center"}
            sx={conversationScreen.header}
          >
            <Stack direction={"row"}>
              <IconButton>
                <TagFacesIcon sx={{ fontSize: "30px", color: "#546570" }} />
              </IconButton>
              <IconButton>
                <AddIcon sx={{ fontSize: "30px", color: "#546570" }} />
              </IconButton>
            </Stack>
            <MessageBox />
          </Stack>
        </Box>
      ) : (
        <Stack
          sx={{
            width: "65%",
            height: "100%",
            backgroundColor: "#f0f2f5",
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box component={"img"} src={webPic} />
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "gray" }}
          >
            Send and receive messages without keeping your phone online.
            <br />
            Use WhatsApp on upto 4 linked devices and 1 phone at the same time.
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default ChatScreen;
