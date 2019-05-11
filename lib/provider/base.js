class BaseProvider {
    constructor(option) {
        this._option = option;
    }

    get option() {
        return this._option;
    }

    update() { }

    get(path) {
    }
}

module.exports = BaseProvider;