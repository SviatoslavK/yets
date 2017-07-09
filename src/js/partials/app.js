/**
* @fileOverview
* @author Zoltan Toth
* @version 3.0.0
*/

/**
* @description
* 1Kb (gzipped) pure JavaScript carousel with all the basic features.
*
* @class
* @param {object} options - User defined settings for the carousel.
* @param {string} options.elem [options.elem=carousel] - The HTML id of the carousel container.
* @param {(boolean)} [options.infinite=false] - Enables infinite mode for the carousel.
* @param {(boolean)} [options.autoplay=false] - Enables auto play for slides.
* @param {number} [options.interval=3000] - The interval between slide change.
* @param {number} [options.show=0] - Index of the slide to start on. Numeration begins at 0.
*
* @param {(boolean)} [options.dots=true] - Display navigation dots.
* @param {(boolean)} [options.arrows=true] - Display navigation arrows (PREV/NEXT).
* @param {(boolean)} [options.buttons=true] - Display navigation buttons (STOP/PLAY).
*
* @param {(string)} [options.btnPlayText=Play] - Text for _PLAY_ button.
* @param {(string)} [options.btnStopText=Stop] - Text for _STOP_ button.
* @param {(string)} [options.arrPrevText=&laquo;] - Text for _PREV_ arrow.
* @param {(string)} [options.arrNextText=&raquo;] - Text for _NEXT_ arrow.
*/
function Carousel(options) {
    var element  = document.getElementById(options.elem || 'carousel'),
        interval = options.interval || 3000,

        btnPlayText = options.btnPlayText || 'Play',
        btnStopText = options.btnStopText || 'Stop',

        arrNextText = options.arrNextText || '&rsaquo;',
        arrPrevText = options.arrPrevText || '&lsaquo;',

        crslClass           = 'js-Carousel',
        crslArrowPrevClass  = 'js-Carousel-arrowPrev',
        crslArrowNextClass  = 'js-Carousel-arrowNext',
        crslDotsClass       = 'js-Carousel-dots',
        crslButtonStopClass = 'js-Carousel-btnStop',
        crslButtonPlayClass = 'js-Carousel-btnPlay',

        count   = element.querySelectorAll('li').length,
        current = 0,
        cycle   = null;

    /**
    * Render the carousel if more than one slide. 
    * Otherwise just show the single item.
    */
    if (count > 1) {
        render();
    }

    /**
    * Render the carousel and all the navigation elements (arrows, dots, 
    * play/stop buttons) if needed. Start with a particular slide, if set.
    * If infinite - move the last item to the very beginning and off the display area.
    */
    function render() {
        var actions = {
            dots: function() {
                return showDots();
            },
            arrows: function() {
                return showArrows();
            },
            buttons: function() {
                return showButtons();
            },
            autoplay: function() {
                return play();
            },
            infinite: function() {
                return moveItem(count - 1, -element.offsetWidth + 'px', 'afterBegin');
            },
            initial: function() {
                var initial = 0 || (options.initial >= count) ? count : options.initial;
                return show(initial);
            }
        };

        for (var key in actions) {
            if (options.hasOwnProperty(key) && options[key]) {
                actions[key]();
            }
        }
    }

    /**
    * Helper for moving items - last to be first or first to be the last. Needed 
    * for infinite rotation of the carousel.
    *
    * @param {number} i - Position of the list item to move (either first or last).
    * @param {number} marginLeft - Left margin to position the item off-screen
    *        at the beginning or no margin at the end.
    * @param {string} position - Where to insert the item. One of the following -
    *        'afterBegin' or 'beforeEnd'.
    */
    function moveItem(i, marginLeft, position) {
        var itemToMove = element.querySelectorAll('.' + crslClass + ' > ul li')[i];
        itemToMove.style.marginLeft = marginLeft;

        element.querySelector('.' + crslClass + ' > ul')
          .removeChild(itemToMove);

        element.querySelector('.' + crslClass + ' > ul')
          .insertAdjacentHTML(position, itemToMove.outerHTML);
    }

    /**
    * Create the navigation dots and attach to carousel.
    */
    function showDots() {
        var dotContainer = document.createElement('ul');
        dotContainer.classList.add(crslDotsClass);
        dotContainer.addEventListener('click', scrollToImage.bind(this));

        for (var i = 0; i < count; i++) {
            var dotElement = document.createElement('li');
            dotElement.setAttribute('data-position', i);

            dotContainer.appendChild(dotElement);
        }

        element.appendChild(dotContainer);
        currentDot();
    }

    /**
    * Highlight the corresponding dot of the currently visible carousel item.
    */
    function currentDot() {
        [].forEach.call(element.querySelectorAll('.' + crslDotsClass + ' li'), function(item) {
            item.classList.remove('is-active');
        });

        switch (current) {
            case -1:
                current = count - 1;
                break;
            case count:
                current = 0;
                break;
            default:
                current = current;
        }

        element.querySelectorAll('.' + crslDotsClass + ' li')[current].classList.add('is-active');
    }

    /**
    * Moves the carousel to the desired slide on a navigation dot click.
    *
    * @param {object} e - The clicked dot element.
    */
    function scrollToImage(e) {
        if (e.target.tagName === 'LI') {
            show(e.target.getAttribute('data-position'));
        }
    }

    /**
    * Create the navigation arrows (prev/next) and attach to carousel.
    */
    function showArrows() {
        var buttonPrev = document.createElement('button');
        buttonPrev.innerHTML = arrPrevText;
        buttonPrev.classList.add(crslArrowPrevClass);

        var buttonNext = document.createElement('button');
        buttonNext.innerHTML = arrNextText;
        buttonNext.classList.add(crslArrowNextClass);

        buttonPrev.addEventListener('click', showPrev);
        buttonNext.addEventListener('click', showNext);

        element.appendChild(buttonPrev);
        element.appendChild(buttonNext);
    }

    /**
    * Create the navigation buttons (play/stop) and attach to carousel.
    */
    function showButtons() {
        var buttonPlay = document.createElement('button');
        buttonPlay.innerHTML = btnPlayText;
        buttonPlay.classList.add(crslButtonPlayClass);
        buttonPlay.addEventListener('click', play);

        var buttonStop = document.createElement('button');
        buttonStop.innerHTML = btnStopText;
        buttonStop.classList.add(crslButtonStopClass);
        buttonStop.addEventListener('click', stop);

        element.appendChild(buttonPlay);
        element.appendChild(buttonStop);
    }

    /**
    * Animate the carousel to go back 1 slide. Moves the very first (off-screen)
    * item to the visible area.
    *
    * @param {object} item - The element to move into view.
    */
    function animatePrev(item) {
        item.style.marginLeft = '';
    }

    /**
    * Animate the carousel to go forward 1 slide.
    *
    * @param {object} item - The element to move into view.
    */
    function animateNext(item) {
        item.style.marginLeft = -element.offsetWidth + 'px';
    }

    /**
    * Move the carousel to the desired slide.
    *
    * @param {number} slide - The index of the item.
    * @public
    */
    function show(slide) {
        var delta = current - slide;

        if (delta < 0) {
            moveByDelta(-delta, showNext);
        } else {
            moveByDelta(delta, showPrev);
        }
    }

    /**
    * Helper to move the slides by index.
    * 
    * @param {number} delta - how many slides to move.
    * @param {function} direction - function to move forward or back.
    */
    function moveByDelta(delta, direction) {
        for (var i = 0; i < delta; i++) {
            direction();
        }
    }

    /**
    * Move the carousel back.
    * 
    * @public
    */
    function showPrev() {
        if (options.infinite) {
            showPrevInfinite();
        } else {
            showPrevLinear();
        }
    }

    /**
    * Helper function to show the previous slide for INFINITE carousel.
    * Do the sliding, move the last item to the very beginning.
    */
    function showPrevInfinite() {
        animatePrev(document.querySelectorAll('.' + crslClass + ' > ul li')[0]);
        moveItem(count - 1, -element.offsetWidth + 'px', 'afterBegin');

        adjustCurrent(-1);
    }

    /**
    * Helper function to show the previous slide for LINEAR carousel.
    * Stop the autoplay if user goes back. If on the first slide - do nothing.
    */
    function showPrevLinear() {
        stop();
        if (current === 0) {
            return;
        }
        animatePrev(document.querySelectorAll('.' + crslClass + ' > ul li')[current - 1]);
        
        adjustCurrent(-1);
    }

    /**
    * Move the carousel forward.
    * 
    * @public
    */
    function showNext() {
        if (options.infinite) {
            showNextInfinite();
        } else {
            showNextLinear();
        }
    }

    /**
    * Helper function to show the next slide for INFINITE carousel.
    * Do the sliding, move the second item to the very end.
    */
    function showNextInfinite() {
        animateNext(document.querySelectorAll('.' + crslClass + ' > ul li')[1]);
        moveItem(0, '', 'beforeEnd');

        adjustCurrent(1);
    }

    /**
    * Helper function to show the next slide for LINEAR carousel.
    * If on the last slide - stop the play and do nothing else.
    */
    function showNextLinear() {
        if (current === count - 1) {
            stop();
            return;
        }
        animateNext(document.querySelectorAll('.' + crslClass + ' > ul li')[current]);

        adjustCurrent(1);
    }

    /**
    * Adjust _current_ and highlight the respective dot.
    *
    * @param {number} val - defines which way current should be corrected.
    */
    function adjustCurrent(val) {
        current += val;

        if (options.dots) {
            currentDot();
        }
    }

    /**
    * Start the auto play.
    * If already playing do nothing.
    * 
    * @public
    */
    function play() {
        if (cycle) {
            return;
        }
        cycle = setInterval(showNext.bind(this), interval);
    }

    /**
    * Stop the auto play.
    * 
    * @public
    */
    function stop() {
        clearInterval(cycle);
        cycle = null;
    }

    /**
    * Returns the current slide index.
    * 
    * @public
    */
    function live() {
        return current;
    }

    return {
        'live': live,
        'show': show,
        'prev': showPrev,
        'next': showNext,
        'play': play,
        'stop': stop
    };
}





