const Server = require("ada-cloud-boot");
const config = require("./config");
const router = require("./src/router");

let server = new Server();
server.use(router.routes());
server.on('started', () => {
    let { type, option } = config.provider;
    server.context.provider = new type(option);
});
server.startup();