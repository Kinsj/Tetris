const SHAPE = [
    [
        {
            offset: [[0,0],[0,1],[0,2],[0,3]],
            color: '#00b7ee',
            rowNeed: 1,
            colNeed: 4
        },
        {
            offset: [[0,0],[1,0],[2,0],[3,0]],
            color: '#00b7ee',
            rowNeed: 4,
            colNeed: 1
        }
    ],
    [
        {
            offset: [[0,0],[0,1],[1,0],[1,1]],
            color: '#c73c0e',
            rowNeed: 2,
            colNeed: 2
        }
    ],
    [
        {
            offset: [[0,0],[1,0],[2,0],[2,1]],
            color: '#3f8d00',
            rowNeed: 3,
            colNeed: 2
        },
        {
            offset: [[0,0],[0,1],[0,2],[1,0]],
            color: '#3f8d00',
            rowNeed: 2,
            colNeed: 3
        },
        {
            offset: [[0,0],[0,1],[1,1],[2,1]],
            color: '#3f8d00',
            rowNeed: 3,
            colNeed: 2
        },
        {
            offset: [[0,2],[1,0],[1,1],[1,2]],
            color: '#3f8d00',
            rowNeed: 2,
            colNeed: 3
        }
    ],
    [
        {
            offset: [[0,1],[1,1],[2,1],[2,0]],
            color: '#0b8d85',
            rowNeed: 3,
            colNeed: 2
        },
        {
            offset: [[0,0],[1,0],[1,1],[1,2]],
            color: '#0b8d85',
            rowNeed: 2,
            colNeed: 3
        },
        {
            offset: [[0,0],[0,1],[1,0],[2,0]],
            color: '#0b8d85',
            rowNeed: 3,
            colNeed: 2
        },
        {
            offset: [[0,0],[0,1],[0,2],[1,2]],
            color: '#0b8d85',
            rowNeed: 2,
            colNeed: 3
        }
    ],
    [
        {
            offset: [[0,0],[0,1],[1,1],[1,2]],
            color: '#d1c669',
            rowNeed: 2,
            colNeed: 3
        },
        {
            offset: [[0,1],[1,0],[1,1],[2,0]],
            color: '#d1c669',
            rowNeed: 3,
            colNeed: 2
        }
    ],
    [
        {
            offset: [[0,1],[0,2],[1,0],[1,1]],
            color: '#6723a5',
            rowNeed: 2,
            colNeed: 3
        },
        {
            offset: [[0,0],[1,0],[1,1],[2,1]],
            color: '#6723a5',
            rowNeed: 3,
            colNeed: 2
        }
    ],
    [
        {
            offset: [[0,0],[0,1],[0,2],[1,1]],
            color: '#5f5e59',
            rowNeed: 2,
            colNeed: 3
        },
        {
            offset: [[0,1],[1,0],[1,1],[2,1]],
            color: '#5f5e59',
            rowNeed: 3,
            colNeed: 2
        },
        {
            offset: [[0,1],[1,0],[1,1],[1,2]],
            color: '#5f5e59',
            rowNeed: 2,
            colNeed: 3
        },
        {
            offset: [[0,0],[1,0],[1,1],[2,0]],
            color: '#5f5e59',
            rowNeed: 3,
            colNeed: 2
        }
    ],

];

var cur = {
    row: 0,
    col: 0,
    maxRow: 0,
    maxCol: 0,
    shape: 0,
    form: 0,
};

var boxes; // 全局变量，面向对象时改成对象内成员变量

var gameOver = false;

function creatBoard(rows, cols) {
    // 通过js 调整总布局大小，然后在通过js创建方块dom节点并记录在二维数组里
    // 用来标识每个方块的坐标。
    let board = $('#mapboard');
    $('.box').remove();
    let boxes = new Array();
    board.css('width' , cols * 32);
    board.css('height', rows * 32);
    for(let r=0; r<rows; r++) {
        boxes[r] = new Array();
        for(let c=0; c<cols; c++) {
            boxes[r][c] = {
                pos: $(`<li class=\"box clearfloat\"></li>`),
                signed: false
            };
            board.append(boxes[r][c]['pos']);
        }
    }
    $('.gametype').hide();
    cur.maxCol = cols - 1;
    cur.maxRow = rows - 1;
    return boxes;
}

function printShape(row, col, shape) {
    for(let coo of shape.offset) {
        boxes[row+coo[0]][col+coo[1]].pos.css('background', shape.color);
    }
}

function printCurShape() {
    for(let coo of SHAPE[cur.shape][cur.form].offset) {
        boxes[cur.row+coo[0]][cur.col+coo[1]].pos.css('background', SHAPE[cur.shape][0].color);
    }
}

function removeCurShape() { // 先用参数的形式，之后改成面向对象的成员变量即可
    if(SHAPE[cur.shape]) {
        for(let coo of SHAPE[cur.shape][cur.form].offset) {
            boxes[cur.row+coo[0]][cur.col+coo[1]].pos.css('background', '');
        }
    }
}

