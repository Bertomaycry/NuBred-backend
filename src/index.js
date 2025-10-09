import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { execSync } from "child_process";



const currentBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
console.log(`🟢 Current Git branch: ${currentBranch}`);

let envFile = ".env.prod";
if (currentBranch === "dev") envFile = ".env.dev";
else if (currentBranch === "qa") envFile = ".env.qa";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
      console.log(
        `Server is running on port http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(`Error connecting DB : ${error}`);
  });
