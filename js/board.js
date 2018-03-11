function creatBoard(rows, cols) {
    // 通过js 调整总布局大小，然后在通过js创建方块dom节点并记录在二维数组里
    // 用来标识每个方块的坐标。
    let board = $('#mapboard');
    $('.box').remove();
    let boxes = new Array();
    board.css('width' , rows * 32);
    board.css('height', cols * 32);
    for(let r=0; r<rows; r++) {
        boxes[r] = new Array();
        for(let c=0; c<cols; c++) {
            boxes[r][c] = $(`<li class=\"box clearfloat\">${r},${c}</li>`);
            board.append(boxes[r][c]);
        }
    }
    // var box = [];
}