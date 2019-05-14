const { Controller } = require("ada-cloud-util/boost");

class ConfigController extends Controller {
    static configure = {
        actions: {
            get: { path: "/get" },
            update: { path: "/update" }
        }
    }

    get({ request, provider }) {
        let { path } = request.query;
        return provider.get(path).then(content => {
            return this.success(JSON.parse(content));
        });
    }
    update({ channel, provider }) {
        return provider.update().then(() => {
            return channel.postBroadcastMessage('cloud-config-change').then(() => {
                return this.success();
            });
        });
    }
}

module.exports = ConfigController;