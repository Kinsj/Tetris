$(document).ready(function () { // 开始绑定事件
    $('.gametype').click(function(){ // 绑定开始游戏操作流程
        board = new Board(20, 10);
        board.createNewShape();
        $(document).keypress(function () {
            console.log(event.keyCode);
            if(event.keyCode === 119 || event.keyCode === 87) {
                board.changeShapeForm();
            }
            if(event.keyCode === 97 || event.keyCode === 65) {
                board.shapeMoveLeft();
            }
            if(event.keyCode === 100 || event.keyCode === 68) {
                board.shapeMoveRight();
            }
            if(event.keyCode === 115 || event.keyCode === 83) {
                if(!board.gameOver) board.shapeMoveDown();
            }
        });
        board.gamePoll();
    });
});