// //header img 
let headerBlock = document.querySelector('.header');
let headerImg = document.querySelector('.header__images');
    headerImg.style.left = -(1920 - headerBlock.clientWidth)/2 + 'px';


var carousel = new Carousel({
    elem: 'carousel',    // id of the carousel container
    autoplay: true,     // starts the rotation automatically
    infinite: true,      // enables the infinite mode
    interval: 3000,      // interval between slide changes
    initial: 0,          // slide to start with
    dots: false,          // show navigation dots
    arrows: false,        // show navigation arrows
    buttons: false,      // hide play/stop buttons,
    btnStopText: 'Pause' // STOP button text
});
// // Slider 
// (function () {
//     "use strict";

//     function Carousel(setting) {
//         if (document.querySelector(setting.wrap) === null) {
//             console.error(`Carousel not fount selector ${setting.wrap}`);
//             return;
//         }

//         /* Scope privates methods and properties */
//         let privates = {},
//             xDown, yDown, xUp, yUp, xDiff, yDiff;

//         /* Public methods */
//         // Prev slide
//         this.prev_slide = () => {
//             if (!privates.isAnimationEnd) {
//                 return;
//             }

//             privates.isAnimationEnd = false;

//             --privates.opt.position;

//             if (privates.opt.position < 0) {
//                 privates.sel.wrap.classList.add('s-notransition');
//                 privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.max_position}00%)`;
//                 privates.opt.position = privates.opt.max_position - 1;
//             }

