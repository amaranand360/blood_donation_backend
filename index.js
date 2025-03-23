import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("Express + JavaScript Server");
// });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
