import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import "./config/passportConfig";
import passportConfig from "./config/passportConfig";
import authenticateUser from "./middlewares/authMiddleware";
import audienceRoutes from "./routes/audienceRoutes";
import authRoutes from "./routes/authRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import customerRoutes from "./routes/customerRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import messageRoutes from "./routes/messageRoutes";
import orderRoutes from "./routes/orderRoutes";
import { connectDB } from "./utils/connectDB";

dotenv.config();
const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

app.use("/api", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", orderRoutes);
app.use("/api", deliveryRoutes);

app.use("/api", authenticateUser, audienceRoutes);
app.use("/api", authenticateUser, campaignRoutes);
app.use("/api", authenticateUser, messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
