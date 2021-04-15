'use strict';
$(function () {
    const dataDraw = {
        grid: [],
        boxId: '#game-3',
        boxBody: '.game-box__lines',
        lineClass: '.game-box__line',
        elementClass: '.game-box__suit',
        inputLine: '[name="qty-line"]',
        inputElement: '[name="qty-suit"]',
        boxElement: '.game-box__next-element',
        resetBtn: '.game-box__reset-game'
    }


    const gridSize = getInputData();
    const grid = new Grid(gridSize);
    const gridArr = grid.create();
    dataDraw.grid = gridArr;

    const getSuit = grid.getNextElement();
    const gridModificator = new GridModificator(gridArr, getSuit());

    const gridDraw = new GridDraw(dataDraw);
    gridDraw.printNextElement(getSuit());
    gridDraw.clearBody();
    gridDraw.create();

    function clickHandler() {
        const line = $(this).parent().data('key-line');
        const element = $(this).data('key-element');
        const newGrid = gridModificator.change(line, element);
        gridDraw.update(newGrid);

        const getSuit = grid.getNextElement();
        gridModificator.changeElement(getSuit());
        gridDraw.printNextElement(getSuit());

        if (gridModificator.hasAllDuplicate()) {
            resetGame();
            alert('You win!!!');
        }
    }

    function changeInputHandler() {
        const gridSize = getInputData();
        const newGrid = grid.updateSize(gridSize);
        resetGame(newGrid);
    }

    function getInputData() {
        const qtyLine = $(`${dataDraw.boxId} ${dataDraw.inputLine}`).val();
        const qtyElement = $(`${dataDraw.boxId} ${dataDraw.inputElement}`).val();

        return { qtyLine, qtyElement }
    }

    function resetGame(newGrid) {
        if (!newGrid) { newGrid = grid.reset() }
        else { newGrid = newGrid.type === 'click' ? grid.reset() : newGrid; }

        gridModificator.update(newGrid);
        gridDraw.update(newGrid);
        gridDraw.clearBody();
        gridDraw.create();

        $(`${dataDraw.boxId} ${dataDraw.elementClass}`).on('click', clickHandler);
    }

    $(`${dataDraw.boxId} ${dataDraw.elementClass}`).on('click', clickHandler);
    $(`${dataDraw.boxId} ${dataDraw.inputLine}`).on('change', changeInputHandler);
    $(`${dataDraw.boxId} ${dataDraw.inputElement}`).on('change', changeInputHandler);
    $(`${dataDraw.boxId} ${dataDraw.resetBtn}`).on('click', resetGame);
});

class Grid {
    constructor({ qtyLine = null, qtyElement = null, elementArr = null }) {
        this.grid = [];
        this.qtyLine = qtyLine || 7;
        this.qtyElement = qtyElement || 6;
        this.elementArr = elementArr || ['spades', 'clubs', 'diams', 'hearts'];
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

    reset() {
        return this.create();
    }

    updateSize({ qtyLine, qtyElement }) {
        this.qtyLine = qtyLine || this.qtyLine;
        this.qtyElement = qtyElement || this.qtyElement;

        return this.create();
    }

    getNextElement() {
        const next = this.elementArr.randElement();
        return () => next;
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

        if (this.selectedElement !== this.changeToElement) {
            this.dfs(selectedKeyLine, selectedKeyElement)
        };

        return JSON.parse(JSON.stringify(this.grid));
    }

    changeElement(element) {
        this.changeToElement = element;
    }

    update(grid) {
        if (!grid) { console.error('Not new grid') }
        else { this.grid = grid; }
    }

    hasAllDuplicate() {
        return this.grid.map(e => new Set(e)).filter(e => e.size > 1).length === 0;
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

class GridDraw {
    constructor({
        grid = null,
        boxId = null,
        boxBody = null,
        lineClass = null,
        elementClass = null,
        boxElement = null
    }) {
        this.grid = grid;
        this.boxId = boxId;
        this.boxBody = boxBody,
            this.lineClass = lineClass;
        this.elementClass = elementClass;
        this.boxElement = boxElement;
    }

    create() {
        const boxBody = $(`${this.boxId} ${this.boxBody}`);

        for (const [key, elsements] of this.grid.entries()) {
            const newLine = this.createLine(key);
            for (const [key, element] of elsements.entries()) {
                const newElement = this.createElement(key, element);
                newLine.append(newElement);
            }
            boxBody.append(newLine);
        }
    }

    update(grid) {
        this.grid = grid;

        const boxBody = $(`${this.boxId} ${this.boxBody}`);

        for (const [key, elsements] of this.grid.entries()) {
            const line = boxBody.find(`${this.lineClass}:eq(${key})`);
            for (const [key, element] of elsements.entries()) {
                const text = element ? `&${element};` : '';
                line
                    .find(`:eq(${key})`)
                    .removeClass()
                    .addClass(`${element} ${this.elementClass.slice(1)}`)
                    .html(text);
            }
        }
    }

    createLine(keyLine = null) {
        return $('<div/>').addClass(this.lineClass.slice(1)).data('key-line', keyLine);
    }

    createElement(keyElement = null, element = null) {
        const $newElement = $('<span/>').addClass(this.elementClass.slice(1)).data('key-element', keyElement);
        const text = element ? `&${element};` : '';

        return $newElement.addClass(element).html(text);
    }

    printNextElement(element) {
        const text = element ? `&${element};` : '';
        $(`${this.boxId} ${this.boxElement} i`)
            .removeClass()
            .addClass(element)
            .html(text);
    }

    clearBody() {
        $(`${this.boxId} ${this.boxBody}`).empty();
    }
}
