import {useChatStore} from "../store/useChatStore";
import {useEffect, useRef} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from "../store/useAuthStore";
import {reformatBubleTimestamp} from "../lib/utils";


const ChatContainer = () => {

  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore()
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {

    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({behavior: "smooth"});
    }
    
  }, [messages])

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () =>  unsubscribeFromMessages();

  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


  if(isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
      </div>
    )
  }

  // console.log(isMessagesLoading);


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}

            ref={messageEndRef}

            // className={`chat ${message.sender._id === authUser._id ? "chat-end" : "chat-start"}`}

            className={`chat ${message.senderID === authUser._id ? "chat-end" : "chat-start"}`}

          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                  src={
                    message.senderID === authUser._id ? authUser.avatar || "/avatar.png" : selectedUser.avatar || "/avatar.png"
                  } 
                  alt="user's avatar"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              {/* <time className="text-xs opacity-50 ml-1">
                {message.createdAt}
              </time> */}
              <time className="text-xs opacity-50 ml-1">
                {reformatBubleTimestamp(message.createdAt)}
              </time>
            </div>
            
            {/* showing the chat bubles */}
            <div className="chat-bubble flex flex-col">
              {
                message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )
              }

              {
                message.text && <p>{message.text}</p>
              }
            </div>
            
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer