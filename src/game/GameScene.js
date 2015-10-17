var GameScene = cc.Scene.extend({
    /**
     * @type Array
     */
    boxArr: null,
    /**
     * box根目录
     * @type cc.Layer
     */
    boxRoot: null,
    /**
     * @type TopLayer
     */
    topLayer: null,
    ctor: function () {
        this._super();

        this.makeBackground();

        this.makeBox();
        //this.makeTopLayer();

        GameManager.instance.state = GameState.PLAYING;

        //AudioManager.instance.playBgSound();
    },

    onEnter: function () {
        this._super();

        //event
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganHandler.bind(this),
            onTouchEnded: this.onTouchEndedHandler.bind(this)
        }, this);
        //event
        if (cc.sys.isNative) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: this.onKeyClicked.bind(this)
            }, this);
        }
    },

    onKeyClicked: function (code) {
        if (code == cc.KEY.back) {
            cc.director.runScene(new cc.TransitionFade(0.5, new IndexScene(), hex2Color(0xa1edf8)));
        }
    },

    /**
     *创建背景
     */
    makeBackground: function () {
        var bg = new cc.Sprite(res.game_bg);
        bg.scaleX = Const.WIN_W / bg.width;
        bg.scaleY = Const.WIN_H / bg.height;
        bg.anchorX = bg.anchorY = 0;
        this.addChild(bg);
    },

    makeBox: function () {
        var valArr = randomArrayIndex(Const.ROW * Const.COL, 2);
        this.boxArr = [];
        var box;
        var root = new cc.Layer();
        this.boxRoot = root;
        this.addChild(root, 2);
        for (var i = 0; i < Const.ROW; i++) {
            var line = [];
            this.boxArr.push(line);
            for (var j = 0; j < Const.COL; j++) {
                var index = i * Const.COL + j;
                box = new Box(i, j);
                line.push(box);
                if (isElinArray(index, valArr)) {
                    box.updateNum(2);
                } else {
                    box.updateNum(0);
                }
                box.x = box.baseX;
                box.y = box.baseY;
                root.addChild(box);
            }
        }
    },

    makeTopLayer: function () {
        this.topLayer = new TopLayer();
        this.addChild(this.topLayer, 10);
    },

    /**
     * touch起始位置
     */
    touchStartPos: null,
    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchBeganHandler: function (touch, event) {
        this.touchStartPos = touch.getLocation();
        return true;
    },

    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchEndedHandler: function (touch, event) {
        if (GameManager.instance.state != GameState.PLAYING) {
            return;
        }
        var pos = touch.getLocation();
        var dx = pos.x - this.touchStartPos.x;
        var dy = pos.y - this.touchStartPos.y;
        var abx = Math.abs(dx);
        var aby = Math.abs(dy);
        //移动距离小了忽略本次操作
        if (abx < 75 && aby < 75) return;
        if (abx > aby) { //横向
            dx > 0 ? this.moveRight() : this.moveLeft();
        } else {
            dy > 0 ? this.moveUp() : this.moveDown();
        }
        this.touchStartPos = null;
    },
    /**
     * 根据方向移动
     */
    moveDown: function () {
        /**
         * 本次移动是否有效
         * @type {boolean}
         */
        var flag = false;
        for (var row = Const.ROW - 2; row >= 0; row--) {
            for (var col = 0; col < Const.COL; col++) {
                /**@type Box*/
                var box = this.boxArr[row][col];
                if (box.num == 0)continue;
                /**@type Box*/
                var lastBox = this._findVerticalLastNotNullBox(box, 1);

                if (this.moveBoxDir(box, lastBox, -1, 0)) {
                    flag = true;
                }
            }
        }

        if (flag) {
            setTimeout(this.reLayoutBoxFairy.bind(this), 250);
        }
    },
    /**
     * 根据方向移动
     */
    moveUp: function () {
        /**
         * 本次移动是否有效
         * @type {boolean}
         */
        var flag = false;
        for (var row = 1; row < Const.ROW; row++) {
            for (var col = 0; col < Const.COL; col++) {
                /**@type Box*/
                var box = this.boxArr[row][col];
                if (box.num == 0)continue;
                /**@type Box*/
                var lastBox = this._findVerticalLastNotNullBox(box, -1);

                if (this.moveBoxDir(box, lastBox, 1, 0)) {
                    flag = true;
                }
            }
        }

        if (flag) {
            setTimeout(this.reLayoutBoxFairy.bind(this), 250);
        }
    },
    /**
     * 根据方向移动
     */
    moveLeft: function () {
        /**
         * 本次移动是否有效
         * @type {boolean}
         */
        var flag = false;
        for (var col = 1; col < Const.COL; col++) {
            for (var row = 0; row < Const.ROW; row++) {
                /**@type Box*/
                var box = this.boxArr[row][col];
                if (box.num == 0)continue;
                /**@type Box*/
                var lastBox = this._findHorizontalLastNotNullBox(box, -1);

                if (this.moveBoxDir(box, lastBox, 0, 1)) {
                    flag = true;
                }
            }
        }

        if (flag) {
            setTimeout(this.reLayoutBoxFairy.bind(this), 250);
        }
    },
    /**
     * 根据方向移动
     */
    moveRight: function () {
        /**
         * 本次移动是否有效
         * @type {boolean}
         */
        var flag = false;
        for (var col = Const.COL - 2; col >= 0; col--) {
            for (var row = 0; row < Const.ROW; row++) {
                /**@type Box*/
                var box = this.boxArr[row][col];
                if (box.num == 0)continue;
                /**@type Box*/
                var lastBox = this._findHorizontalLastNotNullBox(box, 1);

                if (this.moveBoxDir(box, lastBox, 0, -1)) {
                    flag = true;
                }
            }
        }

        if (flag) {
            setTimeout(this.reLayoutBoxFairy.bind(this), 250);
        }
    },

    moveBoxDir: function (box, lastBox, addRowNum, addColNum) {
        var flag = false;
        if (box.num == lastBox.num) {
            lastBox.num *= 2;
            box.num = 0;
            box.moveToPot(lastBox.row, lastBox.col);
            flag = true;
        } else if (lastBox.num == 0) {
            lastBox.num = box.num;
            box.num = 0;
            box.moveToPot(lastBox.row, lastBox.col);
            flag = true;
        } else {
            //不匹配，则上一个一定空的
            lastBox = this.boxArr[lastBox.row + addRowNum][lastBox.col + addColNum];
            if (lastBox != box) {
                lastBox.num = box.num;
                box.num = 0;
                box.moveToPot(lastBox.row, lastBox.col);
                flag = true;
            }
        }
        return flag;
    },

    /**
     * @param box {Box}
     * @param addNum {number}每次增加的数字
     */
    _findVerticalLastNotNullBox: function (box, addNum) {
        var row = box.row + addNum;
        /**@type Box**/
        var result = null;
        while (row < Const.ROW && row >= 0) {
            result = this.boxArr[row][box.col];
            if (result.num > 0)return result;
            row += addNum;
        }
        return result;
    },
    /**
     * @param box {Box}
     * @param addNum {number}每次增加的数字
     */
    _findHorizontalLastNotNullBox: function (box, addNum) {
        var col = box.col + addNum;
        /**@type Box**/
        var result = null;
        while (col < Const.COL && col >= 0) {
            result = this.boxArr[box.row][col];
            if (result.num > 0)return result;
            col += addNum;
        }
        return result;
    },

    /**
     * 重新排列box
     */
    reLayoutBoxFairy: function () {
        /**
         * 空位
         * @type {Array}
         */
        var nullArr = [];
        for (var row = 0; row < Const.ROW; row++) {
            for (var col = 0; col < Const.COL; col++) {
                /**@type Box*/
                var box = this.boxArr[row][col];
                box.relayoutFairy();
                if (box.num == 0) {
                    nullArr.push(row * Const.COL + col);
                }
            }
        }
        if (nullArr.length > 0) {
            this.createNewFairy(nullArr);
        } else {
            //TODO 判断是否可以继续走
        }
    },

    /**
     * 在空位上产生新的
     * @param nullArr
     */
    createNewFairy: function (nullArr) {
        var index = randomArrayIndex(nullArr, 1);
        var row = int(index / Const.COL);
        var col = index % Const.COL;
        /**@type Box*/
        var box = this.boxArr[row][col];
        box.showWithNew();
    }

})