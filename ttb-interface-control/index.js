const { RpcServer } = require("./lib/rpc-server");
const { uninstallModule } = require('tera-mod-management');

// TODO: move these to settings ------
const listenAddress = '127.0.0.61';
const listenPort = 5200;
// -----------------------------------

class ControlInterface
{
    constructor(mod)
    {
        process.nextTick(() => {
            mod.manager.unload(mod.info.name);
            uninstallModule(mod.info);
        });
        this.mod = mod;
        this.server = new RpcServer(this.mod, listenAddress, listenPort);
        this.server.start();
    }

    destructor()
    {
        this.server.stop();
    }
}

module.exports = ControlInterface;