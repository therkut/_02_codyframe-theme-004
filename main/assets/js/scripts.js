// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
    var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
    if( menuBtns.length > 0 ) {
      for(var i = 0; i < menuBtns.length; i++) {(function(i){
        initMenuBtn(menuBtns[i]);
      })(i);}
  
      function initMenuBtn(btn) {
        btn.addEventListener('click', function(event){	
          event.preventDefault();
          var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
          Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
          // emit custom event
          var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
          btn.dispatchEvent(event);
        });
      };
    }
  }());
// File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
    var TextAnim = function(element) {
      this.element = element;
      this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
      this.words = this.element.getElementsByClassName('js-text-anim__word');
      this.selectedWord = 0;
      // interval between two animations
      this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
      // duration of single animation (e.g., time for a single word to rotate)
      this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
      // keep animating after first loop was completed
      this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
      this.wordInClass = 'text-anim__word--in';
      this.wordOutClass = 'text-anim__word--out';
      // check for specific animations
      this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
      if(this.isClipAnim) {
        this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
        this.animPulseClass = 'text-anim__wrapper--pulse';
      }
      initTextAnim(this);
    };
  
    function initTextAnim(element) {
      // make sure there's a word with the wordInClass
      setSelectedWord(element);
      // if clip animation -> add pulse class
      if(element.isClipAnim) {
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
      }
      // init loop
      loopWords(element);
    };
  
    function setSelectedWord(element) {
      var selectedWord = element.element.getElementsByClassName(element.wordInClass);
      if(selectedWord.length == 0) {
        Util.addClass(element.words[0], element.wordInClass);
      } else {
        element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
      }
    };
  
    function loopWords(element) {
      // stop animation after first loop was completed
      if(!element.loop && element.selectedWord == element.words.length - 1) {
        return;
      }
      var newWordIndex = getNewWordIndex(element);
      setTimeout(function() {
        if(element.isClipAnim) { // clip animation only
          switchClipWords(element, newWordIndex);
        } else {
          switchWords(element, newWordIndex);
        }
      }, element.loopInterval);
    };
  
    function switchWords(element, newWordIndex) {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[element.selectedWord], element.wordOutClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      // reset loop
      resetLoop(element, newWordIndex);
    };
  
    function resetLoop(element, newIndex) {
      setTimeout(function() { 
        // set new selected word
        Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
        element.selectedWord = newIndex;
        loopWords(element); // restart loop
      }, element.transitionDuration);
    };
  
    function switchClipWords(element, newWordIndex) {
      // clip animation only
      var startWidth =  element.words[element.selectedWord].offsetWidth,
        endWidth = element.words[newWordIndex].offsetWidth;
      
      // remove pulsing animation
      Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
      // close word
      animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // switch words
        Util.removeClass(element.words[element.selectedWord], element.wordInClass);
        Util.addClass(element.words[newWordIndex], element.wordInClass);
        element.selectedWord = newWordIndex;
  
        // open word
        animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
          // add pulsing class
          Util.addClass(element.wordsWrapper[0], element.animPulseClass);
          loopWords(element);
        });
      });
    };
  
    function getNewWordIndex(element) {
      // get index of new word to be shown
      var index = element.selectedWord + 1;
      if(index >= element.words.length) index = 0;
      return index;
    };
  
    function animateWidth(start, to, element, duration, cb) {
      // animate width of a word for the clip animation
      var currentTime = null;
  
      var animateProperty = function(timestamp){  
        if (!currentTime) currentTime = timestamp;         
        var progress = timestamp - currentTime;
        
        var val = Math.easeInOutQuart(progress, start, to - start, duration);
        element.style.width = val+"px";
        if(progress < duration) {
            window.requestAnimationFrame(animateProperty);
        } else {
          cb();
        }
      };
    
      //set the width of the element before starting animation -> fix bug on Safari
      element.style.width = start+"px";
      window.requestAnimationFrame(animateProperty);
    };
  
    window.TextAnim = TextAnim;
  
    // init TextAnim objects
    var textAnim = document.getElementsByClassName('js-text-anim'),
      reducedMotion = Util.osHasReducedMotion();
    if( textAnim ) {
      if(reducedMotion) return;
      for( var i = 0; i < textAnim.length; i++) {
        (function(i){ new TextAnim(textAnim[i]);})(i);
      }
    }
  }());
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function() {
    var backTop = document.getElementsByClassName('js-back-to-top')[0];
    if( backTop ) {
      var dataElement = backTop.getAttribute('data-element');
      var scrollElement = dataElement ? document.querySelector(dataElement) : window;
      var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
        scrollOffsetInit = parseInt(backTop.getAttribute('data-offset-in')) || parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
        scrollOffsetOutInit = parseInt(backTop.getAttribute('data-offset-out')) || 0, 
        scrollOffset = 0,
        scrollOffsetOut = 0,
        scrolling = false;
  
      // check if target-in/target-out have been set
      var targetIn = backTop.getAttribute('data-target-in') ? document.querySelector(backTop.getAttribute('data-target-in')) : false,
        targetOut = backTop.getAttribute('data-target-out') ? document.querySelector(backTop.getAttribute('data-target-out')) : false;
  
      updateOffsets();
      
      //detect click on back-to-top link
      backTop.addEventListener('click', function(event) {
        event.preventDefault();
        if(!window.requestAnimationFrame) {
          scrollElement.scrollTo(0, 0);
        } else {
          dataElement ? Util.scrollTo(0, scrollDuration, false, scrollElement) : Util.scrollTo(0, scrollDuration);
        } 
        //move the focus to the #top-element - don't break keyboard navigation
        Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
      });
      
      //listen to the window scroll and update back-to-top visibility
      checkBackToTop();
      if (scrollOffset > 0 || scrollOffsetOut > 0) {
        scrollElement.addEventListener("scroll", function(event) {
          if( !scrolling ) {
            scrolling = true;
            (!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
          }
        });
      }
  
      function checkBackToTop() {
        updateOffsets();
        var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
        if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
        var condition =  windowTop >= scrollOffset;
        if(scrollOffsetOut > 0) {
          condition = (windowTop >= scrollOffset) && (window.innerHeight + windowTop < scrollOffsetOut);
        }
        Util.toggleClass(backTop, 'back-to-top--is-visible', condition);
        scrolling = false;
      }
  
      function updateOffsets() {
        scrollOffset = getOffset(targetIn, scrollOffsetInit, true);
        scrollOffsetOut = getOffset(targetOut, scrollOffsetOutInit);
      }
  
      function getOffset(target, startOffset, bool) {
        var offset = 0;
        if(target) {
          var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
          if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
          var boundingClientRect = target.getBoundingClientRect();
          offset = bool ? boundingClientRect.bottom : boundingClientRect.top;
          offset = offset + windowTop;
        }
        if(startOffset && startOffset) {
          offset = offset + parseInt(startOffset);
        }
        return offset;
      }
    }
  }());
