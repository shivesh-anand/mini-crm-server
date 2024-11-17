import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./config/passportConfig";
import audienceRoutes from "./routes/audienceRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import customerRoutes from "./routes/customerRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import messageRoutes from "./routes/messageRoutes";
import orderRoutes from "./routes/orderRoutes";
import { connectDB } from "./utils/connectDB";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", customerRoutes);
app.use("/api", orderRoutes);
app.use("/api", audienceRoutes);
app.use("/api", campaignRoutes);
app.use("/api", messageRoutes);
app.use("/api", deliveryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