function changeShapeForm() { // 先用参数的形式，之后改成面向对象的成员变量即可
    // 边缘情况需要判断后特殊处理
    // 左右边缘可自动往里收缩后变形
    // 下边缘禁止变形
    newForm = (cur.form + 1) % (SHAPE[cur.shape].length);
    if(cur.row + bottomEdgeOffset(SHAPE[cur.shape][newForm]) > cur.maxRow ||
        touchCheck(cur.row, cur.col, SHAPE[cur.shape][newForm])) {
        return;
    }

    if(cur.col + rightEdgeOffset(SHAPE[cur.shape][newForm]) > cur.maxCol){
        // 变形后右侧碰壁 可在变形后左移至恰当位置检查是否 碰到底边或碰到已有结构
        let newCol = cur.col + reviseCurCol(SHAPE[cur.shape][newForm]);
        if(cur.row + bottomEdgeOffset(SHAPE[cur.shape][newForm]) > cur.maxRow ||
            touchCheck(cur.row, newCol, SHAPE[cur.shape][newForm])) {
            return;
        }
        else {
            removeCurShape();
            cur.col = newCol;
        }
    }
    else {
        // 清空当前形状
        removeCurShape();
    }

    // 画出改变后的形状
    printShape(cur.row, cur.col, SHAPE[cur.shape][newForm]);
    cur.form = newForm;
}

function reviseCurCol(shape) {
    let over = (rightEdgeOffset(shape) + cur.col) - cur.maxCol;
    return over > 0 ? -over : 0;
}

function leftEdgeOffset(shape) {
    let offset = 0;
    for(let coo of shape.offset){
        if(coo[1] < offset) offset = coo[1];

    }
    return offset;
}
function rightEdgeOffset(shape) {
    let offset = 0;
    for(let coo of shape.offset){
        if(coo[1] > offset) offset = coo[1];
    }
    return offset;
}

function bottomEdgeOffset(shape) {
    let offset = 0;
    for(let coo of shape.offset){
        if(coo[0] > offset) offset = coo[0];
    }
    return offset;
}

function touchCheck(row, col, shape) {

    for(let coo of shape.offset) {
        if(row+coo[0] > cur.maxRow || col+coo[1] > cur.maxCol) continue;
        if(boxes[row+coo[0]][col+coo[1]].signed) {
            return true;
        }
    }
    return false;
}

function shapeMoveLeft() {
    if(cur.col + leftEdgeOffset(SHAPE[cur.shape][cur.form]) > 0
        && !touchCheck(cur.row, cur.col - 1, SHAPE[cur.shape][cur.form])) {
        removeCurShape();
        cur.col -= 1;
        printCurShape();
    }
}

function shapeMoveRight() {
    if(cur.col + rightEdgeOffset(SHAPE[cur.shape][cur.form]) < cur.maxCol
        && !touchCheck(cur.row, cur.col + 1, SHAPE[cur.shape][cur.form])) {
        removeCurShape();
        cur.col += 1;
        printCurShape();
    }
}

function shapeMoveDown() {
    if(cur.row + bottomEdgeOffset(SHAPE[cur.shape][cur.form]) < cur.maxRow
        && !touchCheck(cur.row + 1, cur.col, SHAPE[cur.shape][cur.form])) {
        removeCurShape();
        cur.row += 1;
        printCurShape();
    } else {
        // 无法向下移动，视为结束移动，记录结构并检查消除，生成新图形
        // 记录结构
        recordBlocks();
        // 检查消除
        tryClear();
        // 生成新图形
        createNewShape();
        // 判断游戏结束
        if(gameOverCheck()) {
            gameOver = true;
        }
    }
    return true;
}

function recordBlocks() {
    for(let coo of SHAPE[cur.shape][cur.form].offset) {
        boxes[cur.row+coo[0]][cur.col+coo[1]].signed = true;
    }
}

function createNewShape() {
    cur.row = 0;
    cur.col = Math.floor(cur.maxCol / 2);
    cur.shape = Math.floor(Math.random() * 100) % SHAPE.length;
    cur.form = Math.floor(Math.random() * SHAPE[cur.shape].length);
    printCurShape();
}

function tryClear() {
    let len = SHAPE[cur.shape][cur.form].rowNeed;
    let row = cur.row + len - 1;

    for(let i = row; i > row - len; i--) {
        console.log(`##############\ni: ${i}, row: ${row}, len: ${len}`);
        let full = true;
        for(let box of boxes[i]) {
            if (box.signed === false) full = false;
        }
        if(full) {
            for(let j=i; j>0; j--) {
                copyLine(j, j-1);
            }
            removeTopLine(1);
            i++;
        }
    }
}

function removeTopLine(num) {
    for(let i=0; i<num; i++) {
        for(let box of boxes[i]) {
            box.pos.css('background', '');
            box.signed = false;
        }
    }
}

function copyLine(rowTag, rowSrc) {
    for(let i=0; i<boxes[rowTag].length; i++) {
        boxes[rowTag][i].signed = boxes[rowSrc][i].signed;
        boxes[rowTag][i].pos.css('background', boxes[rowSrc][i].pos.css('background'));
    }
}

function gameOverCheck() {
    for(let box of boxes[0]) {
        if (box.signed === true){
            // 删除全部节点 播放gameover
            $('.box').remove();
            $('#mapboard').append(`<li class=\"gameover clearfloat\">GameOver</li>`);
            return true;
        }
    }
    return false;
}

function gamePoll() {

    setTimeout( function () {
        if(!gameOver){
            shapeMoveDown();
            gamePoll();
        }
    }, 1000);
}

$(document).ready(function () { // 开始绑定事件
    $('.gametype').click(function(){ // 绑定开始游戏操作流程
        boxes = creatBoard(20, 10);
        createNewShape();
        $(document).keypress(function () {
            console.log(event.keyCode);
            if(event.keyCode === 119 || event.keyCode === 87) {
                changeShapeForm();
            }
            if(event.keyCode === 97 || event.keyCode === 65) {
                shapeMoveLeft();
            }
            if(event.keyCode === 100 || event.keyCode === 68) {
                shapeMoveRight();
            }
            if(event.keyCode === 115 || event.keyCode === 83) {
                if(!gameOver) shapeMoveDown();
            }
        });
        gamePoll();
    });
});