(function() {
    var darkThemeSelected = checkDarkTheme();
    if (darkThemeSelected)
        document.getElementsByTagName("html")[0].setAttribute('data-theme', 'dark');
    function checkDarkTheme() {
        var darkThemestorage = (localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'dark')
          , lightThemestorage = (localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'light')
          , darkThemeMatchMedia = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return (darkThemestorage || (darkThemeMatchMedia && !lightThemestorage));
    }
    ;
}());

// File#: _1_expandable-search
// Usage: codyhouse.co/license
(function() {
    var expandableSearch = document.getElementsByClassName('js-expandable-search');
    if(expandableSearch.length > 0) {
      for( var i = 0; i < expandableSearch.length; i++) {
        (function(i){ // if user types in search input, keep the input expanded when focus is lost
          expandableSearch[i].getElementsByClassName('js-expandable-search__input')[0].addEventListener('input', function(event){
            Util.toggleClass(event.target, 'expandable-search__input--has-content', event.target.value.length > 0);
          });
        })(i);
      }
    }
  }());
// File#: _1_reading-progressbar
// Usage: codyhouse.co/license
(function() {
  var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
    readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
  
  if( readingIndicator && readingIndicatorContent) {
    var progressInfo = [],
      progressEvent = false,
      progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
      progressIsSupported = 'value' in readingIndicator;

    var boundingClientRect = readingIndicatorContent.getBoundingClientRect();

    progressInfo['height'] = readingIndicatorContent.offsetHeight;
    progressInfo['top'] = boundingClientRect.top;
    progressInfo['bottom'] = boundingClientRect.bottom;
    progressInfo['window'] = window.innerHeight;
    progressInfo['class'] = 'reading-progressbar--is-active';
    progressInfo['hideClass'] = 'reading-progressbar--is-out';
    
    //init indicator
    setProgressIndicator();
    // wait for font to be loaded - reset progress bar
    if(document.fonts) {
      document.fonts.ready.then(function() {
        triggerReset();
      });
    }
    // listen to window resize - update progress
    window.addEventListener('resize', function(event){
      triggerReset();
    });

    //listen to the window scroll event - update progress
    window.addEventListener('scroll', function(event){
      if(progressEvent) return;
      progressEvent = true;
      (!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
    });
    
    function setProgressIndicator() {
      var boundingClientRect = readingIndicatorContent.getBoundingClientRect();
      progressInfo['top'] = boundingClientRect.top;
      progressInfo['bottom'] = boundingClientRect.bottom;

      if(progressInfo['height'] <= progressInfo['window']) {
        // short content - hide progress indicator
        Util.removeClass(readingIndicator, progressInfo['class']);
        progressEvent = false;
        return;
      }
      // get new progress and update element
      Util.addClass(readingIndicator, progressInfo['class']);
      var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
      readingIndicator.setAttribute('value', value);
      if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
      // hide progress bar when target is outside the viewport
      Util.toggleClass(readingIndicator, progressInfo['hideClass'], progressInfo['bottom'] <= 0);
      progressEvent = false;
    };

    function triggerReset() {
      if(progressEvent) return;
      progressEvent = true;
      (!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
    };

    function resetProgressIndicator() {
      progressInfo['height'] = readingIndicatorContent.offsetHeight;
      progressInfo['window'] = window.innerHeight;
      setProgressIndicator();
    };
  }
}());
// File#: _1_responsive-sidebar
// Usage: codyhouse.co/license
(function() {
  var Sidebar = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = "sidebar--is-visible";
    this.staticClass = "sidebar--static";
    this.customStaticClass = "";
    this.readyClass = "sidebar--loaded";
    this.contentReadyClass = "sidebar-loaded:show";
    this.layout = false; // this will be static or mobile
    this.preventScrollEl = getPreventScrollEl(this);
    getCustomStaticClass(this); // custom classes for static version
    initSidebar(this);
  };

  function getPreventScrollEl(element) {
    var scrollEl = false;
    var querySelector = element.element.getAttribute('data-sidebar-prevent-scroll');
    if(querySelector) scrollEl = document.querySelector(querySelector);
    return scrollEl;
  };

  function getCustomStaticClass(element) {
    var customClasses = element.element.getAttribute('data-static-class');
    if(customClasses) element.customStaticClass = ' '+customClasses;
  };
  
  function initSidebar(sidebar) {
    initSidebarResize(sidebar); // handle changes in layout -> mobile to static and viceversa
    
    if ( sidebar.triggers ) { // open sidebar when clicking on trigger buttons - mobile layout only
      for(var i = 0; i < sidebar.triggers.length; i++) {
        sidebar.triggers[i].addEventListener('click', function(event) {
          event.preventDefault();
          toggleSidebar(sidebar, event.target);
        });
      }
    }

    // use the 'openSidebar' event to trigger the sidebar
    sidebar.element.addEventListener('openSidebar', function(event) {
      toggleSidebar(sidebar, event.detail);
    });
  };

  function toggleSidebar(sidebar, target) {
    if(Util.hasClass(sidebar.element, sidebar.showClass)) {
      sidebar.selectedTrigger = target;
      closeSidebar(sidebar);
      return;
    }
    sidebar.selectedTrigger = target;
    showSidebar(sidebar);
    initSidebarEvents(sidebar);
  };

  function showSidebar(sidebar) { // mobile layout only
    Util.addClass(sidebar.element, sidebar.showClass);
    getFocusableElements(sidebar);
    Util.moveFocus(sidebar.element);
    // change the overflow of the preventScrollEl
    if(sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = 'hidden';
  };

  function closeSidebar(sidebar) { // mobile layout only
    Util.removeClass(sidebar.element, sidebar.showClass);
    sidebar.firstFocusable = null;
    sidebar.lastFocusable = null;
    if(sidebar.selectedTrigger) sidebar.selectedTrigger.focus();
    sidebar.element.removeAttribute('tabindex');
    //remove listeners
    cancelSidebarEvents(sidebar);
    // change the overflow of the preventScrollEl
    if(sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = '';
  };

  function initSidebarEvents(sidebar) { // mobile layout only
    //add event listeners
    sidebar.element.addEventListener('keydown', handleEvent.bind(sidebar));
    sidebar.element.addEventListener('click', handleEvent.bind(sidebar));
  };

  function cancelSidebarEvents(sidebar) { // mobile layout only
    //remove event listeners
    sidebar.element.removeEventListener('keydown', handleEvent.bind(sidebar));
    sidebar.element.removeEventListener('click', handleEvent.bind(sidebar));
  };

  function handleEvent(event) { // mobile layout only
    switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
    }
  };

  function initKeyDown(sidebar, event) { // mobile layout only
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close sidebar window on esc
      closeSidebar(sidebar);
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside sidebar
      trapFocus(sidebar, event);
    }
  };

  function initClick(sidebar, event) { // mobile layout only
    //close sidebar when clicking on close button or sidebar bg layer 
    if( !event.target.closest('.js-sidebar__close-btn') && !Util.hasClass(event.target, 'js-sidebar') ) return;
    event.preventDefault();
    closeSidebar(sidebar);
  };

  function trapFocus(sidebar, event) { // mobile layout only
    if( sidebar.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of sidebar
      event.preventDefault();
      sidebar.lastFocusable.focus();
    }
    if( sidebar.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of sidebar
      event.preventDefault();
      sidebar.firstFocusable.focus();
    }
  };

  function initSidebarResize(sidebar) {
    // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
    var beforeContent = getComputedStyle(sidebar.element, ':before').getPropertyValue('content');
    if(beforeContent && beforeContent !='' && beforeContent !='none') {
      checkSidebarLayout(sidebar);

      sidebar.element.addEventListener('update-sidebar', function(event){
        checkSidebarLayout(sidebar);
      });
    } 
    // check if there a main element to show
    var mainContent = document.getElementsByClassName(sidebar.contentReadyClass);
    if(mainContent.length > 0) Util.removeClass(mainContent[0], sidebar.contentReadyClass);
    Util.addClass(sidebar.element, sidebar.readyClass);
  };

  function checkSidebarLayout(sidebar) {
    var layout = getComputedStyle(sidebar.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if(layout == sidebar.layout) return;
    sidebar.layout = layout;
    if(layout != 'static') Util.addClass(sidebar.element, 'is-hidden');
    Util.toggleClass(sidebar.element, sidebar.staticClass + sidebar.customStaticClass, layout == 'static');
    if(layout != 'static') setTimeout(function(){Util.removeClass(sidebar.element, 'is-hidden')});
    // reset element role 
    (layout == 'static') ? sidebar.element.removeAttribute('role', 'alertdialog') :  sidebar.element.setAttribute('role', 'alertdialog');
    // reset mobile behaviour
    if(layout == 'static' && Util.hasClass(sidebar.element, sidebar.showClass)) closeSidebar(sidebar);
  };

  function getFocusableElements(sidebar) {
    //get all focusable elements inside the drawer
    var allFocusable = sidebar.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstVisible(sidebar, allFocusable);
    getLastVisible(sidebar, allFocusable);
  };

  function getFirstVisible(sidebar, elements) {
    //get first visible focusable element inside the sidebar
    for(var i = 0; i < elements.length; i++) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        sidebar.firstFocusable = elements[i];
        return true;
      }
    }
  };

  function getLastVisible(sidebar, elements) {
    //get last visible focusable element inside the sidebar
    for(var i = elements.length - 1; i >= 0; i--) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        sidebar.lastFocusable = elements[i];
        return true;
      }
    }
  };

  window.Sidebar = Sidebar;

  //initialize the Sidebar objects
  var sidebar = document.getElementsByClassName('js-sidebar');
  if( sidebar.length > 0 ) {
    for( var i = 0; i < sidebar.length; i++) {
      (function(i){new Sidebar(sidebar[i]);})(i);
    }
    // switch from mobile to static layout
    var customEvent = new CustomEvent('update-sidebar');
    window.addEventListener('resize', function(event){
      (!window.requestAnimationFrame) ? setTimeout(function(){resetLayout();}, 250) : window.requestAnimationFrame(resetLayout);
    });

    (window.requestAnimationFrame) // init sidebar layout
      ? window.requestAnimationFrame(resetLayout)
      : resetLayout();

    function resetLayout() {
      for( var i = 0; i < sidebar.length; i++) {
        (function(i){sidebar[i].dispatchEvent(customEvent)})(i);
      };
    };
  }
}());
// File#: _1_side-navigation
// Usage: codyhouse.co/license
(function() {
    function initSideNav(nav) {
      nav.addEventListener('click', function(event){
        var btn = event.target.closest('.js-sidenav__sublist-control');
        if(!btn) return;
        var listItem = btn.parentElement,
          bool = Util.hasClass(listItem, 'sidenav__item--expanded');
        btn.setAttribute('aria-expanded', !bool);
        Util.toggleClass(listItem, 'sidenav__item--expanded', !bool);
      });
    };
  
    var sideNavs = document.getElementsByClassName('js-sidenav');
    if( sideNavs.length > 0 ) {
      for( var i = 0; i < sideNavs.length; i++) {
        (function(i){initSideNav(sideNavs[i]);})(i);
      }
    }
  }());
