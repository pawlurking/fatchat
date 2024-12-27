import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({isUsersLoading: true});
    try {
      const res = await axiosInstance.get("/messages/users");
      set({users: res.data });

    } catch (error) {
      toast.error(error.response.data.message);

    } finally {
      set({isUsersLoading: false});

    }
  },

  getMessages: async(userID) => {
    set({isMessagesLoading: true});

    try {
      const res = await axiosInstance.get(`/messages/${userID}`);
      set({messages: res.data});
      
    } catch (error) {
      toast.error(error.response.data.message);

    } finally {
      set({isMessagesLoading: false});
    }
  },


  sendMessage: async (chatContentData) => {

    const {selectedUser, messages} = get()

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, chatContentData);


      // update new messages by retaining the prior messages & adding new message data to tail
      set({messages: [...messages, res.data]})

    } catch (error) {
      toast.error(error.response.data.message);
    }

  },

  subscribeToMessages: () => {
    const { selectedUser }= get();
    if (!selectedUser) {
      return;
    }

    const socket = useAuthStore.getState().socket;

    // optimize this one later
    socket.on("newMessage", (newMessage) => {
      // only update new messages when targetID is selected (selectedUser)
      if(newMessage.senderID !== selectedUser._id) {
        return;
      }

      set({
        messages: [...get().messages, newMessage],


      })
    })
  },

  // when logout/ call our window
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({selectedUser}),

}))
    
 