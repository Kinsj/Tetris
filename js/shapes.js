class Shapes {
    constructor(){
        this.value = [
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
    }

    printShape(boxes, row, col, shape, form) {
        const self = this;
        for(let coo of self.value[shape][form].offset) {
            boxes[row+coo[0]][col+coo[1]].pos.css('background', this.value[shape][form].color);
        }
    }

    clearShape(boxes, row, col, shape, form) {
        const self = this;
        for(let coo of self.value[shape][form].offset) {
            boxes[row+coo[0]][col+coo[1]].pos.css('background', '');
        }
    }

    getOffset(shape, form) {
        const self = this;
        return self.value[shape][form].offset;
    }

    getShapesLength() {
        const self = this;
        return self.value.length;
    }

    getFormLength(shape) {
        console.log(shape);
        const self = this;
        return self.value[shape].length;
    }

    getShapeRowNeed(shape, form) {
        const self = this;
        return self.value[shape][form].rowNeed;
    }

    leftEdgeOffset(shape, form) {  // 可直接修改为 rowneed 类型
        const self = this;
        let offset = 0;
        for(let coo of self.value[shape][form].offset){
            if(coo[1] < offset) offset = coo[1];

        }
        return offset;
    }

    rightEdgeOffset(shape, form) {
        const self = this;
        let offset = 0;
        for(let coo of self.value[shape][form].offset){
            if(coo[1] > offset) offset = coo[1];
        }
        return offset;
    }

    bottomEdgeOffset(shape, form) {
        const self = this;
        let offset = 0;
        for(let coo of self.value[shape][form].offset){
            if(coo[0] > offset) offset = coo[0];
        }
        return offset;
    }
}