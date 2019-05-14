const Server = require("ada-cloud-hub/boot");
const config = require("./config");

let server = new Server();
server.on('started', () => {
    let { type, option } = config.provider;
    server.context.provider = new type(option);
});
server.startup();