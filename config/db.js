import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://anandamar475:Vmzd8urqps9l3lFj@cluster0.tvak2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://ashraf:ashraf2024@cluster0.tvak2.mongodb.net/bloodDb?retryWrites=true&w=majority");
        console.log(
            `MongoDB connected => Host: ${connect.connection.host}:${connect.connection.port}, Database: ${connect.connection.name}`
        );
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
