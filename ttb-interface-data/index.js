const net = require('net');
// TODO: move these to settings ------
const address = '127.0.0.60';
const port = 5200;
// -----------------------------------

class TcpInterface
{
    installHooks()
    {
        //TODO: get them from file or dynamically change them via control connection
        let opcodes = [
            'C_CHECK_VERSION',
            'C_LOGIN_ARBITER',
            'S_LOGIN',
            'S_START_COOLTIME_SKILL',
            'S_DECREASE_COOLTIME_SKILL',
            'S_START_COOLTIME_ITEM',
            'S_PLAYER_CHANGE_MP',
            'S_CREATURE_CHANGE_HP',
            'S_PLAYER_CHANGE_STAMINA',
            'S_PLAYER_CHANGE_FLIGHT_ENERGY',
            'S_PLAYER_STAT_UPDATE',
            'S_USER_STATUS',
            'S_SPAWN_NPC',
            'S_DESPAWN_NPC',
            'S_NPC_STATUS',
            'S_BOSS_GAGE_INFO',
            'S_ABNORMALITY_BEGIN',
            'S_ABNORMALITY_REFRESH',
            'S_ABNORMALITY_END',
            'S_GET_USER_LIST',
            'S_SPAWN_ME',
            'S_RETURN_TO_LOBBY',
            'C_PLAYER_LOCATION',
            'S_USER_EFFECT',
            'S_LOAD_TOPO',
            'S_DESPAWN_USER',
            'S_PARTY_MEMBER_LIST',
            'S_LOGOUT_PARTY_MEMBER',
            'S_LEAVE_PARTY_MEMBER',
            'S_LEAVE_PARTY',
            'S_BAN_PARTY_MEMBER',
            'S_BAN_PARTY',
            'S_PARTY_MEMBER_CHANGE_HP',
            'S_PARTY_MEMBER_CHANGE_MP',
            'S_PARTY_MEMBER_STAT_UPDATE',
            'S_CHECK_TO_READY_PARTY',
            'S_CHECK_TO_READY_PARTY_FIN',
            'S_ASK_BIDDING_RARE_ITEM',
            'S_RESULT_ITEM_BIDDING',
            'S_RESULT_BIDDING_DICE_THROW',
            'S_PARTY_MEMBER_BUFF_UPDATE',
            'S_PARTY_MEMBER_ABNORMAL_ADD',
            'S_PARTY_MEMBER_ABNORMAL_REFRESH',
            'S_PARTY_MEMBER_ABNORMAL_DEL',
            'S_PARTY_MEMBER_ABNORMAL_CLEAR',
            'S_CHANGE_PARTY_MANAGER',
            'S_WEAK_POINT',
            'S_CHAT',
            'S_WHISPER',
            'S_PRIVATE_CHAT',
            'S_JOIN_PRIVATE_CHANNEL',
            'S_LEAVE_PRIVATE_CHANNEL',
            'S_SYSTEM_MESSAGE',
            'S_SYSTEM_MESSAGE_LOOT_ITEM',
            'S_CREST_MESSAGE',
            'S_ANSWER_INTERACTIVE',
            'S_USER_BLOCK_LIST',
            'S_FRIEND_LIST',
            'S_ACCOMPLISH_ACHIEVEMENT',
            'S_TRADE_BROKER_DEAL_SUGGESTED',
            'S_UPDATE_FRIEND_INFO',
            'S_PARTY_MATCH_LINK',
            'S_PARTY_MEMBER_INFO',
            'S_OTHER_USER_APPLY_PARTY',
            'S_DUNGEON_EVENT_MESSAGE',
            'S_NOTIFY_TO_FRIENDS_WALK_INTO_SAME_AREA',
            'S_AVAILABLE_EVENT_MATCHING_LIST',
            'S_DUNGEON_COOL_TIME_LIST',
            'S_ACCOUNT_PACKAGE_LIST',
            'S_GUILD_TOWER_INFO',
            'S_INVEN',
            'S_SPAWN_USER',
            'S_PARTY_MEMBER_INTERVAL_POS_UPDATE',
            'S_ABNORMALITY_DAMAGE_ABSORB',
            'S_IMAGE_DATA',
            'S_GET_USER_GUILD_LOGO',
            'S_FIELD_POINT_INFO',
            'S_DUNGEON_CLEAR_COUNT_LIST',
            'S_SHOW_PARTY_MATCH_INFO',
            'S_SHOW_CANDIDATE_LIST',
            'S_SHOW_HP',
            'S_REQUEST_CITY_WAR_MAP_INFO',
            'S_REQUEST_CITY_WAR_MAP_INFO_DETAIL',
            'S_DESTROY_GUILD_TOWER',
            'S_FIELD_EVENT_ON_ENTER',
            'S_FIELD_EVENT_ON_LEAVE',
            'S_UPDATE_NPCGUILD',
            'S_NPCGUILD_LIST',
            'S_NOTIFY_GUILD_QUEST_URGENT',
            'S_CHANGE_GUILD_CHIEF',
            'S_GUILD_MEMBER_LIST',
            'S_CREATURE_LIFE',
            'S_PLAYER_CHANGE_EXP',
            'S_LOAD_EP_INFO',
            'S_LEARN_EP_PERK',
            'S_RESET_EP_PERK'
        ];
        opcodes.forEach(opcode =>
        {
            this.mod.hook(opcode, 'raw', (code, data) =>
            {
                this.interface.write(this.build(data));
            });
        });
    }
    constructor(mod)
    {
        this.mod = mod;
        this.interface = new net.Socket();
        this.interface.connect(port, address);
        this.interface.on('error', (err) => { console.log("[tcp-interface] " + err) });
        this.interface.on('connect', () => { console.log("[tcp-interface] Connected!") });

        this.installHooks();
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