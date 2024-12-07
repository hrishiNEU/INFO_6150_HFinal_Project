export const listenForChat = (socket, io) => {
    socket.on("chat", async (data, cb) => {
      const { message, sender, communityId } = data;
  
      if (!communityId) {
        socket.emit("error", "Community ID is required");
        return;
      }
  
      const community = await Community.findById(communityId);
      if (!community) {
        socket.emit("error", "Community not found");
        return;
      }
  
      const chat = await Chat.create({ message, sender, community: communityId });
  
      const populatedChat = await Chat.findById(chat._id).populate(
        "sender",
        "name email profileImage"
      );
  
      io.to(communityId).emit("chat", populatedChat);
  
      cb({
        status: "ok",
        message: "Message sent",
      });
    });
  
    socket.on("joinCommunity", (communityId) => {
      socket.join(communityId);
    });
  
    socket.on("leaveCommunity", (communityId) => {
      socket.leave(communityId);
    });
  };
  