var GameManager = {};
GameManager.instance = {

    state: GameState.UN_START,
    /**
     * 当前进行的关卡的分数
     */
    score: 0,

    /**
     * init data
     */
    init: function () {
        this.loadCfg();
    },

    loadCfg: function () {
        var str = cc.sys.localStorage.getItem(Const.STORE_CFG_KEY);
        if (str) {
            var json = JSON.parse(str);
            AudioManager.instance.setIsAudio(json["isAudio"]);
        }
    },
    saveCfg: function () {
        var data = {
            "isAudio": AudioManager.instance.getIsAudio()
        }
        cc.sys.localStorage.setItem(Const.STORE_CFG_KEY, JSON.stringify(data));
    }

};

this["GameManager"] = GameManager;