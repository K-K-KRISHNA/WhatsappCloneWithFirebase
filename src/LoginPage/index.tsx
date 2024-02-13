import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import gooogle from "../assets/google.png";
import facebook from "../assets/Facebook.png";
import { Stack } from "@mui/system";
import Logo from "../assets/whatsappLogo.webp";
// import Logo from "../assets/background.jpeg";

import React, { useContext, useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { chatScreen, LoginPageStyles } from "../Styles";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { app, db } from ".././firebaseConfig";
import { Navigate, useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

interface Istate {
  passwordVisibility: boolean;
  data: {
    email: string;
    password: string;
    name: string;
  };
  isLoggedIn: boolean;
  activeLogin: boolean;
}

const LoginPage = () => {
  let auth = getAuth(app);
  let navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] =
    useState<Istate["passwordVisibility"]>(false);
  const [data, setData] = useState<Istate["data"]>({
    email: "",
    password: "",
    name: "",
  });
  const [activeLogin, setActiveLogin] = useState<Istate["activeLogin"]>(true);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const loginSubmission = async () => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        const { user } = response;
        localStorage.setItem("uid", user.uid);
        alert("Sign In Successful");
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const registerSubmission = () => {
    const Emailpattern = /.+@.+\.[A-Za-z]+$/;
    const passwordPattenrn =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (
      data.email.length === 0 ||
      data.name.length === 0 ||
      data.password.length === 0
    ) {
      alert("All fields are Mandatory..\nPlese fill all Details");
    } else if (!Emailpattern.test(data.email)) {
      alert("Invalid Email");
    } else if (!passwordPattenrn.test(data.password)) {
      alert(
        "password is of atlearst 8 character\ncontaining one Capital ,one Small\n one Special Character"
      );
    } else {
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((response) => {
          insertionInFirestore("", data.name, response.user.uid);
          alert("User Successfully Registered");
          setActiveLogin(true);
          setData({ name: "", email: "", password: "" });
        })
        .catch((error) => alert("User already Existed"));
    }
  };

  const googleSignin = () => {
    let provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((response) => {
        const { user } = response;
        localStorage.setItem("uid", user.uid);
        navigate("/");
        setActiveUser({ name: user.displayName!, photoUrl: user.photoURL! });
        insertionInFirestore(user.photoURL!, user.displayName!, user.uid);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const facebookSignin = () => {
    let provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((response) => {
        console.log(response);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const insertionInFirestore = (
    photoUrl: string,
    name: string,
    uid: string
  ) => {
    setDoc(doc(db, "users", uid), { name, photoUrl })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };

  const context = useContext(ChatContext);
  const { setActiveUser } = context;

  const token = localStorage.getItem("uid");
  console.log(serverTimestamp());
  const Home = <Navigate to="/" />;
  if (token !== null) return Home;

  return (
    <Stack
      sx={{
        ...chatScreen.container,
        ...LoginPageStyles.mainContainer,
      }}
    >
      <Stack alignItems={"center"} sx={{ display: { xs: "none", md: "flex" } }}>
        <Box component={"img"} src={Logo} sx={LoginPageStyles.logo} />
        <Typography variant="h3" sx={{ color: "white" }}>
          Whatsapp
        </Typography>
      </Stack>
      <Stack
        component={"form"}
        sx={LoginPageStyles.formHolder}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems="center" justifyContent={"center"}>
          <Typography variant="h6" color={"green"}>
            Welcome to Whatsapp{" "}
          </Typography>
          <Box
            component={"img"}
            src={Logo}
            sx={{
              width: "50px",
              height: "50px",
              visibility: { xs: "visible", md: "hidden" },
              alignSelf: "center",
            }}
          />
        </Stack>

        <Stack
          direction={"row"}
          sx={LoginPageStyles.buttonHolder}
          justifyContent={"center"}
          mt={2}
        >
          <Button
            variant={activeLogin ? "contained" : "text"}
            color="success"
            onClick={() => {
              setData({ email: "", password: "", name: "" });
              setActiveLogin(true);
            }}
          >
            Login
          </Button>
          <Button
            variant={!activeLogin ? "contained" : "text"}
            color="success"
            onClick={() => {
              setData({ email: "", password: "", name: "" });
              setActiveLogin(false);
            }}
          >
            Register
          </Button>
        </Stack>
        <Stack
          sx={{
            visibility: activeLogin ? "hidden" : "visible",
          }}
        >
          <Typography variant="body1">Name</Typography>
          <TextField
            variant="outlined"
            type="text"
            placeholder="Enter Your Name"
            value={data.name}
            name="name"
            onChange={changeHandler}
            sx={{
              width: { sm: "300px", xs: "200px" },
              "& fieldset": { border: "none" },
              color: "#546570",
            }}
            InputProps={{
              sx: {
                backgroundColor: "white",
                height: "40px",
                m: 1,
                ml: 0,
                border: "solid 2px green",
                outline: "none",
              },
            }}
          />
        </Stack>
        <Stack>
          <Typography variant="body1">Email</Typography>
          <TextField
            variant="outlined"
            type="text"
            placeholder="Enter Your Email"
            value={data.email}
            name="email"
            onChange={changeHandler}
            sx={{
              width: { sm: "300px", xs: "200px" },
              "& fieldset": { border: "none" },
              color: "#546570",
            }}
            InputProps={{
              sx: {
                backgroundColor: "white",
                height: "40px",
                m: 1,
                ml: 0,
                border: "solid 2px green",
                outline: "none",
              },
            }}
          />
        </Stack>
        <Stack>
          <Typography variant="body1">Password</Typography>
          <TextField
            variant="outlined"
            type={passwordVisibility ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={changeHandler}
            placeholder="Enter Your Password"
            sx={{
              width: { sm: "300px", xs: "200px" },
              "& fieldset": { border: "none" },
              color: "#546570",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordVisibility(!passwordVisibility)}
                  >
                    {passwordVisibility ? (
                      <RemoveRedEyeIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "white",
                height: "40px",
                m: 1,
                ml: 0,
                border: "solid 2px green",
                outline: "none",
              },
            }}
          />
        </Stack>
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={activeLogin ? loginSubmission : registerSubmission}
        >
          {activeLogin ? "Login" : "Register"}
        </Button>
        <Stack
          sx={{ visibility: activeLogin ? "visible" : "hidden" }}
          alignItems={"center"}
        >
          <Typography variant="h6" sx={{ color: "gray", mt: 2 }}>
            {" "}
            Or Continue With
          </Typography>
          <Stack direction={"row"}>
            <IconButton onClick={googleSignin}>
              <Box component={"img"} src={gooogle} />
            </IconButton>
            <IconButton onClick={facebookSignin}>
              <Box component={"img"} src={facebook} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