//             setTimeout(() => {
//                 privates.sel.wrap.classList.remove('s-notransition');
//                 privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;
//             }, 10);

//             privates.sel.wrap.addEventListener('transitionend', () => {
//                 privates.isAnimationEnd = true;
//             });

//             if (privates.setting.autoplay === true) {
//                 privates.timer.become();
//             }
//         };

//         // Next slide
//         this.next_slide = () => {
//             if (!privates.isAnimationEnd) {
//                 return;
//             }

//             privates.isAnimationEnd = false;

//             if (privates.opt.position < privates.opt.max_position) {
//                 ++privates.opt.position;
//             }

//             privates.sel.wrap.classList.remove('s-notransition');
//             privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;

//             privates.sel.wrap.addEventListener('transitionend', () => {
//                 if (privates.opt.position >= privates.opt.max_position) {
//                     privates.sel.wrap.style["transform"] = 'translateX(0)';
//                     privates.sel.wrap.classList.add('s-notransition');
//                     privates.opt.position = 0;
//                 }

//                 privates.isAnimationEnd = true;
//             });

//             if (privates.setting.autoplay === true) {
//                 privates.timer.become();
//             }
//         };

//         // Pause timer carousel
//         this.pause = () => {
//             if (privates.setting.autoplay === true) {
//                 privates.timer.pause();
//             }
//         };

//         // Become timer carousel
//         this.become = (autoplayDelay = privates.setting.autoplayDelay) => {
//             if (privates.setting.autoplay === true) {
//                 privates.setting.autoplayDelay = autoplayDelay;
//                 privates.timer.become();
//             }
//         };

//         // Go to
//         this.goto = (index) => {
//             privates.opt.position = index - 1;
//             this.next_slide();
//         };

//         // Item
//         this.index = () => {
//             return privates.opt.position;
//         };

//         /* privates methods */
//         privates.hts = (e) => {
//             xDown = e.touches[0].clientX;
//             yDown = e.touches[0].clientY;
//         };

//         privates.htm = (e) => {
//             if (!xDown || !yDown) {
//                 return;
//             }

//             xUp = e.touches[0].clientX;
//             yUp = e.touches[0].clientY;

//             xDiff = xDown - xUp;
//             yDiff = yDown - yUp;

//             if (Math.abs(xDiff) > Math.abs(yDiff)) {
//                 if (xDiff > 0) {
//                     this.next_slide();
//                 } else {
//                     this.prev_slide();
//                 }
//             }

//             xDown = 0;
//             yDown = 0;
//         }