// File#: _1_social-sharing
// Usage: codyhouse.co/license
(function() {
    function initSocialShare(button) {
      button.addEventListener('click', function(event){
        event.preventDefault();
        var social = button.getAttribute('data-social');
        var url = getSocialUrl(button, social);
        (social == 'mail')
          ? window.location.href = url
          : window.open(url, social+'-share-dialog', 'width=626,height=436');
      });
    };
  
    function getSocialUrl(button, social) {
      var params = getSocialParams(social);
      var newUrl = '';
      for(var i = 0; i < params.length; i++) {
        var paramValue = button.getAttribute('data-'+params[i]);
        if(params[i] == 'hashtags') paramValue = encodeURI(paramValue.replace(/\#| /g, ''));
        if(paramValue) {
          (social == 'facebook') 
            ? newUrl = newUrl + 'u='+encodeURIComponent(paramValue)+'&'
            : newUrl = newUrl + params[i]+'='+encodeURIComponent(paramValue)+'&';
        }
      }
      if(social == 'linkedin') newUrl = 'mini=true&'+newUrl;
      return button.getAttribute('href')+'?'+newUrl;
    };
  
    function getSocialParams(social) {
      var params = [];
      switch (social) {
        case 'twitter':
          params = ['text', 'hashtags'];
          break;
        case 'facebook':
        case 'linkedin':
          params = ['url'];
          break;
        case 'pinterest':
          params = ['url', 'media', 'description'];
          break;
        case 'mail':
          params = ['subject', 'body'];
          break;
      }
      return params;
    };
  
    var socialShare = document.getElementsByClassName('js-social-share');
    if(socialShare.length > 0) {
      for( var i = 0; i < socialShare.length; i++) {
        (function(i){initSocialShare(socialShare[i])})(i);
      }
    }
  }());
// File#: _1_sticky-banner
// Usage: codyhouse.co/license
(function() {
    var StickyBanner = function(element) {
      this.element = element;
      this.offsetIn = 0;
      this.offsetOut = 0;
      this.targetIn = this.element.getAttribute('data-target-in') ? document.querySelector(this.element.getAttribute('data-target-in')) : false;
      this.targetOut = this.element.getAttribute('data-target-out') ? document.querySelector(this.element.getAttribute('data-target-out')) : false;
      this.reset = 0;
      // check if the window is the scrollable element
      this.dataElement = this.element.getAttribute('data-scrollable-element') || this.element.getAttribute('data-element');
      this.scrollElement = this.dataElement ? document.querySelector(this.dataElement) : window;
      if(!this.scrollElement) this.scrollElement = window;
      this.scrollingId = false;
      getBannerOffsets(this);
      initBanner(this);
    };
  
    function getBannerOffsets(element) { // get offset in and offset out values
      // update offsetIn
      element.offsetIn = 0;
      var windowTop = getScrollTop(element);
  
      if(element.targetIn) {
        var boundingClientRect = element.targetIn.getBoundingClientRect();
        element.offsetIn = boundingClientRect.top + windowTop + boundingClientRect.height;
      }
      var dataOffsetIn = element.element.getAttribute('data-offset-in');
      if(dataOffsetIn) {
        element.offsetIn = element.offsetIn + parseInt(dataOffsetIn);
      }
      // update offsetOut
      element.offsetOut = 0;
      if(element.targetOut) {
        var boundingClientRect = element.targetOut.getBoundingClientRect();
        element.offsetOut = boundingClientRect.top + windowTop - window.innerHeight;
      }
      var dataOffsetOut = element.element.getAttribute('data-offset-out');
      if(dataOffsetOut) {
        element.offsetOut = element.offsetOut + parseInt(dataOffsetOut);
      }
    };
  
    function initBanner(element) {
      resetBannerVisibility(element);
  
      element.element.addEventListener('resize-banner', function(){
        getBannerOffsets(element);
        resetBannerVisibility(element);
      });
  
      element.element.addEventListener('scroll-banner', function(){
        if(element.reset < 10) {
          getBannerOffsets(element);
          element.reset = element.reset + 1;
        }
        resetBannerVisibility(element);
      });
  
      if(element.dataElement && element.scrollElement) {
        // the scrollable element is different from the window - detect the scrolling
        element.scrollElement.addEventListener('scroll', function(event){
          if(element.scrollingId) return;
          element.scrollingId = true;
          window.requestAnimationFrame(function(){
            element.element.dispatchEvent(new CustomEvent('scroll-banner'));
            element.scrollingId = false;
          })
        });
      }
    };
  
    function resetBannerVisibility(element) {
      var scrollTop = getScrollTop(element),
        topTarget = false,
        bottomTarget = false;
      if(element.offsetIn <= scrollTop) {
        topTarget = true;
      }
      if(element.offsetOut == 0 || scrollTop < element.offsetOut) {
        bottomTarget = true;
      }
  
      Util.toggleClass(element.element, 'sticky-banner--visible', bottomTarget && topTarget);
    };
  
    function getScrollTop(element) {
      // the scrollable element could be different from the window element
      var windowTop = element.scrollElement.scrollTop || document.documentElement.scrollTop;
      if(!element.dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
      return windowTop;
    };
  
    //initialize the Sticky Banner objects
    var stckyBanner = document.getElementsByClassName('js-sticky-banner');
    if( stckyBanner.length > 0 ) {
      for( var i = 0; i < stckyBanner.length; i++) {
        (function(i){new StickyBanner(stckyBanner[i]);})(i);
      }
      
      // init scroll/resize
      var resizingId = false,
        scrollingId = false,
        resizeEvent = new CustomEvent('resize-banner'),
        scrollEvent = new CustomEvent('scroll-banner');
      
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(function(){
          doneResizing(resizeEvent);
        }, 300);
      });
  
      window.addEventListener('scroll', function(event){
        if(scrollingId) return;
        scrollingId = true;
        window.requestAnimationFrame 
          ? window.requestAnimationFrame(function(){
            doneResizing(scrollEvent);
            scrollingId = false;
          })
          : setTimeout(function(){
            doneResizing(scrollEvent);
            scrollingId = false;
          }, 200);
  
        resizingId = setTimeout(function(){
          doneResizing(resizeEvent);
        }, 300);
      });
  
      function doneResizing(event) {
        for( var i = 0; i < stckyBanner.length; i++) {
          (function(i){stckyBanner[i].dispatchEvent(event)})(i);
        };
      };
    }
  }());
// File#: _1_sticky-hero
// Usage: codyhouse.co/license
(function() {
    var StickyBackground = function(element) {
      this.element = element;
      this.scrollingElement = this.element.getElementsByClassName('sticky-hero__content')[0];
      this.nextElement = this.element.nextElementSibling;
      this.scrollingTreshold = 0;
      this.nextTreshold = 0;
      initStickyEffect(this);
    };
  
    function initStickyEffect(element) {
      var observer = new IntersectionObserver(stickyCallback.bind(element), { threshold: [0, 0.1, 1] });
      observer.observe(element.scrollingElement);
      if(element.nextElement) observer.observe(element.nextElement);
    };
  
    function stickyCallback(entries, observer) {
      var threshold = entries[0].intersectionRatio.toFixed(1);
      (entries[0].target ==  this.scrollingElement)
        ? this.scrollingTreshold = threshold
        : this.nextTreshold = threshold;
  
      Util.toggleClass(this.element, 'sticky-hero--media-is-fixed', (this.nextTreshold > 0 || this.scrollingTreshold > 0));
    };
  
  
    var stickyBackground = document.getElementsByClassName('js-sticky-hero'),
      intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    if(stickyBackground.length > 0 && intersectionObserverSupported) { // if IntersectionObserver is not supported, animations won't be triggeres
      for(var i = 0; i < stickyBackground.length; i++) {
        (function(i){ // if animations are enabled -> init the StickyBackground object
          if( Util.hasClass(stickyBackground[i], 'sticky-hero--overlay-layer') || Util.hasClass(stickyBackground[i], 'sticky-hero--scale')) new StickyBackground(stickyBackground[i]);
        })(i);
      }
    }
  }());
// File#: _1_theme-switch
// Usage: codyhouse.co/license


  (function() {
  var t = document.getElementById("switch-light-dark");
  if (t) {
      var e = document.getElementsByTagName("html")[0]
        , n = t.querySelector('input[value="dark"]');
      "dark" == e.getAttribute("data-theme") && (n.checked = !0),
      t.addEventListener("change", function(t) {
          "dark" == t.target.value ? (e.setAttribute("data-theme", "dark"),
          localStorage.setItem("themeSwitch", "dark")) : (e.removeAttribute("data-theme"),
          localStorage.setItem("themeSwitch", "light"))
      })
  }
}());

// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
    var flexHeader = document.getElementsByClassName('js-f-header');
    if(flexHeader.length > 0) {
      var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
        firstFocusableElement = getMenuFirstFocusable();
  
      // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
      var focusMenu = false;
  
      resetFlexHeaderOffset();
      setAriaButtons();
  
      menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
        toggleMenuNavigation(event.detail);
      });
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        // listen for esc key
        if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
          // close navigation on mobile if open
          if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
            focusMenu = menuTrigger; // move focus to menu trigger when menu is close
            menuTrigger.click();
          }
        }
        // listen for tab key
        if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
          // close navigation on mobile if open when nav loses focus
          if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
        }
      });
  
      // detect click on a dropdown control button - expand-on-mobile only
      flexHeader[0].addEventListener('click', function(event){
        var btnLink = event.target.closest('.js-f-header__dropdown-control');
        if(!btnLink) return;
        !btnLink.getAttribute('aria-expanded') ? btnLink.setAttribute('aria-expanded', 'true') : btnLink.removeAttribute('aria-expanded');
      });
  
      // detect mouseout from a dropdown control button - expand-on-mobile only
      flexHeader[0].addEventListener('mouseout', function(event){
        var btnLink = event.target.closest('.js-f-header__dropdown-control');
        if(!btnLink) return;
        // check layout type
        if(getLayout() == 'mobile') return;
        btnLink.removeAttribute('aria-expanded');
      });
  
      // close dropdown on focusout - expand-on-mobile only
      flexHeader[0].addEventListener('focusin', function(event){
        var btnLink = event.target.closest('.js-f-header__dropdown-control'),
          dropdown = event.target.closest('.f-header__dropdown');
        if(dropdown) return;
        if(btnLink && btnLink.hasAttribute('aria-expanded')) return;
        // check layout type
        if(getLayout() == 'mobile') return;
        var openDropdown = flexHeader[0].querySelector('.js-f-header__dropdown-control[aria-expanded="true"]');
        if(openDropdown) openDropdown.removeAttribute('aria-expanded');
      });
  
      // listen for resize
      var resizingId = false;
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });
  
      function getMenuFirstFocusable() {
        var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
          firstFocusable = false;
        for(var i = 0; i < focusableEle.length; i++) {
          if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
            firstFocusable = focusableEle[i];
            break;
          }
        }
  
        return firstFocusable;
      };
      
      function isVisible(element) {
        return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      };
  
      function doneResizing() {
        if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
          menuTrigger.click();
        }
        resetFlexHeaderOffset();
      };
      
      function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
        Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
        Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
        menuTrigger.setAttribute('aria-expanded', bool);
        if(bool) firstFocusableElement.focus(); // move focus to first focusable element
        else if(focusMenu) {
          focusMenu.focus();
          focusMenu = false;
        }
      };
  
      function resetFlexHeaderOffset() {
        // on mobile -> update max height of the flexi header based on its offset value (e.g., if there's a fixed pre-header element)
        document.documentElement.style.setProperty('--f-header-offset', flexHeader[0].getBoundingClientRect().top+'px');
      };
  
      function setAriaButtons() {
        var btnDropdown = flexHeader[0].getElementsByClassName('js-f-header__dropdown-control');
        for(var i = 0; i < btnDropdown.length; i++) {
          var id = 'f-header-dropdown-'+i,
            dropdown = btnDropdown[i].nextElementSibling;
          if(dropdown.hasAttribute('id')) {
            id = dropdown.getAttribute('id');
          } else {
            dropdown.setAttribute('id', id);
          }
          btnDropdown[i].setAttribute('aria-controls', id);	
        }
      };
  
      function getLayout() {
        return getComputedStyle(flexHeader[0], ':before').getPropertyValue('content').replace(/\'|"/g, '');
      };
    }
  }());
// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function() {
    var StickyShareBar = function(element) {
      this.element = element;
      this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
      this.contentTargetOut = document.getElementsByClassName('js-sticky-sharebar-target-out');
      this.showClass = 'sticky-sharebar--on-target';
      this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
      initShareBar(this);
      initTargetOut(this);
    };
  
    function initShareBar(shareBar) {
      if(shareBar.contentTarget.length < 1) {
        shareBar.showSharebar = true;
        Util.addClass(shareBar.element, shareBar.showClass);
        return;
      }
      if(intersectionObserverSupported) {
        shareBar.showSharebar = false;
        initObserver(shareBar); // update anchor appearance on scroll
      } else {
        Util.addClass(shareBar.element, shareBar.showClass);
      }
    };
  
    function initObserver(shareBar) { // target of Sharebar
      var observer = new IntersectionObserver(
        function(entries, observer) { 
          shareBar.showSharebar = entries[0].isIntersecting;
          toggleSharebar(shareBar);
        }, 
        {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
      );
      observer.observe(shareBar.contentTarget[0]);
    };
  
    function initTargetOut(shareBar) { // target out of Sharebar
      shareBar.hideSharebar = false;
      if(shareBar.contentTargetOut.length < 1) {
        return;
      }
      var observer = new IntersectionObserver(
        function(entries, observer) { 
          shareBar.hideSharebar = entries[0].isIntersecting;
          toggleSharebar(shareBar);
        }
      );
      observer.observe(shareBar.contentTargetOut[0]);
    };
  
    function toggleSharebar(shareBar) {
      Util.toggleClass(shareBar.element, shareBar.showClass, shareBar.showSharebar && !shareBar.hideSharebar);
    };
  
    //initialize the StickyShareBar objects
    var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
      intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    
    if( stickyShareBar.length > 0 ) {
      for( var i = 0; i < stickyShareBar.length; i++) {
        (function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
      }
    }
  }());
console.log("%cHi there! 👋 This page is for demo purposes only. We have minified HTML, CSS and JavaScript and shortened class names.", "font-size:14px");console.log("%cAny doubts, get in touch at therkut01@gmail.com", "font-size:12px");

    