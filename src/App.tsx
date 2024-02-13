import React from "react";
import { Box, Typography } from "@mui/material";
import { BackgroundStyles } from "./Styles";
import ChatScreen from "./ChatScreen";

import "./App.css";
import LoginPage from "./LoginPage";
import { Routes, Route } from "react-router-dom";
import { ChatContextProvider } from "./context/ChatContext";
import { ProtectedRoute } from "./ProtectedRoute";
function App() {
  return (
    <ChatContextProvider>
      <Box sx={BackgroundStyles.mainContainer}>
        <Box sx={BackgroundStyles.greenBg}></Box>
        <Box sx={BackgroundStyles.grayBg}></Box>
      </Box>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ChatContextProvider>
  );
}

export default App;
