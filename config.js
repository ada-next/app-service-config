const GitProvider = require("./lib/provider/types/git");
const path = require("path");

const config = {
    provider: {
        type: GitProvider,
        option: {
            git: 'https://github.com/ada-next/app-config.git',
            branch: 'master',
            local: '/Users/wangjinliang/adanext/config'
        }
    }
};

module.exports = config;