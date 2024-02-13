import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface singleUser {
  name: string;
  photoUrl: string;
  uid: string;
}

interface eachMessage {
  text: string;
  type: string;
  uid: string;
  time: string;
}

interface ContextType {
  activeUser: { name: string; photoUrl: string };
  setActiveUser: Dispatch<SetStateAction<{ name: string; photoUrl: string }>>;
  activeChatUser: singleUser;
  setActiveChatUser: Dispatch<SetStateAction<singleUser>>;
  activeUserChatList: eachMessage[];
  setActiveUserChatList: Dispatch<SetStateAction<eachMessage[]>>;
}

export const ChatContext = createContext<ContextType>({} as ContextType);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeUser, setActiveUser] = useState<ContextType["activeUser"]>({
    name: "",
    photoUrl: "",
  });
  const [activeChatUser, setActiveChatUser] = useState<singleUser>(
    {} as singleUser
  );
  const [activeUserChatList, setActiveUserChatList] = useState<eachMessage[]>(
    []
  );
  return (
    <ChatContext.Provider
      value={{
        activeUser,
        setActiveUser,
        activeChatUser,
        setActiveChatUser,
        activeUserChatList,
        setActiveUserChatList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
