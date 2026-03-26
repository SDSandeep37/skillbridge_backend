import * as CodeSnapshotController from "../controllers/codeSnapShotsController.js";

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
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
