(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * flash的应用信息
 */
module.exports = {
   //domain: 'g-assets.daily.taobao.net',
    domain: 'g.alicdn.com',
    flashVersion: '1.2.12',
    h5Version: '1.5.7',
    logReportTo: '//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track'
};

},{}],2:[function(require,module,exports){
/** 
 * @fileoverview prismplayer的入口模块
 */

var FlashPlayer = require('./player/flashplayer');
var Dom = require('./lib/dom');
var UA = require('./lib/ua');
var _ = require('./lib/object');
var cfg = require('./config');
//var swfobj=require('./lib/swfobject');

var prism = function  (opt) {
	var id = opt.id,
		tag;
	
	//如果是一个字符串，我们就认为是元素的id
	if('string' === typeof id){
		
		// id为#string的情况
		if (id.indexOf('#') === 0) {
			id = id.slice(1);
		}

		// 如果在此id上创建过prismplayer实例，返回该实例
		if (prism.players[id]) {
			return prism.players[id];
		} else {
			tag = Dom.el(id);
		}

	} else {
		//否则就认为是dom 元素
		tag = id;
	}

	if(!tag || !tag.nodeName){
		 throw new TypeError('没有为播放器指定容器');
	}

	var option = _.merge(prism.defaultOpt, opt);

	if (option.width) {
		tag.style.width = option.width;
	}
    if (option.height) {
        var per_idx = option.height.indexOf("%");
        if (per_idx > 0)
        {
            var screen_height = window.screen.height;
            var per_value = option.height.replace("%", "");
            if(!isNaN(per_value))
            {
                var scale_value = screen_height * 9 * parseInt(per_value) / 1000;
                tag.style.height = String(scale_value % 2 ? scale_value + 1: scale_value) + "px";
            }
            else
            {
                tag.style.height = option.height;
            }
        }
        else
        {
            tag.style.height = option.height;
        }
    }

	//如果tag已指向一个存在的player，则返回这个player实例
	//否则初始化播放器
	return tag['player'] || new FlashPlayer(tag, option);
}

var prismplayer = window['prismplayer'] = prism;

//全局变量，记录所有的播放器
prism.players = {};

/**
 * 默认的配置项
 */
prism.defaultOpt = {
	preload: false,                     // 是否预加载
	autoplay: true,                    // 是否自动播放 默认为自动播放
	useNativeControls: false,           // 是否使用默认的控制面板
	width: '100%',                      // 播放器宽度
	height: '300px',                    // 播放器高度
	cover: '',                          // 默认封面图
	from: 'prism_aliyun',                    // 渠道来源
	trackLog: true,                     // 是否需要打点
	waterMark:"",					// swf水印配置 http://taobao.com/wm.swf||BR||11123 以||分割url||对齐方式||参数
	isLive:false,						//是否为直播状态(直播暂时只有flash版本支持)
	playsinline:false, 					//是否启用在页面播放
    showBarTime:5000,
    rePlay:false,
	/* vid 淘宝视频的视频id，必填 */    // 视频id
	skinRes: '//' + cfg.domain + '/de/prismplayer-flash/' + cfg.flashVersion + '/atlas/defaultSkin',  // String, ui皮肤图片地址，非必填，不填使用默认，纯h5播放器可以不考虑这个字段
	skinLayout: [                            // false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
		{name:"bigPlayButton", align:"blabs", x:30, y:80},
		{
			name:"controlBar", align:"blabs", x:0, y:0,
			children: [
				{name:"progress", align:"tlabs", x: 0, y:0},
				{name:"playButton", align:"tl", x:15, y:26},
				{name:"nextButton", align:"tl", x:10, y:26},
				{name:"timeDisplay", align:"tl", x:10, y:24},
				{name:"fullScreenButton", align:"tr", x:10, y:25},
				//{name:"setButton", align:"tr", x:0, y:25},
				{name:"streamButton", align:"tr", x:10, y:23},
				{name:"volume", align:"tr", x:10, y:25}
			]
		},
		{
			name:"fullControlBar", align:"tlabs", x:0, y:0,
			children: [
				{name:"fullTitle", align:"tl", x:25, y:6},
				{name:"fullNormalScreenButton", align:"tr", x:24, y:13},
				{name:"fullTimeDisplay", align:"tr", x:10, y:12},
				{name:"fullZoom", align:"cc"}
			]
		}
	]
}

// AMD
if (typeof define === 'function' && define['amd']) {
	  define([], function(){ return prismplayer; });
// commonjs, 支持browserify
} else if (typeof exports === 'object' && typeof module === 'object') {
	  module['exports'] = prismplayer;
}

},{"./config":1,"./lib/dom":4,"./lib/object":8,"./lib/ua":10,"./player/flashplayer":11}],3:[function(require,module,exports){
var _ = require('./object');

/**
 * Element Data Store. Allows for binding data to an element without putting it directly on the element.
 * Ex. Event listneres are stored here.
 * (also from jsninja.com, slightly modified and updated for closure compiler)
 * @type {Object}
 * @private
 */
module.exports.cache = {};

/**
 * Unique ID for an element or function
 * @type {Number}
 * @private
 */
module.exports.guid = function(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	} else {
		var r;
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random()*16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
};

/**
 * Unique attribute name to store an element's guid in
 * @type {String}
 * @constant
 * @private
 */
module.exports.expando = 'vdata' + (new Date()).getTime();

/**
 * Returns the cache object where data for an element is stored
 * @param  {Element} el Element to store data for.
 * @return {Object}
 * @private
 */
module.exports.getData = function(el){
  var id = el[module.exports.expando];
  if (!id) {
    id = el[module.exports.expando] = module.exports.guid();
    module.exports.cache[id] = {};
  }
  return module.exports.cache[id];
};

/**
 * Returns the cache object where data for an element is stored
 * @param  {Element} el Element to store data for.
 * @return {Object}
 * @private
 */
module.exports.hasData = function(el){
  var id = el[module.exports.expando];
  return !(!id || _.isEmpty(module.exports.cache[id]));
};

/**
 * Delete data for the element from the cache and the guid attr from getElementById
 * @param  {Element} el Remove data for an element
 * @private
 */
module.exports.removeData = function(el){
  var id = el[module.exports.expando];
  if (!id) { return; }
  // Remove all stored data
  // Changed to = null
  // http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
  // module.exports.cache[id] = null;
  delete module.exports.cache[id];

  // Remove the expando property from the DOM node
  try {
    delete el[module.exports.expando];
  } catch(e) {
    if (el.removeAttribute) {
      el.removeAttribute(module.exports.expando);
    } else {
      // IE doesn't appear to support removeAttribute on the document element
      el[module.exports.expando] = null;
    }
  }
};

},{"./object":8}],4:[function(require,module,exports){
/**
 * @fileoverview 封装对dom元素的基本操作
 */

var _ = require('./object');

/**
 * 根据id获取dom
 */
module.exports.el = function(id){
  return document.getElementById(id);
}

/**
 * Creates an element and applies properties.
 * @param  {String=} tagName    Name of tag to be created.
 * @param  {Object=} properties Element properties to be applied.
 * @return {Element}
 * @private
 */
module.exports.createEl = function(tagName, properties){
  var el;

  tagName = tagName || 'div';
  properties = properties || {};

  el = document.createElement(tagName);

  _.each(properties, function(propName, val){
    // Not remembering why we were checking for dash
    // but using setAttribute means you have to use getAttribute

    // The check for dash checks for the aria-* attributes, like aria-label, aria-valuemin.
    // The additional check for "role" is because the default method for adding attributes does not
    // add the attribute "role". My guess is because it's not a valid attribute in some namespaces, although
    // browsers handle the attribute just fine. The W3C allows for aria-* attributes to be used in pre-HTML5 docs.
    // http://www.w3.org/TR/wai-aria-primer/#ariahtml. Using setAttribute gets around this problem.
    if (propName.indexOf('aria-') !== -1 || propName == 'role') {
     el.setAttribute(propName, val);
    } else {
     el[propName] = val;
    }
  });

  return el;
};

/**
 * Add a CSS class name to an element
 * @param {Element} element    Element to add class name to
 * @param {String} classToAdd Classname to add
 * @private
 */
module.exports.addClass = function(element, classToAdd){
  if ((' '+element.className+' ').indexOf(' '+classToAdd+' ') == -1) {
    element.className = element.className === '' ? classToAdd : element.className + ' ' + classToAdd;
  }
};

/**
 * Remove a CSS class name from an element
 * @param {Element} element    Element to remove from class name
 * @param {String} classToAdd Classname to remove
 * @private
 */
module.exports.removeClass = function(element, classToRemove){
  var classNames, i;

  if (element.className.indexOf(classToRemove) == -1) { return; }

  classNames = element.className.split(' ');

  // no arr.indexOf in ie8, and we don't want to add a big shim
  for (i = classNames.length - 1; i >= 0; i--) {
    if (classNames[i] === classToRemove) {
      classNames.splice(i,1);
    }
  }

  element.className = classNames.join(' ');
};

/**
 *
 */
module.exports.getElementAttributes = function(tag){
  var obj, knownBooleans, attrs, attrName, attrVal;

  obj = {};

  // known boolean attributes
  // we can check for matching boolean properties, but older browsers
  // won't know about HTML5 boolean attributes that we still read from
  knownBooleans = ','+'autoplay,controls,loop,muted,default'+',';

  if (tag && tag.attributes && tag.attributes.length > 0) {
    attrs = tag.attributes;

    for (var i = attrs.length - 1; i >= 0; i--) {
      attrName = attrs[i].name;
      attrVal = attrs[i].value;

      // check for known booleans
      // the matching element property will return a value for typeof
      if (typeof tag[attrName] === 'boolean' || knownBooleans.indexOf(','+attrName+',') !== -1) {
        // the value of an included boolean attribute is typically an empty
        // string ('') which would equal false if we just check for a false value.
        // we also don't want support bad code like autoplay='false'
        attrVal = (attrVal !== null) ? true : false;
      }

      obj[attrName] = attrVal;
    }
  }

  return obj;
};
/*

*/
module.exports.insertFirst = function(child, parent){
  if (parent.firstChild) {
    parent.insertBefore(child, parent.firstChild);
  } else {
    parent.appendChild(child);
  }
};

// Attempt to block the ability to select text while dragging controls
module.exports.blockTextSelection = function(){
  document.body.focus();
  document.onselectstart = function () { return false; };
};
// Turn off text selection blocking
module.exports.unblockTextSelection = function(){ document.onselectstart = function () { return true; }; };

/**
 * 设置或获取css属性
 */
module.exports.css = function(el, cssName, cssVal) {
	if (!el.style) return false;
	
	if (cssName && cssVal) {
		el.style[cssName] = cssVal;
		return true;
	
	} else if (!cssVal && typeof cssName === 'string') {
		return el.style[cssName];
	
	} else if (!cssVal && typeof cssName === 'object') {
		_.each(cssName, function(k, v) {
			el.style[k] = v;
		});
		return true;
	}

	return false;
};



},{"./object":8}],5:[function(require,module,exports){
var _ = require('./object');
var Data = require('./data');

/**
 * @fileoverview Event System (John Resig - Secrets of a JS Ninja http://jsninja.com/)
 * (Original book version wasn't completely usable, so fixed some things and made Closure Compiler compatible)
 * This should work very similarly to jQuery's events, however it's based off the book version which isn't as
 * robust as jquery's, so there's probably some differences.
 */

/**
 * Add an event listener to element
 * It stores the handler function in a separate cache object
 * and adds a generic handler to the element's event,
 * along with a unique id (guid) to the element.
 * @param  {Element|Object}   elem Element or object to bind listeners to
 * @param  {String|Array}   type Type of event to bind to.
 * @param  {Function} fn   Event listener.
 * @private
 */
module.exports.on = function(elem, type, fn){
  if (_.isArray(type)) {
    return _handleMultipleEvents(module.exports.on, elem, type, fn);
  }

  var data = Data.getData(elem);

  // We need a place to store all our handler data
  if (!data.handlers) data.handlers = {};

  if (!data.handlers[type]) data.handlers[type] = [];

  if (!fn.guid) fn.guid = Data.guid();

  data.handlers[type].push(fn);

  if (!data.dispatcher) {
    data.disabled = false;

    data.dispatcher = function (event){

      if (data.disabled) return;
      event = module.exports.fixEvent(event);

      var handlers = data.handlers[event.type];

      if (handlers) {
        // Copy handlers so if handlers are added/removed during the process it doesn't throw everything off.
        var handlersCopy = handlers.slice(0);

        for (var m = 0, n = handlersCopy.length; m < n; m++) {
          if (event.isImmediatePropagationStopped()) {
            break;
          } else {
            handlersCopy[m].call(elem, event);
          }
        }
      }
    };
  }

  if (data.handlers[type].length == 1) {
    if (elem.addEventListener) {
      elem.addEventListener(type, data.dispatcher, false);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + type, data.dispatcher);
    }
  }
};

/**
 * Removes event listeners from an element
 * @param  {Element|Object}   elem Object to remove listeners from
 * @param  {String|Array=}   type Type of listener to remove. Don't include to remove all events from element.
 * @param  {Function} fn   Specific listener to remove. Don't incldue to remove listeners for an event type.
 * @private
 */
module.exports.off = function(elem, type, fn) {
  // Don't want to add a cache object through getData if not needed
  if (!Data.hasData(elem)) return;

  var data = Data.getData(elem);

  // If no events exist, nothing to unbind
  if (!data.handlers) { return; }

  if (_.isArray(type)) {
    return _handleMultipleEvents(module.exports.off, elem, type, fn);
  }

  // Utility function
  var removeType = function(t){
     data.handlers[t] = [];
     module.exports.cleanUpEvents(elem,t);
  };

  // Are we removing all bound events?
  if (!type) {
    for (var t in data.handlers) removeType(t);
    return;
  }

  var handlers = data.handlers[type];

  // If no handlers exist, nothing to unbind
  if (!handlers) return;

  // If no listener was provided, remove all listeners for type
  if (!fn) {
    removeType(type);
    return;
  }

  // We're only removing a single handler
  if (fn.guid) {
    for (var n = 0; n < handlers.length; n++) {
      if (handlers[n].guid === fn.guid) {
        handlers.splice(n--, 1);
      }
    }
  }

  module.exports.cleanUpEvents(elem, type);
};

/**
 * Clean up the listener cache and dispatchers
 * @param  {Element|Object} elem Element to clean up
 * @param  {String} type Type of event to clean up
 * @private
 */
module.exports.cleanUpEvents = function(elem, type) {
  var data = Data.getData(elem);

  // Remove the events of a particular type if there are none left
  if (data.handlers[type].length === 0) {
    delete data.handlers[type];
    // data.handlers[type] = null;
    // Setting to null was causing an error with data.handlers

    // Remove the meta-handler from the element
    if (elem.removeEventListener) {
      elem.removeEventListener(type, data.dispatcher, false);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + type, data.dispatcher);
    }
  }

  // Remove the events object if there are no types left
  if (_.isEmpty(data.handlers)) {
    delete data.handlers;
    delete data.dispatcher;
    delete data.disabled;

    // data.handlers = null;
    // data.dispatcher = null;
    // data.disabled = null;
  }

  // Finally remove the expando if there is no data left
  if (_.isEmpty(data)) {
    Data.removeData(elem);
  }
};

