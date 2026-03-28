import * as CodeSnapshotController from "../controllers/codeSnapShotsController.js";
import { loadMessage, saveMessage } from "../controllers/messagesController.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    //join one to one sesssion
    socket.on("join-session", async (sessionId) => {
      socket.join(sessionId);
      const code = await CodeSnapshotController.loadCode(sessionId);
      socket.emit("load-code", code);
      console.log(`${socket.id} joined ${sessionId}`);
    });

    //when user edits code
    socket.on("code-change", async ({ sessionId, code }) => {
      await CodeSnapshotController.saveCode(sessionId, code);
      socket.to(sessionId).emit("code-update", code);
    });

    // this is for cursor sync
    socket.on(
      "cursor-move",
      ({ sessionId, name, lineNumber, column, senderId }) => {
        socket.to(sessionId).emit("cursor-update", {
          name,
          lineNumber,
          column,
          senderId,
        });
      },
    );
    // for chat message
    socket.on("send-message", async ({ sessionId, message, sender_id }) => {
      const savedMessage = await saveMessage(sessionId, message, sender_id);
      io.to(sessionId).emit("receive-message", savedMessage);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
