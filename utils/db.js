const mongoose = require("mongoose")
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("connection to db established"));