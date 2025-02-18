const mongoose = require("mongoose");
require("dotenv").config();

const options = {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    dbName: "issue-tracker",
};

main().catch((err) => console.error(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("DB connection success");
}
