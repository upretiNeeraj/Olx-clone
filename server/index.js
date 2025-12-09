const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const sitemapRoute = require("./routes/sitemap.routes.js");
const compression = require("compression");


dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);

app.use(cors({
    origin: ["https://olx-clone-jade-nine.vercel.app", "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(compression());

app.use("/", sitemapRoute);
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/ads", require("./routes/ad.routes"));
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/messages", require("./routes/message.routes.js"));

app.get("/", (req, res) => {
    res.send("API Running ");
});

const port = process.env.PORT || 5001;

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: ["https://olx-clone-jade-nine.vercel.app", "*"],
        methods: ["GET", "POST"],
        credentials: true,
        transports: ["websocket"]
    },
    transports: ["websocket"],
    allowEIO3: true
});



io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("send_message", (msg) => {
        io.to(msg.chatId).emit("receive_message", msg);
    });

    socket.on("disconnect", () => {
        console.log(" User disconnected:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
