const net = require('net');
// TODO: move these to settings ------
const address = '127.0.0.60';
const port = 5200;
// -----------------------------------

class TcpInterface
{
    installRawHook(opcode)
    {
        this.mod.hook(opcode, 'raw', { order: -999 }, (code, data) =>
        {
            this.interface.write(this.build(data));
        })
    }
    removeRawHook(opcode)
    {
        this.mod.unhook(opcode, 'raw', { order: -999 }, (code, data) =>
        {
            this.interface.write(this.build(data));
        })
    }
    installHooks(mod)
    {
        let opcodes = ['C_CHECK_VERSION', 'C_LOGIN_ARBITER'];
        opcodes.forEach(o =>
        {
            mod.hook(o, 'raw', { order: -999 }, (code, data) =>
            {
                this.interface.write(this.build(data));
            })
        });
    }
    constructor(mod)
    {
        this.mod = mod;
        mod.command.add('tid', (cmd, arg) =>
        {
            switch (cmd)
            {
                case 'add':
                    this.installRawHook(arg);
                    break;
                case 'rem':
                    this.removeRawHook(arg);
                    break;
            }
        });
        this.interface = new net.Socket();
        this.interface.connect(port, address);
        this.interface.on('error', (err) => { console.log("[ttb-interface] " + err) });
        this.interface.on('connect', () => { console.log("[ttb-interface] Connected!") });

        this.installHooks(mod);
    }

    build(payload)
    {
        return Buffer.from(payload);
    }
    destructor()
    {
        this.interface.end();
        this.interface.destroy();
    }
}

module.exports = TcpInterface;