$(function () {
    const ID_GAME = 'game-2';
    const suitGrid = [
        ['spades', 'spades', 'clubs', 'diams', 'clubs', 'clubs'],
        ['spades', 'spades', 'clubs', 'diams', 'diams', 'diams'],
        ['spades', 'clubs', 'clubs', 'diams', 'diams', 'diams'],
        ['spades', 'clubs', 'clubs', 'clubs', 'clubs', 'diams'],
        ['hearts', 'clubs', 'clubs', 'clubs', 'hearts', 'hearts'],
        ['hearts', 'hearts', 'clubs', 'clubs', 'diams', 'clubs'],
        ['hearts', 'hearts', 'hearts', 'spades', 'spades', 'clubs']
    ];

    const $gameBoxLines = $(`#${ID_GAME} .game-box__lines`);
    const $prototypeLine = $('<div/>').addClass('game-box__line');
    const $prototypeSuit = $('<span/>').addClass('game-box__suit');

    $gameBoxLines.empty();

    for (const suitLine of suitGrid) {
        let $newLine = $prototypeLine.clone();

        for (const suit of suitLine) {
            let $newSuit = $prototypeSuit.clone();

            $newSuit.addClass(suit).html(`&${suit};`);
            $newLine.append($newSuit);
        }

        $gameBoxLines.append($newLine);
    }
});