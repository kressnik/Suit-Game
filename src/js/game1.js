$(function() {
    const ID_GAME = 'game-1';
    const SUIT_ELEMENT = 'game-box__suit';
    const ACTIVE_CLASS = 'game-box__suit--active';
    const SUIT = ['spades', 'clubs', 'diams', 'hearts'];

    $(`#${ID_GAME} .${SUIT_ELEMENT}`).on('click', clickHandler);

    function clickHandler() {
        $(`#${ID_GAME} .${SUIT_ELEMENT}`).removeClass(ACTIVE_CLASS);
        const currentEl = $(this);
        const currentSuit = getSuitClass(currentEl);

        activateEl(currentEl, currentSuit);

        if($('[name="actions"]:checked').val() == 'del') {
            $(`#${ID_GAME} .${ACTIVE_CLASS}`).empty().removeClass(ACTIVE_CLASS);
        }
    }
    
    function activateEl(currentEl, currentSuit) {
        for (const element of createData(currentEl)) {
            if(currentSuit === element.class) {
                element.element.addClass(ACTIVE_CLASS);
                if(!element.active) {
                    activateEl(element.element, currentSuit);
                }
            }
        }
    }

    function createData(currentEl) {
        const currentLine = currentEl.parent();
        const prevLine = currentLine.prev().find(`:eq(${currentEl.index()})`);
        const nextLine = currentLine.next().find(`:eq(${currentEl.index()})`);
        const elemets = [
            currentEl, 
            currentEl.prev(), 
            currentEl.next(),
            prevLine,
            nextLine,
        ];

        return elemets.map(element => {
            return {
                element,
                active: getStatusActive(element),
                class: getSuitClass(element),
            }
        });
    }

    function getClasses(element) {
        return !element.length ? [] : element.attr('class').split(/\s+/);
    }

    function getSuitClass(element) {
        return getClasses(element).filter(className => SUIT.indexOf(className) !== -1).join(); 
    }

    function getStatusActive(element) {
        return getClasses(element).indexOf(ACTIVE_CLASS) === -1 ? false : true; 
    }
});