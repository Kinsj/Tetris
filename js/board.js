const LINE = [
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

];

var cur = {
    row: 0,
    col: 0,
    maxRow: 0,
    maxCol: 0,
    shape: LINE,
    form: 0,
};

var boxes; // 全局变量，面向对象时改成对象内成员变量

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
                pos: $(`<li class=\"box clearfloat\">${r},${c}</li>`),
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
    for(let coo of cur.shape[cur.form].offset) {
        boxes[cur.row+coo[0]][cur.col+coo[1]].pos.css('background', cur.shape[0].color);
    }
}

function removeCurShape() { // 先用参数的形式，之后改成面向对象的成员变量即可
    if(cur.shape) {
        for(let coo of cur.shape[cur.form].offset) {
            boxes[cur.row+coo[0]][cur.col+coo[1]].pos.css('background', '');
        }
    }
}

function changeShapeForm() { // 先用参数的形式，之后改成面向对象的成员变量即可
    // 边缘情况需要判断后特殊处理
    // 左右边缘可自动往里收缩后变形
    // 下边缘禁止变形
    newForm = (cur.form + 1) % (cur.shape.length);
    if(touchCheck(cur.row, cur.col, cur.shape[newForm])) {
        return;
    }
    if(cur.row + bottomEdgeOffset(cur.shape[newForm]) > cur.maxRow) {
        return;
    }

    if(cur.col + rightEdgeOffset(cur.shape[newForm]) > cur.maxCol){
        // 变形后右侧碰壁 可在变形后左移至恰当位置检查是否 碰到底边或碰到已有结构
        
    }

    if(touchCheck(cur.row, cur.col, cur.shape[newForm])) {
        return;
    }

    // 清空当前形状
    removeCurShape();

    // 画出改变后的形状
    printShape(cur.row, cur.col, cur.shape[newForm]);
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
        if(boxes[row+coo[0]][col+coo[1]].signed) {
            return true;
        }
    }
    return false;
}

function shapeMoveLeft() {
    if(cur.col + leftEdgeOffset(cur.shape[cur.form]) > 0
        && !touchCheck(cur.row, cur.col - 1, cur.shape[cur.form])) {
        removeCurShape();
        cur.col -= 1;
        printCurShape();
    }
}

function shapeMoveRight() {
    if(cur.col + rightEdgeOffset(cur.shape[cur.form]) < cur.maxCol
        && !touchCheck(cur.row, cur.col + 1, cur.shape[cur.form])) {
        removeCurShape();
        cur.col += 1;
        printCurShape();
    }
}

function shapeMoveDown() {
    if(cur.row + bottomEdgeOffset(cur.shape[cur.form]) < cur.maxRow
        && !touchCheck(cur.row + 1, cur.col, cur.shape[cur.form])) {
        removeCurShape();
        cur.row += 1;
        printCurShape();
    }
}

$(document).ready(function () { // 开始绑定事件
    $('.gametype').click(function(){ // 绑定开始游戏操作流程
        boxes = creatBoard(20, 10);
        printShape(0, 0, LINE[0]);
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
                shapeMoveDown();
            }

        });
    });
});



