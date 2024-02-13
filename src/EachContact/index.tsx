import { Box, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useContext } from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { contactsScreen } from "../Styles";
import { ChatContext } from "../context/ChatContext";

export const EachContact = ({
  personData,
}: {
  personData: { name: string; photoUrl: string; uid: string };
}) => {
  const { activeChatUser } = useContext(ChatContext);

  return (
    <>
      <Divider />
      <Stack
        mx={1}
        sx={{
          backgroundColor: {
            md: activeChatUser.name === personData.name ? "#cfccc2" : "white",
          },
        }}
        p={1}
        py={2}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"}>
          <Box
            component={"img"}
            src={personData.photoUrl}
            sx={contactsScreen.picSizing}
          />
          <Stack mx={2}>
            <Typography variant="body1" sx={{ fontSize: "18px" }}>
              {personData.name}
            </Typography>
            <Stack direction={"row"} alignItems={"center"}>
              <DoneAllIcon fontSize="small" color="info" />
              <Typography variant="body2" sx={{ fontSize: "13px", ml: 1 }}>
                Recent Message
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Typography variant="body2">12:34 Pm</Typography>
      </Stack>
    </>
  );
};
