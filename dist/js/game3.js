'use strict';
$(function () {
    const grid = new Grid(10, 10);
    const gridArr = grid.create();

    const gridModificator = new GridModificator(gridArr);

    console.log(gridModificator.change(1,1));

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

class GridModificator {
    constructor(grid = null, changeToElement = null) {
        this.grid = grid;
        this.selectedElement = '';
        this.changeToElement = changeToElement || '';
    }

    change(selectedKeyLine, selectedKeyElement) {
        this.selectedElement = this.grid[selectedKeyLine][selectedKeyElement];
        this.dfs(selectedKeyLine, selectedKeyElement);

        return JSON.parse(JSON.stringify(this.grid));
    }

    dfs(selectedKeyLine, selectedKeyElement) {
        const right = [0, 1];
        const up = [1, 0];
        const left = [0, -1];
        const down = [-1, 0];

        this.grid[selectedKeyLine][selectedKeyElement] = this.changeToElement;

        for (const [suitIndex, lineIndex] of [right, up, left, down]) {
            const nextKeyLine = selectedKeyLine + lineIndex;
            const nextKeyElement = selectedKeyElement + suitIndex;
            const qtyLine = this.grid.length;
            const qtyElement = this.grid[0].length;
            const resultSizeGrid = this.checkSizeGrid(qtyLine, qtyElement, nextKeyLine, nextKeyElement);
            
            if (resultSizeGrid && this.grid[nextKeyLine][nextKeyElement] === this.selectedElement) {
                this.dfs(nextKeyLine, nextKeyElement)
            }
        }

        return true;
    }

    checkSizeGrid(qtyLine, qtyElement, nextKeyLine, nextKeySuit) {
        return 0 <= nextKeyLine && nextKeyLine < qtyLine && 0 <= nextKeySuit && nextKeySuit < qtyElement;
    }
}
