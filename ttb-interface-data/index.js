const net = require('net');
// TODO: move these to settings ------
const address = '127.0.0.60';
const port = 5200;
// -----------------------------------

class TcpInterface
{
    installedHooks = 0;
    installRawHook(opcode)
    {
        let options = { order: -Infinity };
        if (opcode == "S_PRIVATE_CHAT" || opcode == "S_JOIN_PRIVATE_CHANNEL")
        {
            options.filter = { fake: null };
        }
        if (opcode == "S_INVEN" && this.mod.majorPatchVersion >= 85) return;
        this.installedHooks++;

        this.mod.hook(opcode, 'raw', options, (code, data) =>
        {
            this.interface.write(this.build(data));
        })
    }
    removeRawHook(opcode)
    {
        let options = { order: -Infinity };
        if (opcode == "S_PRIVATE_CHAT" || opcode == "S_JOIN_PRIVATE_CHANNEL")
        {
            options.filter = { fake: null };
        }
        if (opcode == "S_INVEN" && this.mod.majorPatchVersion >= 85) return;

        this.mod.unhook(opcode, 'raw', options, (code, data) =>
        {
            this.interface.write(this.build(data));
        })
    }
    installHooks(mod)
    {
        let opcodes = ['C_CHECK_VERSION', 'C_LOGIN_ARBITER'];
        opcodes.forEach(o =>
        {
            this.installedHooks++;
            mod.hook(o, 'raw', { order: -Infinity }, (code, data) =>
            {
                this.interface.write(this.build(data));
            })
        });
    }
    printInfo()
    {
        this.mod.log('Installed hooks: ' + this.installedHooks);
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
                case 'print':
                    this.printInfo();
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