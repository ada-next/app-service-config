const BaseProvider = require("./../base");
const child = require("child_process");
const { SyncFile, File } = require("ada-util");
const Path = require("path");

const util = {
    excute(path, parameters = []) {
        return new Promise((resolve, reject) => {
            child.exec(`git ${parameters.join(" ")}`, {
                encoding: "utf-8",
                cwd: path
            }, (error) => {
                if (error) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }
};

class GitExcutor {
    constructor({ git, local, branch }) {
        this._git = git;
        this._local = local;
        this._branch = branch;
        let fileName = git.split("/").pop().split(".")[0];
        this._respoPath = Path.resolve(local, `./${fileName}`);
        let f = new SyncFile(this._local);
        if (!f.exist) {
            f.make();
        }
    }

    get localPath() {
        return this._local;
    }

    get respoPath() {
        return this._respoPath;
    }

    get branch() {
        return this._branch;
    }

    get gitPath() {
        return this._git;
    }

    clone() {
        return util.excute(this.localPath, ['clone', this.gitPath]).then(() => {
            return util.excute(this.respoPath, ['checkout', this.branch]);
        });
    }

    update() {
        return util.excute(this.respoPath, ['checkout', this.branch]).then(() => {
            return util.excute(this.respoPath, ['reset', '--hard', `origin/${this.branch}`]);
        }).then(() => {
            return util.excute(this.respoPath, ['pull']);
        });
    }
}

class GitProvider extends BaseProvider {
    update() {
        let { git, branch, local } = this.option;
        let gitExcutor = new GitExcutor({ git, local, branch });
        let file = new SyncFile(Path.resolve(gitExcutor.respoPath));
        let ps = Promise.resolve();
        if (!file.exist) {
            ps = ps.then(() => gitExcutor.clone());
        } else {
            ps = ps.then(() => gitExcutor.update());
        }
    }

    get(path) {
        let { git, branch, local } = this.option;
        let gitExcutor = new GitExcutor({ git, local, branch });
        let file = new SyncFile(Path.resolve(gitExcutor.respoPath));
        let ps = Promise.resolve();
        if (!file.exist) {
            ps = ps.then(() => gitExcutor.clone());
        }
        return ps.then(() => new File(Path.resolve(gitExcutor.respoPath, `./${path}`)).read());
    }
}

module.exports = GitProvider;