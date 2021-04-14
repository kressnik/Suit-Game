$(function () {
    Object.defineProperty(
        Object.prototype,
        'randElement',
        {
            value: function () {
                const rand = Math.floor(Math.random() * this.length);
                return this[rand];
            }
        }
    );

    const ID_GAME = 'game-2';
    const SUIT_ELEMENT = 'game-box__suit';
    const INPUT_QTY_LINE = 'qty-line';
    const INPUT_QTY_SUIT = 'qty-suit';
    const SUIT = ['spades', 'clubs', 'diams', 'hearts'];
    let getGrid = createSuidGrid();

    drawnPlayingCard();

    $(`#${ID_GAME} [name="${INPUT_QTY_LINE}"]`).on('change', changeSizeGrid);
    $(`#${ID_GAME} [name="${INPUT_QTY_SUIT}"]`).on('change', changeSizeGrid);

    function changeSizeGrid() {
        const qtyLine = $(`#${ID_GAME} [name="${INPUT_QTY_LINE}"]`).val();
        const qtySuit = $(`#${ID_GAME} [name="${INPUT_QTY_SUIT}"]`).val();
       
        getGrid = createSuidGrid(qtyLine, qtySuit);
        drawnPlayingCard();
    }

    function createSuidGrid(qtyLine, qtySuit) {
        const quantityLine = qtyLine || 7;
        const quantitySuit = qtySuit || 6;
        const grid = [];

        for (let index = 0; index < quantityLine; index++) {
            let gridLineArr = grid[index] = [];
            for (let index = 0; index < quantitySuit; index++) {
                gridLineArr.push(SUIT.randElement());
            }
        }

        return function () {
            return grid;
        };
    }

    function dfs(currentSuit, currentLineIndex, currentSuitIndex) {
        const grid = getGrid();
        const right = [0, 1];
        const up = [1, 0];
        const left = [0, -1];
        const down = [-1, 0];

        grid[currentLineIndex][currentSuitIndex] = '';

        for (const [suitIndex, lineIndex] of [right, up, left, down]) {
            const nextLineIndex = currentLineIndex + lineIndex;
            const nextSuitIndex = currentSuitIndex + suitIndex;
            const quantityLine = grid.length;
            const quantitySuit = grid[0].length;
            const resultSizeGrid = checkSizeGrid(quantityLine, quantitySuit, nextLineIndex, nextSuitIndex);

            if (resultSizeGrid && grid[nextLineIndex][nextSuitIndex] === currentSuit) {
                dfs(currentSuit, nextLineIndex, nextSuitIndex)
            }
        }

        return true;
    }

    function checkSizeGrid(quantityLine, quantitySuit, nextLineIndex, nextSuitIndex) {
        return 0 <= nextLineIndex && nextLineIndex < quantityLine && 0 <= nextSuitIndex && nextSuitIndex < quantitySuit;
    }

    function clickHandler() {
        let grid = getGrid();
        let lineIndex = $(this).parent().data('line-index');
        let suitIndex = $(this).data('suit-index');
        let suit = grid[lineIndex][suitIndex];

        if (SUIT.indexOf(suit) !== -1) {
            const resultChangeGrid = dfs(suit, lineIndex, suitIndex);

            if(resultChangeGrid) drawnPlayingCard();
        }

    }

    function drawnPlayingCard() {

        const grid = getGrid();
        const $gameBoxLines = $(`#${ID_GAME} .game-box__lines`);
        const $prototypeLine = $('<div/>').addClass('game-box__line');
        const $prototypeSuit = $('<span/>').addClass(SUIT_ELEMENT);

        $gameBoxLines.empty();

        for (const [index, suitLine] of grid.entries()) {
            let $newLine = $prototypeLine.clone().data('line-index', index);

            for (const [index, suit] of suitLine.entries()) {
                let $newSuit = $prototypeSuit.clone().data('suit-index', index);
                let text = suit ? `&${suit};` : '';

                $newSuit.addClass(suit).html(text);
                $newLine.append($newSuit);
            }

            $gameBoxLines.append($newLine);
        }

        $(`#${ID_GAME} .${SUIT_ELEMENT}`).on('click', clickHandler);
    }

});