const Router = require("koa-router");
const router = new Router();

router.get('/test', ({ response }) => {
    response.body = { code: 0, data: 'test response' };
});
router.get('/get', ({ request, response, provider, result }) => {
    let { path } = request.query;
    return provider.get(path).then(content => {
        response.body = JSON.stringify(result.getSuccessResult(JSON.parse(content)).getResponseData());
    }).catch(e => {
        response.body = JSON.stringify(result.getErrorResult().getResponseData());
    });
});
router.get('/update', ({ channel, response, provider, result }) => {
    return provider.update().then(() => {
        return channel.postBroadcastMessage('cloud-config-change').then(() => {
            response.body = JSON.stringify(result.getSuccessResult().getResponseData());
        }).catch(e => {
            response.body = JSON.stringify(result.getErrorResult().getResponseData());
        });
    });
});

module.exports = router;