//         /* privates properties */
//         privates.default = {
//             "touch": true,
//             "autoplay": false,
//             "autoplayDelay": 3000,
//             "pauseOnFocus": true,
//             "pauseOnHover": true
//         };

//         privates.setting = Object.assign(privates.default, setting);

//         privates.isAnimationEnd = true;

//         privates.sel = {
//             "wrap": document.querySelector(privates.setting.wrap),
//             "children": document.querySelector(privates.setting.wrap).children,
//             "prev": document.querySelector(privates.setting.prev),
//             "next": document.querySelector(privates.setting.next)
//         };

//         privates.opt = {
//             "position": 0,
//             "max_position": document.querySelector(privates.setting.wrap).children.length
//         };


//         /* Constructor */
//         // Clone first elem to end wrap
//         privates.sel.wrap.appendChild(privates.sel.children[0].cloneNode(true));


//         // Autoplay
//         if (privates.setting.autoplay === true) {
//             privates.timer = new Timer(this.next_slide, privates.setting.autoplayDelay);
//         }


//         // Control
//         if (privates.sel.prev !== null) {
//             privates.sel.prev.addEventListener('click', () => {
//                 this.prev_slide();
//             });
//         }

//         if (privates.sel.next !== null) {
//             privates.sel.next.addEventListener('click', () => {
//                 this.next_slide();
//             });
//         }

//         // Touch events
//         if (privates.setting.touch === true) {
//             privates.sel.wrap.addEventListener('touchstart', privates.hts, false);
//             privates.sel.wrap.addEventListener('touchmove', privates.htm, false);
//         }

//         // Pause on hover
//         if (privates.setting.autoplay === true && privates.setting.pauseOnHover === true) {
//             privates.sel.wrap.addEventListener('mouseenter', () => {
//                 privates.timer.pause();
//             });

//             privates.sel.wrap.addEventListener('mouseleave', () => {
//                 privates.timer.become();
//             });
//         }


//     }

//     function Timer(callback, delay) {
//         /* privates properties */
//         let timerId, start, remaining = delay;

//         /* Public methods */
//         this.resume = () => {
//             start = new Date();
//             timerId = setTimeout(() => {
//                 remaining = delay;
//                 this.resume();
//                 callback();
//             }, remaining);
//         };

//         this.pause = () => {
//             clearTimeout(timerId);
//             remaining -= new Date() - start;
//         };

//         this.become = () => {
//             clearTimeout(timerId);
//             remaining = delay;

//             this.resume();
//         };

//         /* Constructor */
//         this.resume();
//     }

//     let a = new Carousel({
//         "wrap": ".js-carousel__wrap",
//         "prev": ".js-carousel__prev",
//         "next": ".js-carousel__next",
//         "touch": true,
//         "autoplay": true,
//         "autoplayDelay": 3000
//     });

// })();


let avatars = [...document.querySelectorAll('.client__ava')];
let layout = document.querySelector('.clients');

const hoverAva = (e) => {
    let ava = e.target;
    let otherEl = avatars.filter(a => a !== ava)
    let tL = ava.parentElement;
    let sL = ava.parentElement.parentElement;
    let fL = ava.parentElement.parentElement.parentElement;

    if (ava.classList.value === 'client__ava') {
        let client = ava.parentElement.parentElement.parentElement.parentElement;
        let overlay = document.createElement('div')
        overlay.classList = 'comment__overlay';

        if (!ava.hasAttribute('checked')) {
            ava.setAttribute('checked', '')
            ava.appendChild(overlay);
            fL.style.borderColor = 'transparent'
            sL.style.borderColor = 'transparent'
            tL.style.borderColor = 'transparent'
            otherEl.map(el => el.parentElement.parentElement.parentElement.parentElement.classList.add('hiddensss'));
        } 
        // else {
        //     ava.removeAttribute('checked')
        //     document.querySelector('.comment__overlay').remove();
        //     otherEl.map(el => el.parentElement.parentElement.parentElement.parentElement.classList.remove('hiddensss'))
        // }
    }
}
avatars.map(a => {
    a.addEventListener('click', hoverAva);
})
const disableComment = () => {
    document.querySelector('.comment__overlay').remove();
    avatars.map(el => {
        el.removeAttribute('checked');
        el.parentElement.parentElement.parentElement.parentElement.classList.remove('hiddensss');
        el.parentElement.parentElement.parentElement.style.borderColor = '#E6E6E6'
        el.parentElement.parentElement.style.borderColor = '#FF0A44'
        el.parentElement.style.borderColor = '#C8C8C8'
    })
}
document.addEventListener('click', (e) => {
    if (e.target.classList.value === 'comment__overlay' || e.target.classList.value === 'comment__close') {
        disableComment();
    }
})

