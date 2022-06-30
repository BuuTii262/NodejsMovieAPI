require("dotenv").config();

const http = require("http");
const app = require("./app");

const server = http.createServer(app);
server.close();

server.listen(process.env.PORT);

server.on("listening", () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});