/**
 * Fix a native event to have standard property values
 * @param  {Object} event Event object to fix
 * @return {Object}
 * @private
 */
module.exports.fixEvent = function(event) {

  function returnTrue() { return true; }
  function returnFalse() { return false; }

  // Test if fixing up is needed
  // Used to check if !event.stopPropagation instead of isPropagationStopped
  // But native events return true for stopPropagation, but don't have
  // other expected methods like isPropagationStopped. Seems to be a problem
  // with the Javascript Ninja code. So we're just overriding all events now.
  if (!event || !event.isPropagationStopped) {
    var old = event || window.event;

    event = {};
    // Clone the old object so that we can modify the values event = {};
    // IE8 Doesn't like when you mess with native event properties
    // Firefox returns false for event.hasOwnProperty('type') and other props
    //  which makes copying more difficult.
    // TODO: Probably best to create a whitelist of event props
    for (var key in old) {
      // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
      // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
      if (key !== 'layerX' && key !== 'layerY' && key !== 'keyboardEvent.keyLocation') {
        // Chrome 32+ warns if you try to copy deprecated returnValue, but
        // we still want to if preventDefault isn't supported (IE8).
        if (!(key == 'returnValue' && old.preventDefault)) {
          event[key] = old[key];
        }
      }
    }

    // The event occurred on this element
    if (!event.target) {
      event.target = event.srcElement || document;
    }

    // Handle which other element the event is related to
    event.relatedTarget = event.fromElement === event.target ?
      event.toElement :
      event.fromElement;

    // Stop the default browser action
    event.preventDefault = function () {
      if (old.preventDefault) {
        old.preventDefault();
      }
      event.returnValue = false;
      event.isDefaultPrevented = returnTrue;
      event.defaultPrevented = true;
    };

    event.isDefaultPrevented = returnFalse;
    event.defaultPrevented = false;

    // Stop the event from bubbling
    event.stopPropagation = function () {
      if (old.stopPropagation) {
        old.stopPropagation();
      }
      event.cancelBubble = true;
      event.isPropagationStopped = returnTrue;
    };

    event.isPropagationStopped = returnFalse;

    // Stop the event from bubbling and executing other handlers
    event.stopImmediatePropagation = function () {
      if (old.stopImmediatePropagation) {
        old.stopImmediatePropagation();
      }
      event.isImmediatePropagationStopped = returnTrue;
      event.stopPropagation();
    };

    event.isImmediatePropagationStopped = returnFalse;

    // Handle mouse position
    if (event.clientX != null) {
      var doc = document.documentElement, body = document.body;

      event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
        (doc && doc.scrollTop || body && body.scrollTop || 0) -
        (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // Handle key presses
    event.which = event.charCode || event.keyCode;

    // Fix button for mouse clicks:
    // 0 == left; 1 == middle; 2 == right
    if (event.button != null) {
      event.button = (event.button & 1 ? 0 :
        (event.button & 4 ? 1 :
          (event.button & 2 ? 2 : 0)));
    }
  }

  // Returns fixed-up instance
  return event;
};

/**
 * Trigger an event for an element
 * @param  {Element|Object}      elem  Element to trigger an event on
 * @param  {Event|Object|String} event A string (the type) or an event object with a type attribute
 * @private
 */
module.exports.trigger = function(elem, event) {
  // Fetches element data and a reference to the parent (for bubbling).
  // Don't want to add a data object to cache for every parent,
  // so checking hasData first.

  var elemData = (Data.hasData(elem)) ? Data.getData(elem) : {};
  var parent = elem.parentNode || elem.ownerDocument;
      // type = event.type || event,
      // handler;

  // If an event name was passed as a string, creates an event out of it
  if (typeof event === 'string') {
    var paramData = null;
    if(elem.paramData){
      paramData = elem.paramData;
      elem.paramData = null;
      elem.removeAttribute(paramData);
    }
    event = { type:event, target:elem, paramData:paramData };
  }
  // Normalizes the event properties.
  event = module.exports.fixEvent(event);

  // If the passed element has a dispatcher, executes the established handlers.
  if (elemData.dispatcher) {
    elemData.dispatcher.call(elem, event);
  }

  // Unless explicitly stopped or the event does not bubble (e.g. media events)
    // recursively calls this function to bubble the event up the DOM.
  if (parent && !event.isPropagationStopped() && event.bubbles !== false) {
    module.exports.trigger(parent, event);

  // If at the top of the DOM, triggers the default action unless disabled.
  } else if (!parent && !event.defaultPrevented) {
    var targetData = Data.getData(event.target);

    // Checks if the target has a default action for this event.
    if (event.target[event.type]) {
      // Temporarily disables event dispatching on the target as we have already executed the handler.
      targetData.disabled = true;
      // Executes the default action.
      if (typeof event.target[event.type] === 'function') {
        event.target[event.type]();
      }
      // Re-enables event dispatching.
      targetData.disabled = false;
    }
  }

  // Inform the triggerer if the default was prevented by returning false
  return !event.defaultPrevented;
};

/**
 * Trigger a listener only once for an event
 * @param  {Element|Object}   elem Element or object to
 * @param  {String|Array}   type
 * @param  {Function} fn
 * @private
 */
module.exports.one = function(elem, type, fn) {
  if (_.isArray(type)) {
    return _handleMultipleEvents(module.exports.one, elem, type, fn);
  }
  var func = function(){
    module.exports.off(elem, type, func);
    fn.apply(this, arguments);
  };
  // copy the guid to the new function so it can removed using the original function's ID
  func.guid = fn.guid = fn.guid || Data.guid();
  module.exports.on(elem, type, func);
};

/**
 * Loops through an array of event types and calls the requested method for each type.
 * @param  {Function} fn   The event method we want to use.
 * @param  {Element|Object} elem Element or object to bind listeners to
 * @param  {String}   type Type of event to bind to.
 * @param  {Function} callback   Event listener.
 * @private
 */
function _handleMultipleEvents(fn, elem, type, callback) {
  _.each(type, function(type) {
    fn(elem, type, callback); //Call the event method for each one of the types
  });
}

},{"./data":3,"./object":8}],6:[function(require,module,exports){
var Data = require('./data');

module.exports.bind = function(context, fn, uid) {
  // Make sure the function has a unique ID
  if (!fn.guid) { fn.guid = Data.guid(); }

  // Create the new function that changes the context
  var ret = function() {
    return fn.apply(context, arguments);
  };

  // Allow for the ability to individualize this function
  // Needed in the case where multiple objects might share the same prototype
  // IF both items add an event listener with the same function, then you try to remove just one
  // it will remove both because they both have the same guid.
  // when using this, you need to use the bind method when you remove the listener as well.
  // currently used in text tracks
  ret.guid = (uid) ? uid + '_' + fn.guid : fn.guid;

  return ret;
};

},{"./data":3}],7:[function(require,module,exports){
/**
 * @fileoverview 根据配置渲染ui组件在父级组件中的layout
 * @author 首作<aloysious.ld@taobao.com>
 * @date 2015-01-12
 *
 * ui组件与layout相关的配置项
 * align {String}   'cc'  绝对居中
 *                | 'tl'  左上对齐，组件向左浮动，并以左上角作为偏移原点
 *                | 'tr'  右上对齐，组件向右浮动，并以右上角作为偏移原点
 *                | 'tlabs' 以左上角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 *                | 'trabs' 以右上角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 *                | 'blabs' 以左下角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 *                | 'brabs' 以右下角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 * x     {Number} x轴的偏移量，align为'cc'时无效
 * y     {Number} y轴的偏移量，align为'cc'时无效
 */

var Dom = require('./dom');

/**
 * 根据配置渲染dom元素的layout
 * @param el  {HTMLElement} dom元素
 * @param opt {Object}      layout配置对象
 */
module.exports.render = function(el, opt) {
	var align = opt.align ? opt.align : 'tl',
		x = opt.x ? opt.x : 0,
		y = opt.y ? opt.y : 0;

	if (align === 'tl') {
		Dom.css(el, {
			'float': 'left',
			'margin-left': x + 'px',
			'margin-top': y+ 'px'
		});
	
	} else if (align === 'tr') {
		Dom.css(el, {
			'float': 'right',
			'margin-right': x + 'px',
			'margin-top': y+ 'px'
		});
	
	} else if (align === 'tlabs') {
		Dom.css(el, {
			'position': 'absolute',
			'left': x + 'px',
			'top': y + 'px'
		});
	
	} else if (align === 'trabs') {
		Dom.css(el, {
			'position': 'absolute',
			'right': x + 'px',
			'top': y + 'px'
		});
	
	} else if (align === 'blabs') {
		Dom.css(el, {
			'position': 'absolute',
			'left': x + 'px',
			'bottom': y + 'px'
		});
	
	} else if (align === 'brabs') {
		Dom.css(el, {
			'position': 'absolute',
			'right': x + 'px',
			'bottom': y + 'px'
		});

	} else if (align === 'cc') {
		Dom.css(el, {
			'position': 'absolute',
			'left': '50%',
			'top': '50%',
			'margin-top': ( el.offsetHeight / -2 ) + 'px',
			'margin-left': ( el.offsetWidth / -2 ) + 'px'
		});
	}
};

},{"./dom":4}],8:[function(require,module,exports){
var hasOwnProp = Object.prototype.hasOwnProperty;
/**
 * Object.create shim for prototypal inheritance
 *
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
 *
 * @function
 * @param  {Object}   obj Object to use as prototype
 * @private
 */
module.exports.create = Object.create || function(obj){
  //Create a new function called 'F' which is just an empty object.
  function F() {}

  //the prototype of the 'F' function should point to the
  //parameter of the anonymous function.
  F.prototype = obj;

  //create a new constructor function based off of the 'F' function.
  return new F();
};

/**
 * Loop through each property in an object and call a function
 * whose arguments are (key,value)
 * @param  {Object}   obj Object of properties
 * @param  {Function} fn  Function to be called on each property.
 * @this {*}
 * @private
 */

module.exports.isArray = function(arr){
  return Object.prototype.toString.call(arg) === '[object Array]';
}

module.exports.isEmpty = function(obj) {
  for (var prop in obj) {
    // Inlude null properties as empty.
    if (obj[prop] !== null) {
      return false;
    }
  }
  return true;
};


module.exports.each = function(obj, fn, context){
  //
  if(module.exports.isArray(obj)){
    for (var i = 0, len = obj.length; i < len; ++i) {
      if (fn.call(context || this, obj[i], i) === false) {
	  	break;
	  }
    }
  }else{
     for (var key in obj) {
      if (hasOwnProp.call(obj, key)) {
        // if (key=="code") {
        //   console.log(obj);
        // };
        // console.log(key);
        // console.log(obj[key]);
        if (fn.call(context || this, key, obj[key]) === false) {
			break;
		}
      }
     }   
  }

  return obj;
};

/**
 * Merge two objects together and return the original.
 * @param  {Object} obj1
 * @param  {Object} obj2
 * @return {Object}
 * @private
 */
module.exports.merge = function(obj1, obj2){
  if (!obj2) { return obj1; }
  for (var key in obj2){
    if (hasOwnProp.call(obj2, key)) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
};

/**
 * Merge two objects, and merge any properties that are objects
 * instead of just overwriting one. Uses to merge options hashes
 * where deeper default settings are important.
 * @param  {Object} obj1 Object to override
 * @param  {Object} obj2 Overriding object
 * @return {Object}      New object. Obj1 and Obj2 will be untouched.
 * @private
 */
module.exports.deepMerge = function(obj1, obj2){
  var key, val1, val2;

  // make a copy of obj1 so we're not ovewriting original values.
  // like prototype.options_ and all sub options objects
  obj1 = module.exports.copy(obj1);

  for (key in obj2){
    if (hasOwnProp.call(obj2, key)) {
      val1 = obj1[key];
      val2 = obj2[key];

      // Check if both properties are pure objects and do a deep merge if so
      if (module.exports.isPlain(val1) && module.exports.isPlain(val2)) {
        obj1[key] = module.exports.deepMerge(val1, val2);
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
};

/**
 * Make a copy of the supplied object
 * @param  {Object} obj Object to copy
 * @return {Object}     Copy of object
 * @private
 */
module.exports.copy = function(obj){
  return module.exports.merge({}, obj);
};

/**
 * Check if an object is plain, and not a dom node or any object sub-instance
 * @param  {Object} obj Object to check
 * @return {Boolean}     True if plain, false otherwise
 * @private
 */
module.exports.isPlain = function(obj){
  return !!obj
    && typeof obj === 'object'
    && obj.toString() === '[object Object]'
    && obj.constructor === Object;
};

/**
 * Check if an object is Array
*  Since instanceof Array will not work on arrays created in another frame we need to use Array.isArray, but since IE8 does not support Array.isArray we need this shim
 * @param  {Object} obj Object to check
 * @return {Boolean}     True if plain, false otherwise
 * @private
 */
module.exports.isArray = Array.isArray || function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

module.exports.unescape = function(str) {
	return str.replace(/&([^;]+);/g, function(m,$1) {
		return {
			'amp': '&',
			'lt': '<',
		   	'gt': '>',
		   	'quot': '"',
		   	'#x27': "'",
		   	'#x60': '`'
		}[$1.toLowerCase()] || m;
	});
};

},{}],9:[function(require,module,exports){
var _ = require('./object');

var oo = function(){};
// Manually exporting module.exports['oo'] here for Closure Compiler
// because of the use of the extend/create class methods
// If we didn't do this, those functions would get flattend to something like
// `a = ...` and `this.prototype` would refer to the global object instead of
// oo

var oo = function() {};
/**
 * Create a new object that inherits from this Object
 *
 *     var Animal = oo.extend();
 *     var Horse = Animal.extend();
 *
 * @param {Object} props Functions and properties to be applied to the
 *                       new object's prototype
 * @return {module.exports.oo} An object that inherits from oo
 * @this {*}
 */
oo.extend = function(props){
  var init, subObj;

  props = props || {};
  // Set up the constructor using the supplied init method
  // or using the init of the parent object
  // Make sure to check the unobfuscated version for external libs
  init = props['init'] || props.init || this.prototype['init'] || this.prototype.init || function(){};
  // In Resig's simple class inheritance (previously used) the constructor
  //  is a function that calls `this.init.apply(arguments)`
  // However that would prevent us from using `ParentObject.call(this);`
  //  in a Child constuctor because the `this` in `this.init`
  //  would still refer to the Child and cause an inifinite loop.
  // We would instead have to do
  //    `ParentObject.prototype.init.apply(this, argumnents);`
  //  Bleh. We're not creating a _super() function, so it's good to keep
  //  the parent constructor reference simple.
  subObj = function(){
    init.apply(this, arguments);
  };

  // Inherit from this object's prototype
  subObj.prototype = _.create(this.prototype);
  // Reset the constructor property for subObj otherwise
  // instances of subObj would have the constructor of the parent Object
  subObj.prototype.constructor = subObj;

  // Make the class extendable
  subObj.extend = oo.extend;
  // Make a function for creating instances
  subObj.create = oo.create;

  // Extend subObj's prototype with functions and other properties from props
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      subObj.prototype[name] = props[name];
    }
  }

  return subObj;
};

/**
 * Create a new instace of this Object class
 *
 *     var myAnimal = Animal.create();
 *
 * @return {module.exports.oo} An instance of a oo subclass
 * @this {*}
 */
oo.create = function(){
  // Create a new object that inherits from this object's prototype
  var inst = _.create(this.prototype);

  // Apply this constructor function to the new object
  this.apply(inst, arguments);

  // Return the new object
  return inst;
};

module.exports = oo;

},{"./object":8}],10:[function(require,module,exports){
module.exports.USER_AGENT = navigator.userAgent;

/**
 * Device is an iPhone
 * @type {Boolean}
 * @constant
 * @private
 */
module.exports.IS_IPHONE = (/iPhone/i).test(module.exports.USER_AGENT);
module.exports.IS_IPAD = (/iPad/i).test(module.exports.USER_AGENT);
module.exports.IS_IPOD = (/iPod/i).test(module.exports.USER_AGENT);
module.exports.IS_MAC = (/mac/i).test(module.exports.USER_AGENT);
module.exports.IS_SAFARI = (/Safari/i).test(module.exports.USER_AGENT);
module.exports.IS_CHROME = (/Chrome/i).test(module.exports.USER_AGENT);
module.exports.IS_FIREFOX = (/Firefox/i).test(module.exports.USER_AGENT);


if(document.all){  // IE
    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');  
    if (swf){
        module.exports.HAS_FLASH = true;
    } else {
        module.exports.HAS_FLASH = false;
    }
} else {  // others
    if (navigator.plugins && navigator.plugins.length > 0) {
        var swf = navigator.plugins["Shockwave Flash"];
        if (swf) {
            module.exports.HAS_FLASH = true;
        } else {
            module.exports.HAS_FLASH = false;
        }
    } else {
         module.exports.HAS_FLASH = false;
    }
}

module.exports.IS_MAC_SAFARI = module.exports.IS_MAC && module.exports.IS_SAFARI && (!module.exports.IS_CHROME) && (!module.exports.HAS_FLASH);
module.exports.IS_IOS = module.exports.IS_IPHONE || module.exports.IS_IPAD || module.exports.IS_IPOD || module.exports.IS_MAC_SAFARI;

module.exports.IOS_VERSION = (function(){
  var match = module.exports.USER_AGENT.match(/OS (\d+)_/i);
  if (match && match[1]) { return match[1]; }
})();

module.exports.IS_ANDROID = (/Android/i).test(module.exports.USER_AGENT);
module.exports.ANDROID_VERSION = (function() {
  // This matches Android Major.Minor.Patch versions
  // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
  var match = module.exports.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),
    major,
    minor;

  if (!match) {
    return null;
  }

  major = match[1] && parseFloat(match[1]);
  minor = match[2] && parseFloat(match[2]);

  if (major && minor) {
    return parseFloat(match[1] + '.' + match[2]);
  } else if (major) {
    return major;
  } else {
    return null;
  }
})();
// Old Android is defined as Version older than 2.3, and requiring a webkit version of the android browser
module.exports.IS_OLD_ANDROID = module.exports.IS_ANDROID && (/webkit/i).test(module.exports.USER_AGENT) && module.exports.ANDROID_VERSION < 2.3;

module.exports.TOUCH_ENABLED = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

module.exports.IS_MOBILE = module.exports.IS_IOS || module.exports.IS_ANDROID;
module.exports.IS_H5 = module.exports.IS_MOBILE || !module.exports.HAS_FLASH;
module.exports.IS_PC = !module.exports.IS_H5;




},{}],11:[function(require,module,exports){
/*
* flash播放器核心类
*/
var Component = require('../ui/component');
var Data = require('../lib/data');
var _ = require('../lib/object');
var cfg = require('../config');
//var swfobj=require('../lib/swfobject');

var FlashPlayer = Component.extend({

	init: function(tag, options) {
		Component.call(this, this, options);
		
		// 在window下挂载变量,便于flash调用
		this._id = this.id = 'prism-player-' + Data.guid();
        this.tag = tag;
        this._el = this.tag;
		window[this.id] = this;
		
		var width = '100%';
		var height = '100%';
		// TODO 临时先用日常的
		var swfUrl = '//' + cfg.domain + '/de/prismplayer-flash/' + cfg.flashVersion + '/PrismPlayer.swf';
		var flashVar = this._comboFlashVars();
		var wmode=this._options.wmode?this._options.wmode:"opaque";

		tag.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="' + width + '" height="' + height + '" id="' + this.id + '">' +
			'<param name=movie value="' + swfUrl + '">'+
			'<param name=quality value=High>'+
			'<param name="FlashVars" value="' + flashVar + '">' +
			'<param name="WMode" value="'+wmode+'">' +
			'<param name="AllowScriptAccess" value="always">' +
			'<param name="AllowFullScreen" value="true">' +
			'<param name="AllowFullScreenInteractive" value="true">' +
			'<embed name="' + this.id + '" src="' + swfUrl + '" quality=high pluginspage="//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="' + width + '" height="' + height + '" AllowScriptAccess="always" AllowFullScreen="true" AllowFullScreenInteractive="true" WMode="'+wmode+'" FlashVars="' + flashVar + '">' +
			'</embed>'+
		'</object>';

		//swfobj.registerObject(this._id, "10.1.0");
	},
		
	_getPlayer: function(id) {
		if (navigator.appName.indexOf("Microsoft") != -1) { 
			return document.getElementById(id);
		}else{
		   return document[id];
		}
	},

	//增加对 domain,statisticService,videoInfoService,vurl(调整为 source) 的设置支持
	_comboFlashVars: function(){
		var opt = this._options,
			flashVarArr = {
				autoPlay: opt.autoplay ? 1 : 0,
				from: opt.from,
				isInner: 0,
				actRequest: 1,
				//ref: 'share',
				vid: opt.vid,
				domain: opt.domain ? opt.domain : '//tv.taobao.com',
				//statisticService: opt.statisticService ? opt.statisticService : '//log.video.taobao.com/stat/', 
				//statisticService: opt.statisticService ? opt.statisticService : '//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track', 
				statisticService: opt.statisticService ? opt.statisticService : cfg.logReportTo,
				videoInfoService: opt.videoInfoService?opt.videoInfoService:'/player/json/getBaseVideoInfo.do',
				disablePing: opt.trackLog ? 0 : 1,
				namespace: this.id,
				barMode:opt.barMode != 0 ? 1 : 0,
				//直播状态
				isLive:opt.isLive?1:0,
				//水印
				waterMark:opt.waterMark,
				//直接播放的地址
				vurl:opt.source ? encodeURIComponent(opt.source):"",
				//插件
				plugins:opt.plugins?opt.plugins:"",
                snapShotShow:opt.snapshot ? 1 : 0,
                accessId:opt.acId ? opt.acId : "",
                accessKey:opt.acKey ? opt.acKey : "",
                stsToken:opt.stsToken ? opt.stsToken : "",
                domainRegion:opt.domainRegion ? opt.domainRegion : "",
                authInfo:opt.authInfo ? encodeURIComponent(opt.authInfo) : "",
                formats:opt.formats ? opt.formats : "",
                notShowTips:opt.notShowTips ? 1 : 0,
                showBarTime:opt.showBarTime ? opt.showBarTime : 0,
                showBuffer: opt.showBuffer==0 ? 0 : 1,
                rePlay:opt.rePlay ? 1 : 0,
                encryp:opt.encryp ? opt.encryp : "",
                secret:opt.secret ? opt.secret : ""
			},
			flashVar = [];

		if (opt.cover) {
			flashVarArr.cover = opt.cover;
		}
        if (opt.extraInfo) {
            flashVarArr.extraInfo = encodeURIComponent(JSON.stringify(opt.extraInfo));
        }

		_.each(flashVarArr, function(k, v) {
			flashVar.push(k + '=' + v);
		});

		return flashVar.join('&');
	},
	
	/************************ flash调用js的函数 ***********************/
	
	/**
	 * flashPlayer初始化完毕
	 */
	flashReady: function() {
		this.flashPlayer = this._getPlayer(this.id);
		this._isReady = true;

		// 传递skin相关
		var skinRes = this._options.skinRes,
			skinLayout = this._options.skinLayout,
			skin;

		// 必须是false或者array
		if (skinLayout !== false && !_.isArray(skinLayout)) {
			throw new Error('PrismPlayer Error: skinLayout should be false or type of array!');
		}
		if (typeof skinRes !== 'string') {
			throw new Error('PrismPlayer Error: skinRes should be string!');
		}

		// 如果是false或者[]，隐藏ui组件
		if (skinLayout == false || skinLayout.length === 0) {
			skin = false;
		
		} else {
			skin = {
				skinRes: skinRes,
				skinLayout: skinLayout
			};
		}
		this.flashPlayer.setPlayerSkin(skin);
		
		this.trigger('ready');

		// 告知flash播放器页面关闭
		var that = this;
		window.addEventListener('beforeunload', function() {
			try{
				that.flashPlayer.setPlayerCloseStatus();
			}catch(e){

			}
		});
	},

	/**
	 * flash调用该函数，轮询js的函数声明是否完成
	 */
	jsReady: function() {
		return true;
	},

	uiReady: function() {
		this.trigger('uiReady');
	},

	loadedmetadata: function() {
		this.trigger('loadedmetadata');
	},

	onPlay: function() {
		this.trigger('play');		
	},

	onEnded: function() {
		this.trigger('ended');		
	},

	onPause: function() {
		this.trigger('pause');		
	},
	//flash弹幕插件初始化完成
	onBulletScreenReady:function(){
		this.trigger('bSReady');
	},
	//flash弹幕发送弹幕消息
	onBulletScreenMsgSend:function(msg){
		this.trigger('bSSendMsg',msg);
	},

	//flash视频开始渲染播放器内逻辑做了单个视频的发送滤重,可以作为canplay的依赖
	onVideoRender:function(time){
		this.trigger('videoRender');
		this.trigger('canplay',{loadtime:time});
	},
	//flash播放器捕捉到错误时调用
	onVideoError:function(type){
		this.trigger('error',{errortype:type});
	},
    //flash catch m3u8 request error and retry
    onM3u8Retry:function(){
        this.trigger('m3u8Retry');
    },
    //send hide bar
    hideBar:function(){
        this.trigger('hideBar');
    },
    //send show bar: closed now
    showBar:function(){
        this.trigger('showBar');
    },
    //flash catch live stream stop
    liveStreamStop:function(){
        this.trigger('liveStreamStop');
    },
    //flash catch live stream stop
    stsTokenExpired:function(){
        this.trigger('stsTokenExpired');
    },
	//flash播放器捕捉到缓冲
	onVideoBuffer:function(){
		this.trigger('waiting');
	},

	/**
	 * js调用flash函数的基础方法
	 */
	_invoke: function() {
		var fnName = arguments[0],
			args = arguments;

		Array.prototype.shift.call(args);

		if (!this.flashPlayer) {
			throw new Error('PrismPlayer Error: flash player is not ready!');
		}
		if (typeof this.flashPlayer[fnName] !== 'function') {
			throw new Error('PrismPlayer Error: function ' + fnName + ' is not found!');
		}

		return this.flashPlayer[fnName].apply(this.flashPlayer, args);
	},

	/* ================ 公共接口 ====================== */
	play: function() {
		this._invoke('playVideo'); 
	},
	replay: function() {
		this._invoke('replayVideo'); 
	},

	pause: function() {
		this._invoke('pauseVideo');	   
	},
	stop:function(){
		this._invoke('stopVideo');
	},
	// 秒
	seek: function(time) {
		this._invoke('seekVideo', time);	  
	},

	getCurrentTime: function() {
		return this._invoke('getCurrentTime');				
	},

	getDuration: function() {
		return this._invoke('getDuration');			 
	},

	mute: function() {
        this.setVolume(0);
	},

	unMute: function() {
        this.setVolume(0.5);
	},


	// 0-1
	getVolume: function() {
		return this._invoke('getVolume');		   
	},

	// 0-1
	setVolume: function(vol) {
		this._invoke('setVolume', vol);		   
	},
	//新增接口============================
	//通过id加载视频
	loadByVid: function(vid) {
		this._invoke('loadByVid', vid,false);		   
	},
	//通过url加载视频
	loadByUrl: function(url, seconds) {
		this._invoke('loadByUrl', url, seconds);
	},
	//销毁 暂停视频,其余的由业务逻辑处理
	dispose: function() {
		this._invoke('pauseVideo');		   
	},
	//推送弹幕消息,js获取到消息后推送给flash显示
	showBSMsg:function(msg){
		this._invoke('showBSMsg',msg);
	},
	//设置是否启用toast信息提示
	setToastEnabled:function(enabled){
		this._invoke('setToastEnabled',enabled);
	},
	//设置是否显示loading
	setLoadingInvisible:function(){
		this._invoke('setLoadingInvisible');
	},
    //set player size
    setPlayerSize:function(input_w, input_h){
        var that = this;
        this._el.style.width = input_w

        var per_idx = input_h.indexOf("%");
        if (per_idx > 0)
        {
            var screen_height = window.screen.height;
            var per_value = input_h.replace("%", "");
            if(!isNaN(per_value))
            {
                var scale_value = screen_height * 9 * parseInt(per_value) / 1000;
                this._el.style.height = String(scale_value % 2 ? scale_value + 1: scale_value) + "px";
            }
            else
            {
                this._el.style.height = input_h;
            }
        }
        else
        {
            this._el.style.height = input_h;
        }
        console.log(input_w + input_h);
    },
});

module.exports = FlashPlayer;

},{"../config":1,"../lib/data":3,"../lib/object":8,"../ui/component":12}],12:[function(require,module,exports){
var oo = require('../lib/oo');
var Data = require('../lib/data');
var _ = require('../lib/object');
var Dom = require('../lib/dom');
var Event = require('../lib/event'); 
var Fn = require('../lib/function');
var Layout = require('../lib/layout');

var Component = oo.extend({
	init: function (player, options) {
		var that = this;

		this._player = player;

		// Make a copy of prototype.options_ to protect against overriding global defaults
		this._options = _.copy(options);
		this._el = this.createEl();
		this._id = player.id() + '_component_' + Data.guid();

		this._children = [];
		this._childIndex = {};

		// 只有组件真正被添加到dom树中后再同步ui、绑定事件
		// 从而避免获取不到dom元素
		this._player.on('uiH5Ready', function() {
			that.renderUI();
			that.syncUI();
			that.bindEvent();
		});
	}
});

/**
 * 渲染ui 
 */
Component.prototype.renderUI = function() {
	// 根据ui组件的配置渲染layout
	Layout.render(this.el(), this.options());
	// 设置id
	this.el().id = this.id();
};

/**
 * 同步ui状态，子类中实现
 */
Component.prototype.syncUI = function() {};

/**
 * 绑定事件，子类中实现
 */
Component.prototype.bindEvent = function() {};

/**
 * 生成compoent的dom元素
 *
 */
Component.prototype.createEl = function(tagName, attributes){
  return Dom.createEl(tagName, attributes);
};

/**
 * 获取component的所有配置项
 *
 */

Component.prototype.options = function(obj){
  if (obj === undefined) return this._options;

  return this._options = _.merge(this._options, obj);
};

/**
 * 获取componet的dom元素
 *
 */
Component.prototype.el = function(){
  return this._el;
};


Component.prototype._contentEl;


Component.prototype.player = function(){
  return this._player;
}

/**
 * Return the component's DOM element for embedding content.
 * Will either be el_ or a new element defined in createEl.
 *
 * @return {Element}
 */
Component.prototype.contentEl = function(){
  return this._contentEl || this._el;
};

/**
 * 设置元素id
 *
 */

Component.prototype._id;

/**
 * 获取元素id
 *
 */
Component.prototype.id = function(){
  return this._id;
};

/* 子元素相关操作
============================================================================= */

/**
 * 添加所有子元素
 *
 */
Component.prototype.addChild = function(child, options){
    var component, componentClass, componentName, componentId;

    // 如果child是一个字符串
    if(typeof child === 'string'){
      if(!this._player.UI[child]) return;
      component = new this._player.UI[child](this._player,options);
    }else{
    // child是一个compnent对象
      component = child;
    }

    //
    this._children.push(component);

    if (typeof component.id === 'function') {
      this._childIndex[component.id()] = component;
    }

    // 把子元素的dom元素插入父元素中
    if (typeof component['el'] === 'function' && component['el']()) {
      this.contentEl().appendChild(component['el']());
    }

    // 返回添加的子元素
    return component;
};
/**
 * 删除指定的子元素
 *
 */
Component.prototype.removeChild = function(component){

    if (!component || !this._children) return;

    var childFound = false;
    for (var i = this._children.length - 1; i >= 0; i--) {
      if (this._children[i] === component) {
        childFound = true;
        this._children.splice(i,1);
        break;
      }
    }

    if (!childFound) return;

    this._childIndex[component.id] = null;

    var compEl = component.el();
    if (compEl && compEl.parentNode === this.contentEl()) {
      this.contentEl().removeChild(component.el());
    }
};
/**
 * 初始化所有子元素
 *
 */
Component.prototype.initChildren = function(){
  var parent, children, child, name, opts;

  parent = this;
  children = this.options()['children'];

  if (children) {
    // 如果多个子元素是一个数组
    if (_.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];

        if (typeof child == 'string') {
          name = child;
          opts = {};
        } else {
          name = child.name;
          opts = child;
        }

        parent.addChild(name, opts);
      }
    } else {
      _.each(children, function(name, opts){
        // Allow for disabling default components
        // e.g. vjs.options['children']['posterImage'] = false
        if (opts === false) return;

        parent.addChild(name, opts);
      });
    }
  }
};


/* 事件操作
============================================================================= */

/**
 * 在component上的的dom元素上添加一个事件监听器
 *
 *     var myFunc = function(){
 *       var myPlayer = this;
 *       // Do something when the event is fired
 *     };
 *
 *     myPlayer.on("eventName", myFunc);
 *
 * The context will be the component.
 *
 * @param  {String}   type The event type e.g. 'click'
 * @param  {Function} fn   The event listener
 * @return {Component} self
 */
Component.prototype.on = function(type, fn){

  Event.on(this._el, type, Fn.bind(this, fn));
  return this;
};

/**
 * 从component上删除指定事件的监听器
 *
 *     myComponent.off("eventName", myFunc);
 *
 * @param  {String=}   type Event type. Without type it will remove all listeners.
 * @param  {Function=} fn   Event listener. Without fn it will remove all listeners for a type.
 * @return {Component}
 */
Component.prototype.off = function(type, fn){
  Event.off(this._el, type, fn);
  return this;
};

/**
 * 在组件的元素上添加一个只执行一次的事件监听器
 *
 * @param  {String}   type Event type
 * @param  {Function} fn   Event listener
 * @return {Component}
 */
Component.prototype.one = function(type, fn) {
  Event.one(this._el, type, Fn.bind(this, fn));
  return this;
};

/**
 * 在组件的元素上触发一个事件
 */
Component.prototype.trigger = function(event,paramData){
  //
  if(paramData){
    this._el.paramData = paramData;
  }
  Event.trigger(this._el, event);
  return this;
};

/* 组件展现
============================================================================= */

/**
 * 在component上添加指定的className
 *
 * @param {String} classToAdd Classname to add
 * @return {Component}
 */
Component.prototype.addClass = function(classToAdd){
  Dom.addClass(this._el, classToAdd);
  return this;
};

/**
 * 从component删除指定的className
 *
 * @param {String} classToRemove Classname to remove
 * @return {Component}
 */
Component.prototype.removeClass = function(classToRemove){
  Dom.removeClass(this._el, classToRemove);
  return this;
};

/**
 * 显示组件
 *
 * @return {Component}
 */
Component.prototype.show = function(){
  this._el.style.display = 'block';
  return this;
};

/**
 * 隐藏组件
 *
 * @return {Component}
 */
Component.prototype.hide = function(){
  this._el.style.display = 'none';
  return this;
};

/**
 * 销毁component
 *
 * @return 
 */

Component.prototype.destroy = function(){
    this.trigger({ type: 'destroy', 'bubbles': false });

    // 销毁所有子元素
    if (this._children) {
      for (var i = this._children.length - 1; i >= 0; i--) {
        if (this._children[i].destroy) {
          this._children[i].destroy();
        }
      }
    }

    // 删除所有children引用
    this.children_ = null;
    this.childIndex_ = null;

    // 删除所有事件监听器.
    this.off();

    // 从dom中删除所有元素
    if (this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
    // 删除所有data引用
    Data.removeData(this._el);
    this._el = null;
};

module.exports = Component;

},{"../lib/data":3,"../lib/dom":4,"../lib/event":5,"../lib/function":6,"../lib/layout":7,"../lib/object":8,"../lib/oo":9}]},{},[2]);
