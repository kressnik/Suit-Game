'use strict';
$(function () {
    const grid = new Grid(10, 10);
    const gridArr = grid.create();
});
class Grid {
    constructor(qtyLine = null, qtyElement = null, elementArr = null) {
        this.grid = [];
        this.qtyLine = qtyLine || 7;
        this.qtyElement = qtyElement || 6;
        this.elementArr = elementArr || ['spades', 'clubs', 'diams', 'hearts']
    }

    create() {
        for (let line = 0; line < this.qtyLine; line++) {
            this.grid[line] = [];
            for (let index = 0; index < this.qtyElement; index++) {
                this.grid[line].push(this.elementArr.randElement());
            }
        }

        return JSON.parse(JSON.stringify(this.grid));
    }

    get() {
        return JSON.parse(JSON.stringify(this.grid));
    }
} 