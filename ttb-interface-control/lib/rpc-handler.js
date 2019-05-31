const fs = require('fs');

class RpcHandler
{
    constructor(mod)
    {
        this.mod = mod;
    }

    handle(request)
    {
        return this[request.method](request.params);
    }

    // Returns current server id
    getServer()
    {
        let ret = this.mod.serverId;
        return ret;
    }
    
    // Returns client ProtocolVersion
    getProtocolVersion()
    {
        return this.mod.protocolVersion;
    }

    // Dumps opcodes or sysmsg to the specified file in the "NAME CODE" format
    // params.path    : "full/path/to/file",
    // params.mapType : "protocol" | "sysmsg"
    dumpMap(params)
    {
        let map = new Map();
        let ret = true;
        let content = "";
        switch (params.mapType)
        {
            case 'protocol':
                map = this.mod.dispatch.protocolMap.name;
                break;
            case 'sysmsg':
                map = this.mod.dispatch.sysmsgMap.name;
                break;
        }
        for (const [k, v] of map)
        {
            content += `${k} ${v}\n`
        }
        fs.writeFile(params.path, content, function (err, data)
        {
            if (err)
            {
                ret = false;
            }
        });
        return ret;
    }
}
exports.RpcHandler = RpcHandler;
