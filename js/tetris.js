class Board {
    constructor(rows=0, cols=0){ //给参数传默认值，防止调用时忘记传实参而报错
        this.boxes = new Array();
        this.shapes = new Shapes();
        this.gameOver = false;
        this.cur = {
            row: 0,
            col: 0,
            maxRow: 0,
            maxCol: 0,
            shape: 0,
            form: 0,
        };
        this.creatBoard(rows, cols);
    }

    creatBoard(rows, cols) {
        // 通过js 调整总布局大小，然后在通过js创建方块dom节点并记录在二维数组里
        // 用来标识每个方块的坐标。
        const self = this;
        let board = $('#mapboard');
        $('.box').remove();
        // let boxes = new Array();
        board.css('width' , cols * 32);
        board.css('height', rows * 32);
        for(let r=0; r<rows; r++) {
            self.boxes[r] = new Array();
            for(let c=0; c<cols; c++) {
                self.boxes[r][c] = {
                    pos: $(`<li class=\"box clearfloat\"></li>`),
                    signed: false
                };
                board.append(self.boxes[r][c]['pos']);
            }
        }
        $('.gametype').hide();
        self.cur.maxCol = cols - 1;
        self.cur.maxRow = rows - 1;
    }

    printCurShape() {
        console.log('print shapes');
        this.shapes.printShape(this.boxes, this.cur.row, this.cur.col, this.cur.shape, this.cur.form);
    }

    clearCurShape() { // 先用参数的形式，之后改成面向对象的成员变量即可
        this.shapes.clearShape(this.boxes, this.cur.row, this.cur.col, this.cur.shape, this.cur.form);
    }

    changeShapeForm() { // 先用参数的形式，之后改成面向对象的成员变量即可
        // 边缘情况需要判断后特殊处理
        // 左右边缘可自动往里收缩后变形
        // 下边缘禁止变形
        let newForm = (this.cur.form + 1) % (this.shapes.getFormLength(this.cur.shape));
        if(this.cur.row + this.shapes.bottomEdgeOffset(this.cur.shape, this.cur.form) > this.cur.maxRow ||
            this.touchCheck(this.cur.row, this.cur.col, this.shapes.getOffset(this.cur.shape, this.cur.form))) {
            return;
        }

        if(this.cur.col + this.shapes.rightEdgeOffset(this.cur.shape, this.cur.form) > this.cur.maxCol){
            // 变形后右侧碰壁 可在变形后左移至恰当位置检查是否 碰到底边或碰到已有结构
            let newCol = this.cur.col + this.reviseCurCol(this.cur.shape, this.cur.form);
            if(this.cur.row + this.shapes.bottomEdgeOffset(this.cur.shape, this.cur.form) > this.cur.maxRow ||
                this.touchCheck(this.cur.row, newCol, this.shapes.getOffset(this.cur.shape, newForm))) {
                return;
            }
            else {
                this.clearCurShape();
                this.cur.col = newCol;
            }
        }
        else {
            // 清空当前形状
            this.clearCurShape();
        }

        // 画出改变后的形状
        this.cur.form = newForm;
        this.printCurShape();
        // printShape(cur.row, cur.col, SHAPE[cur.shape][newForm]);
        // this.cur.form = newForm;

    }

    reviseCurCol(shape, form) {
        let over = (this.shapes.rightEdgeOffset(shape, form) + this.cur.col) - this.cur.maxCol;
        return over > 0 ? -over : 0;
    }

    touchCheck(row, col, offset) {
        for(let coo of offset) {
            if(row+coo[0] > this.cur.maxRow || col+coo[1] > this.cur.maxCol) continue;
            if(this.boxes[row+coo[0]][col+coo[1]].signed) {
                return true;
            }
        }
        return false;
    }

    shapeMoveLeft() {
        if(this.cur.col + this.shapes.leftEdgeOffset(this.cur.shape, this.cur.form) > 0
            && !this.touchCheck(this.cur.row, this.cur.col - 1, this.shapes.getOffset(this.cur.shape, this.cur.form))) {
            this.clearCurShape();
            this.cur.col -= 1;
            this.printCurShape();
        }
    }

    shapeMoveRight() {
        if(this.cur.col + this.shapes.rightEdgeOffset(this.cur.shape, this.cur.form) < this.cur.maxCol
            && !this.touchCheck(this.cur.row, this.cur.col + 1, this.shapes.getOffset(this.cur.shape, this.cur.form))) {
            this.clearCurShape();
            this.cur.col += 1;
            this.printCurShape();
        }
    }

    shapeMoveDown() {
        if(this.cur.row + this.shapes.bottomEdgeOffset(this.cur.shape, this.cur.form) < this.cur.maxRow
            && !this.touchCheck(this.cur.row + 1, this.cur.col, this.shapes.getOffset(this.cur.shape, this.cur.form))) {
            this.clearCurShape();
            this.cur.row += 1;
            this.printCurShape();
        } else {
            // 无法向下移动，视为结束移动，记录结构并检查消除，生成新图形
            // 记录结构
            this.recordBlocks();
            // 检查消除
            this.tryClear();
            // 生成新图形
            this.createNewShape();
            // 判断游戏结束
            if(this.gameOverCheck()) {
                this.gameOver = true;
            }
        }
        return true;
    }

    recordBlocks() {
        for(let coo of this.shapes.getOffset(this.cur.shape, this.cur.form)) {
            this.boxes[this.cur.row+coo[0]][this.cur.col+coo[1]].signed = true;
        }
    }

    createNewShape() {
        this.cur.row = 0;
        this.cur.col = Math.floor(this.cur.maxCol / 2);
        this.cur.shape = Math.floor(Math.random() * 100) % this.shapes.getShapesLength();
        this.cur.form = Math.floor(Math.random() * this.shapes.getFormLength(this.cur.shape));
        this.printCurShape();
    }

    tryClear() {
        let len = this.shapes.getShapeRowNeed(this.cur.shape, this.cur.form);
        let row = this.cur.row + len - 1;

        for(let i = row; i > row - len; i--) {
            // console.log(`##############\ni: ${i}, row: ${row}, len: ${len}`);
            let full = true;
            for(let box of this.boxes[i]) {
                if (box.signed === false) full = false;
            }
            if(full) {
                for(let j=i; j>0; j--) {
                    this.copyLine(j, j-1);
                }
                this.removeTopLine(1);
                i++;
            }
        }
    }

    removeTopLine(num) {
        for(let i=0; i<num; i++) {
            for(let box of this.boxes[i]) {
                box.pos.css('background', '');
                box.signed = false;
            }
        }
    }

    copyLine(rowTag, rowSrc) {
        for(let i=0; i<this.boxes[rowTag].length; i++) {
            this.boxes[rowTag][i].signed = this.boxes[rowSrc][i].signed;
            this.boxes[rowTag][i].pos.css('background', this.boxes[rowSrc][i].pos.css('background'));
        }
    }

    gameOverCheck() {
        for(let box of this.boxes[0]) {
            if (box.signed === true){
                // 删除全部节点 播放gameover
                $('.box').remove();
                $('#mapboard').append(`<li class=\"gameover clearfloat\">GameOver</li>`);
                return true;
            }
        }
        return false;
    }

    gamePoll() {
        const self = this;
        setTimeout( function () {
            if(!self.gameOver){
                self.shapeMoveDown();
                self.gamePoll();
            }
        }, 1000);
    }
}