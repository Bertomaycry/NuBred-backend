import { execSync } from "child_process";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

let currentBranch = "main";
try {
  currentBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
} catch (err) {
  console.error("Error determining git branch, defaulting to 'main':", err);
}


let envFile = ".env.prod"; 
if (currentBranch === "dev") envFile = ".env.dev";
else if (currentBranch === "qa") envFile = ".env.qa";

dotenv.config({ path: envFile });

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ Error connecting DB: ${error}`);
  });
