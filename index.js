import {app } from "./src/app.js";
import {APP_PORT} from "./src/config/index.js";
import connectDB from "./src/db/index.js";


connectDB()
.then(() => {
    app
    .listen(
        APP_PORT,
        () => console.log(`Server is running at port : ${APP_PORT}.`)
    )
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});

