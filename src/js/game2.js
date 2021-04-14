$(function () {
    const ID_GAME = 'game-2';
    const SUIT_ELEMENT = 'game-box__suit';
    const SUIT = ['spades', 'clubs', 'diams', 'hearts'];
    const SUIT_GRID = [
        ['spades', 'spades', 'clubs', 'diams', 'clubs', 'clubs'],
        ['spades', 'spades', 'clubs', 'diams', 'diams', 'diams'],
        ['spades', 'clubs', 'clubs', 'diams', 'diams', 'diams'],
        ['spades', 'clubs', 'clubs', 'clubs', 'clubs', 'diams'],
        ['hearts', 'clubs', 'clubs', 'clubs', 'hearts', 'hearts'],
        ['hearts', 'hearts', 'clubs', 'clubs', 'diams', 'clubs'],
        ['hearts', 'hearts', 'hearts', 'spades', 'spades', 'clubs']
    ];

    drawnPlayingCard(SUIT_GRID);

    function clickHandler() {
        let lineIndex = $(this).parent().data('line-index');
        let suitIndex = $(this).data('suit-index');
        let suit = SUIT_GRID[lineIndex][suitIndex];

        if (SUIT.indexOf(suit) !== -1) {
            let newSuitGrid = dfs(suit, SUIT_GRID, lineIndex, suitIndex);
            drawnPlayingCard(newSuitGrid);
        }

    }

    function drawnPlayingCard(grid) {

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


    function dfs(currentSuit, suitGrid, currentLineIndex, currentSuitIndex) {
        suitGrid[currentLineIndex][currentSuitIndex] = '';

        const right = [0, 1];
        const up = [1, 0];
        const left = [0, -1];
        const down = [-1, 0];

        for (const [suitIndex, lineIndex] of [right, up, left, down]) {
            const nextLineIndex = currentLineIndex + lineIndex;
            const nextSuitIndex = currentSuitIndex + suitIndex;
            const quantityLine = suitGrid.length;
            const quantitySuit = suitGrid[0].length;
            const resultSizeGrid = checkSizeGrid(quantityLine, quantitySuit, nextLineIndex, nextSuitIndex);


            if (resultSizeGrid && suitGrid[nextLineIndex][nextSuitIndex] === currentSuit) {
                dfs(currentSuit, suitGrid, nextLineIndex, nextSuitIndex)
            }
        }

        return suitGrid;
    }

    function checkSizeGrid(quantityLine, quantitySuit, nextLineIndex, nextSuitIndex) {
        return 0 <= nextLineIndex && nextLineIndex < quantityLine && 0 <= nextSuitIndex && nextSuitIndex < quantitySuit;
    }
});