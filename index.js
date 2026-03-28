import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// for socket.io

import { createServer } from "http";
import { Server } from "socket.io";

import { initialiseDatabase } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import codeSnapshotRoutes from "./routes/codeSnapshotRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { socketHandler } from "./sockets/socketHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "http://10.16.0.240:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

//socket.io
// const server = http.createServer(app);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
// initiallise socket events
socketHandler(io);

// initialiseDatabase()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to initialize database", err);
//   });
initialiseDatabase()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/codesnap", codeSnapshotRoutes);
app.use("/api/chat", messageRoutes);
