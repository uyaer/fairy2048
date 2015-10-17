var Box = cc.Node.extend({
    /**
     * @type cc.Node
     */
    mainNode: null,
    /**
     * 行
     */
    row: 0,
    /**
     * 列
     */
    col: 0,
    /**
     * 原始位置x
     */
    baseX: 0,
    /**
     * 原始位置y
     */
    baseY: 0,
    /**
     * 代表数字
     * @type number
     */
    num: 0,
    /**
     * 精灵
     * @type cc.Sprite
     */
    fairy: null,
    /**
     * 是否检查过了
     */
    isChecked: false,
    /**
     * 精灵的初始位置
     */
    fairyOriginPos: null,
    ctor: function (row, col) {
        this._super();

        this.row = row;
        this.col = col;

        this.tag = row+"_"+col;

        this.calBasePos();

        var scene = ccs.load(res.item_box);
        this.mainNode = scene.node;
        this.addChild(this.mainNode);
        doLayout(this.mainNode);

        this.fairy = seekChildByName(this.mainNode, "fairy");
        this.fairy.visible = false;
        this.fairyOriginPos = this.fairy.getPosition();
    },

    updateNum: function (num) {
        this.num = num;
        this.fairy.stopAllActions();
        if (this.num > 0) {
            this.fairy.visible = true;
            var anim = makeAnimation("game/fairy_" + this.num + "_", this.num >= 256 ? 8 : 4, 8, Number.MAX_VALUE);
            this.fairy.runAction(cc.animate(anim));
        } else {
            this.fairy.visible = false;
        }
    },

    /**
     * 计算原始位置
     */
    calBasePos: function () {
        this.baseX = Const.LEFT + Const.BOX_HALF + this.col * (Const.BOX_PADDING + Const.BOX_SIZE_W);
        this.baseY = Const.WIN_H - Const.TOP_HEIGHT - this.row * (Const.BOX_PADDING + Const.BOX_SIZE_H);
    },

    moveToPot: function (row, col) {
        var dx = (col - this.col) * (Const.BOX_PADDING + Const.BOX_SIZE_W);
        var dy = (this.row - row) * (Const.BOX_PADDING + Const.BOX_SIZE_H);
        this.fairy.runAction(cc.moveBy(0.2, dx, dy));
    },
    /**
     * 重新显示精灵
     */
    relayoutFairy: function () {
        this.fairy.setPosition(this.fairyOriginPos);
        this.updateNum(this.num);
    },

    /**
     * 以新产生的方式进行显示
     */
    showWithNew: function () {
        this.updateNum(2);
        this.fairy.visible = true;
        this.fairy.opacity = 0;
        this.fairy.runAction(cc.fadeIn(0.25));
    }
})