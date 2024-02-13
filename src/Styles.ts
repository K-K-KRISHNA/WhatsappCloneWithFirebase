import pic from "./assets/chatBg.jpg";
import loginBg from "./assets/backgoundpic.avif";
export const BackgroundStyles = {
  mainContainer: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: "0px",
    zIndex: -1,
  },
  greenBg: {
    height: "25vh",
    backgroundColor: "#1fa884",
  },
  grayBg: {
    height: "75vh",
    backgroundColor: "#e5e3de",
  },
};

export const chatScreen = {
  container: {
    width: "90vw",
    height: "90vh",
    marginLeft: "5vw",
    marginRight: "5vw",
    marginTop: "5vh",
    marginBottom: "5vh",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
  },
};

export const contactsScreen = {
  container: {
    width: { xs: "100%", md: "35%" },
    backgroundColor: "white",
    height: "100%",
    // visibility: "hidden",
  },
  header: {
    height: "10%",
    backgroundColor: "#f0f2f5",
  },
  picSizing: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
  },
  active: {
    backgroundColor: "#f0f2f5",
  },
};

export const conversationScreen = {
  container: {
    width: { xs: "100%", md: "65%" },
    backgroundImage: `url(${pic})`,
    height: "100%",

    // overflow: "hidden",
  },
  header: {
    minHeight: "10%",
    maxHeight: "fit-content",
    backgroundColor: "#f0f2f5",
  },
  chatHolder: {
    backgroundImage: `url(${pic})`,
    backgroundSize: "cover",
    height: "80%",
    overflow: "auto",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  incoming: {
    backgroundColor: "#faf9ed",
    margin: 1,
    padding: 1,
    width: "fit-content",
    borderRadius: "0px 20px 20px 20px",
  },
  outgoing: {
    backgroundColor: "#d9fdd3",
    margin: 1,
    padding: 1,
    width: "fit-content",
    borderRadius: "20px 20px 0px 20px",
    alignSelf: "flex-end",
  },
};

export const LoginPageStyles = {
  mainContainer: {
    backgroundColor: "#26c943",
    // backgroundImage: `url(${loginBg})`,

    borderRadius: 5,
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-around",
    alignItems: "center",
  },
  logo: {
    display: { xs: "none", md: "flex" },
    width: { xs: "100px", md: "250px" },
    height: { xs: "100px", md: "250px" },
  },
  formHolder: {
    width: { md: "40%", xs: "80%" },
    borderRadius: 10,
    backgroundColor: "white",
    padding: 3,
  },
  buttonHolder: {
    // border: "solid 2px green",
    width: "100%",
    borderRadius: 2,
  },
};
