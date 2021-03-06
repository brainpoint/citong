
  var Window = "undefined" != typeof window ? window : ("undefined" != typeof global ? global : ("undefined" != typeof self ? self : undefined));

  var utils = require('./utils');
  var stringUtils = require('./string');

  // - parentNodes 父节点 (HTMLNode)
  // - name 子节点selector.
  // - notAllChildren 仅查询一层子节点.
  // 返回匹配到的元素集合.
  function _matchElement(parentNodes, name, notAllChildren) {
    var elems;
    var tag = 0;  // 0-tag, 1-id, 2-class.
    var nameattr, nameattrVal;

    // :checked, :disabled
    var selector = name.split(':');
    name = selector[0];
    name = stringUtils.trim(name);
    selector = selector[1];
    if (selector) {
      if (selector != 'checked' && selector != 'disabled') {
        throw new Error('only support `:checked or :disabled` selector');
      }
    }

    // attri.
    if (name.indexOf('[') > 0) {
      var iblace = name.indexOf('[');
      nameattr = name.substring(iblace+1, name.length-1);
      nameattr = nameattr.split('=');
      if (nameattr.length != 2) {
        throw new Error('Syntax error, unrecognized expression: ' + name);
      }
      nameattrVal = nameattr[1];
      if (nameattrVal.indexOf('\'') >= 0 || nameattrVal.indexOf('"') >= 0)
        nameattrVal = nameattrVal.substring(1, nameattrVal.length-1);
      nameattr = nameattr[0];
      name = name.substr(0, iblace);
    }
    
    if (name[0] == '.') {
      tag = 2;
      name = name.substr(1);
    }
    else if (name[0] == '#') {
      tag = 1;
      name = name.substr(1);
    }

    if (!parentNodes || parentNodes.length == 0) {
      if (2 == tag) {
        elems = Window.document.getElementsByClassName(name);
      }
      else if (1 == tag) {
        elems = Window.document.getElementById(name);
        if (elems) elems = [elems];
        else elems = [];
      }
      else if (0 == tag) {
        elems = Window.document.getElementsByTagName(name);
      }

      // attrvalue.
      if (nameattr) {
        var tt_elems = elems;
        elems = [];
        for (var i = 0; i < tt_elems.length; i++) {
          if (tt_elems[i].getAttribute(nameattr) === nameattrVal) {
            elems.push(tt_elems[i]);
          }
        }
      } // if.

      if (selector) {
        var tt_elems = elems;
        elems = [];
        for (var i = 0; i < tt_elems.length; i++) {
          if (selector == 'disabled') {
            if (tt_elems[i].disabled) {
              elems.push(tt_elems[i]);  
            }
          }
          else 
          if (selector == 'checked') {
            if (tt_elems[i].checked) {
              elems.push(tt_elems[i]);  
            }
          }
        }
      } // if.
    }
    else {
      elems = [];
      for (var i = 0; i < parentNodes.length; i++) {
        var node1 = parentNodes[i].childNodes;
        if (!node1) continue;
        var node = [];
        for (var j = 0; j < node1.length; j++) {
          node.push(node1[j]);
        }

        for (var j = 0; j < node.length; j++) {
          var add = true;

          if (selector) {
            if (selector == 'disabled') {
              if (!node[j].disabled) {
                add = false;
              }
            }
            else 
            if (selector == 'checked') {
              if (!node[j].checked) {
                add = false;
              }
            }
          } // if.

          // attrvalue.
          if (add && nameattr) {
            if (node[j].getAttribute(nameattr) !== nameattrVal) {
              add = false;
            }
          }

          if (add) {
            if (2 == tag) {
              if (_hasClass(node[j], name)) {
                elems.push(node[j]);
                continue;
              }
            }
            else if (1 == tag) {
              if (node[j].id == name) {
                elems.push(node[j]);
                continue;
              }
            }
            else if (0 == tag) {
              if (node[j].nodeName.toUpperCase() == name.toUpperCase()) {
                elems.push(node[j]);
                continue;
              }
            }
          } // if.

          if (!notAllChildren) {
            var nn = node[j].childNodes;
            if (nn && nn.length > 0) {
              for (var k = 0; k < nn.length; k++) {
                node.push(nn[k]);
              }
              if (j > 20) {
                node = node.slice(j+1);
                j = -1;
              }
            }
          }
        } // for.
      } // for.
    } // if..else.

    return elems;
  }

  // - parentNode 仅筛选此节点下的节点.
  function _getElement(name, parentNode) {
    if (name === '') name = null;
    var _elem;
    var _isarr = false;
    if (typeof name === 'string') {
      if (name[0] == '<') {
        _elem = Window.document.createElement('div');
        _elem.innerHTML = name;
        if (_elem.childNodes.length == 1) {
          _elem = _elem.childNodes[0];
          _isarr = false;
        }
        else {
          _elem = _elem.childNodes;
          _isarr = true;
        }
      }
      else {
        if (name.indexOf('<') > 0 || name.indexOf('>') > 0)
          throw new Error('Syntax error, unrecognized');

        var names = name.split(' ');
        var nodes = parentNode ? [parentNode] : null;
        for (var i = 0; i < names.length; i++) {
          if (names[i] != '')
            nodes = _matchElement(nodes, names[i], !!parentNode);
        }
        if (nodes.length <= 1) {
          _elem = nodes[0];
          _isarr = false;
        } else {
          _elem = nodes;
          _isarr = true;
        }
      }
    } else {
      _elem = name;
    }
    return {_elem:_elem, _isarr:_isarr};
  }


  /**
   * hasClass
   */
  function _hasClass( element, cName ){  
    if (!element || !element.className || (typeof element.className.match !== 'function'))
      return false;
    return !!element.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断  
  }

  /**
   * addClass
   */
  function _addClass( element,cName ){  
    if (!element) return;
    if (typeof element.className === 'string') {
      if( !_hasClass( element,cName ) ){
        if (stringUtils.isEmpty(element.className))
          element.className += cName;
        else
          element.className += " " + cName;  
      };  
    }
  } 

  /**
   * removeClass
   */
  function _removeClass( element, cName ){  
    if (!element) return;
    if (typeof element.className === 'string') {
      if( _hasClass( element,cName ) ){  
        element.className = element.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " ); // replace方法是替换 
        // trim.
        element.className = stringUtils.trim(element.className);
      };  
    }
  }
  /**
   * removeElement
   */
  function _removeElement(element){
    if (element) {
      var _parentElement = element.parentNode;
      if(_parentElement){
          _parentElement.removeChild(element);  
      }
    }
  }

  /**
   * appendChild
   */
  function _appendChild(element, node) {
    if (element) {
      if (node instanceof Dom) {
        if (!node._isArray()) {
          element.appendChild(node[0]);
        } else {
          for (var i = 0; i < node.length; i++) {
            element.appendChild(node[i]);
          }
        }
      }
      else {
        element.appendChild(node);
      }
    }
  }

  function _prependChild(element,node){ 
    if (!element) return;
    if(element.hasChildNodes()){ 
      if (node instanceof Dom) {
        if (!node._isArray()) {
          element.insertBefore(node[0], element.firstChild); 
        } else {
          for (var i = node.length-1; i >= 0; i--) {
            element.insertBefore(node[i], element.firstChild);
          }
        }
      } else {
        element.insertBefore(node, element.firstChild); 
      }
    } else{ 
      if (node instanceof Dom) {
        if (!node._isArray()) {
          element.appendChild(node[0]); 
        } else {
          for (var i = 0; i < node.length; i++) {
            element.appendChild(node[i]);
          }
        }
      } else {
        element.appendChild(node); 
      }
    } 
  }

  function _isHtmlElement(obj) {
    var d = document.createElement("div"); 
    try{ 
        d.appendChild(obj.cloneNode(true)); 
        return obj.nodeType==1 ? true : false; 
    }catch(e){ 
        return obj==Window || obj==document; 
    } 
} 

  var CreateDom;

  /**
   * @desc 类jquery dom操作.
   */
  class Dom {
    // _elem;
    // _isArr;

    /**
     * 支持 
     *    - .name 使用类名构建.
     *    - #name 使用id名构建.
     *    - name  使用tag名构建.
     *    - <div...>...</div> 使用内容构建.
     *    - node.
     */
    constructor(name) {
      //
      // save in '_elem', '_isArr' 
      //
      if (name === Window.document || name == Window) {
        this._elem = name;
        this._isArr = false;
      }
      else if (name instanceof Dom) {
        this._elem = name._elem;
        this._isArr = name._isArr;
      } else {
        if (_isHtmlElement(name)) {
          this._elem = name;
          this._isArr = false;
        }
        else {
          this._elem = _getElement(name);  
          this._isArr = this._elem._isarr;
          this._elem = this._elem._elem;
        }
      }

      if (!this._isArray()) {
        this[0] = this._elem;
        this.length = this._elem ? 1 : 0;
      } else {
        for (var i = 0; i < this._elem.length; i++) {
          this[i] = this._elem[i];
        }
        this.length = this._elem.length;
      }

      var _this = this;
      
      this.bind = this.on;
      this.unbind = this.off;
      this.live = this.on;
      this.die = this.off;

      if (name === Window.document) {
        this.ready = function(f) { if (f) { 
            if (Window.addEventListener)
              Window.document.addEventListener('DOMContentLoaded', f); 
            else
              Window.document.attachEvent('onload', f);
          }
          else {
            _this.trigger('ready');
          }
          return _this; 
        }
        this.unload = function(f) { if (f) { 
          if (Window.addEventListener)
            Window.document.addEventListener('unload', f); 
          else
            Window.document.attachEvent('onunload', f);
          }
          else {
            _this.trigger('unload');
          }
          return _this; 
        }
        this.context = Window.document;
      }
      else if (name === Window) {
        this.unload = function(f) { if (f) { 
          if (Window.addEventListener)
            Window.addEventListener('unload', f); 
          else
            Window.attachEvent('onunload', f); 
          }
          else {
            _this.trigger('unload');
          }
          return _this; 
        }
      }
      else {
        this.context = Window.document;
      }

      if (typeof name === 'function') {
        function foo(e){
          name.bind(_this)(e);
          if (Window.addEventListener)
            Window.document.removeEventListener('DOMContentLoaded', foo);
          else
            Window.document.detachEvent('onload', foo);
        }
        if (Window.addEventListener)
          Window.document.addEventListener('DOMContentLoaded', foo);
        else
          Window.document.attachEvent('onload', foo);
      }
      else {
        function ttt(event, f) {
          if (f) {
            return _this.on(event, f);
          } else {
            return _this.trigger(event);
          }
        }

        this.blur     = function(f) { return ttt('blur', f); }
        this.change   = function(f) { return ttt('change', f); }
        this.click    = function(f) { return ttt('click', f); }
        this.dblclick = function(f) { return ttt('dblclick', f); }
        this.error    = function(f) { return ttt('error', f); }
        this.keydown = function(f) { return ttt('keydown', f); }
        this.keypress = function(f) { return ttt('keypress', f); }
        this.keyup = function(f) { return ttt('keyup', f); }
        this.load = function(f) { return ttt('load', f); }
        this.mousedown = function(f) { return ttt('mousedown', f); }
        this.mouseenter = function(f) { return ttt('mouseenter', f); }
        this.mouseleave = function(f) { return ttt('mouseleave', f); }
        this.mousemove = function(f) { return ttt('mousemove', f); }
        this.mouseout = function(f) { return ttt('mouseout', f); }
        this.mouseover = function(f) { return ttt('mouseover', f); }
        this.mouseup = function(f) { return ttt('mouseup', f); }
        this.scroll = function(f) { return ttt('scroll', f); }
        this.select = function(f) { return ttt('select', f); }
        this.submit = function(f) { return ttt('submit', f); }
      }

      if (this._elem) {
        if (this._isArray()) {
          for (var i = 0; i < this._elem.length; i++) {
            this._domtify(this._elem[i]);
          }
        } else {
          this._domtify(this._elem);
        }
      }

      // plugin.
      for (var key in CreateDom.fn) {
        if (key == 'extend' || key == 'fn') continue;
        if (typeof CreateDom.fn[key] === 'function') {
          this[key] = CreateDom.fn[key].bind(this);
        }
      }
      this.__domtify = true;
    }

    get(index) {
      if (!this._elem) return null;
      else {
        if (this._isArray()) {
          return this._elem[index];
        }
        else {
          return index > 0 ? null : this._elem;
        }
      }
    }

    /**
     * @desc: hasClass
     */
    hasClass( cName ){
      if (!this._elem) { return false; }
      
      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        if (_hasClass(this.get(i), cName))  return true;
      }
      return false;
    }

    /**
     * @desc: addClass
     */
    addClass( cName ){
      if (!this._elem) { return this; }

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        _addClass(this.get(i), cName);
      }
      return this;
    } 

    /**
     * @desc: removeClass
     */
    removeClass( cName ){
      if (!this._elem) { return this; }
      
      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        _removeClass(this.get(i), cName);
      }
      return this;
    } 

    /**
     * @desc: toggleClass
     */
    toggleClass( cName ){
      if (!this._elem) { return this; }

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        if (_hasClass(this.get(i), cName))
          _removeClass(this.get(i), cName);
        else
          _addClass(this.get(i), cName);
      }
      return this;
    } 

    /**
     * @desc: remove
     */
    remove(){
      if (!this._elem) { return this; }

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = _thisLength-1; i >= 0; i--) {
        _removeElement(this.get(i));
      }
      return this;
    } 

    /**
     * @desc: append
     */
    append(node) {
      if (!this._elem) { return this; }
      var _dom = new Dom(node);
      _appendChild(this.get(0), _dom);

      return this;
    }

    /**
     * appendTo
     */
    appendTo(node) {
      if (!this._elem) { return this; }
      var dom = new Dom(node);
      dom.append(this);
      return this;
    }

    /**
     * @desc: prepend
     */
    prepend(node) {
      if (!this._elem) { return this; }
      var _dom = new Dom(node);
      _prependChild(this.get(0), _dom);

      return this;
    }

    /**
     * @desc: prependTo
     */
    prependTo(node) {
      if (!this._elem) { return this; }
      var dom = new Dom(node);
      dom.prepend(this);
      return this;
    }

    /**
     * @desc: before
     */
    before(node) {
      if (!this._elem) { return this; }

      var _dom = new Dom(node);

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        _dom.insertBefore(this.get(i));
      }

      return this;
    }

    /**
     * insertBefore
     */
    insertBefore(node) {
      if (!this._elem) { return this; }
      var dom = new Dom(node);
      if (!dom._isArray()) {
        var elem = this._elem;
        if (!this._isArray()) elem = [elem];
        for (var i = 0; i < elem.length; i++) {
          dom[0].parentNode.insertBefore(elem[i], dom[0]);
        }
      }
      return this;
    }

    /**
     * @desc: after
     */
    after(node) {
      if (!this._elem) { return this; }

      var _dom = new Dom(node);

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        _dom.insertAfter(this.get(i));
      }

      return this;
    }

    /**
     * @desc: insertAfter
     */
    insertAfter(node) {
      if (!this._elem) { return this; }
      var dom = new Dom(node);
      if (!dom._isArray()) {
        var elem = this._elem;
        if (!this._isArray()) elem = [elem];
        for (var i = 0; i < elem.length; i++) {
          dom[0].parentNode.insertBefore(elem[i], dom[0].nextSibling);
        }
      }
      return this;
    }

    /**
     * @desc: attr.
     */
    attr(attrName, value) {
      if (!attrName) {
        throw new Error('need attrName');
      }

      if (!this._elem) { 
        if (typeof value !== 'undefined')
          return this;
        return undefined;
      }
      if (typeof value === 'undefined') {
        if (!this.get(0).hasAttribute(attrName))
          return undefined;

        return this.get(0).getAttribute(attrName);
      } else {

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          this.get(i).setAttribute(attrName, value);
        }
        return this;
      }
    }

    /**
     * @desc: removeAttr
     */
    removeAttr(name) {
      if (!this._elem) { return this; }

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        this.get(i).removeAttribute(name);
      }
      return this;
    }

    /**
    * @desc: detach.
    */
    detach() {
      throw new Error('unimplement');
    }

    /**
    * @desc: clone.
    */
    clone() {
      throw new Error('unimplement');
    }

    /**
    * @desc: replaceAll.
    */
    replaceAll() {
      throw new Error('unimplement');
    }

    /**
    * @desc: replaceWith.
    */
    unwrap() {
      throw new Error('unimplement');
    }
    /**
    * @desc: replaceWith.
    */
    wrap() {
      throw new Error('unimplement');
    }
    /**
    * @desc: replaceWith.
    */
    wrapAll() {
      throw new Error('unimplement');
    }
    /**
    * @desc: replaceWith.
    */
    wrapinner() {
      throw new Error('unimplement');
    }

    /**
    * @desc: empty.
    */
    empty() {
      if (!this._elem) { return this; }

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        this.get(i).innerHTML = '';
      }
      return this;
    }

    /**
    * @desc: html.
    */
    html(v) {
      if (!this._elem) { 
        if (typeof v !== 'undefined')
          return this;
        return;
      }
      if (typeof v === 'undefined') {
        return this.get(0).innerHTML;
      } else {

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          this.get(i).innerHTML = v;
        }
        return this;
      }
    }


    /**
    * @desc: text.
    */
    text(v) {
      if (!this._elem) { 
        if (typeof v !== 'undefined')
          return this;
        return;
      }
      if (typeof v === 'undefined') {
        return this.get(0).textContent;
      } else {

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          this.get(i).textContent = v;
        }
        return this;
      }
    }

    /**
    * @desc: val.
    */
    val(v) {
      if (!this._elem) { 
        if (typeof v !== 'undefined')
          return this;
        return;
      }
      if (typeof v === 'undefined') {
          return this.get(0).value;
      } else {

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          this.get(i).value = v;
        }
        return this;
      }
    }


    /**
    * @desc: css.
    */
    css(name, value) {
      if (!this._elem) { 
        if (typeof value !== 'undefined')
          return this;
        return; 
      }
      if (typeof value === 'undefined') {
          return this.get(0).style[name];
      } else {

        var _thisLength = (this.length) ? this.length : 0;

        for (var i = 0; i < _thisLength; i++) {
          if (value == '')
            this.get(i).style[name] = '';
          else
            this.get(i).style[name] = value;
        }
        return this;
      }
    }

    /**
    * @desc: on.
    */
    on(eventname, foo) {
      if (!eventname) 
        throw new Error('need event name');

      if (typeof foo !== 'function')
        throw new Error('on need function params');
      
      if (!this._elem) { return this; }

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        var ee = this.get(i);
        if (ee instanceof Dom || ee.__domtify) {
          ee = ee._elem;
          if (!ee) {
            continue;
          }
        }
        if (!ee.__events) ee.__events = {};
        if (!ee.__events[eventname]) ee.__events[eventname] = [];
        var env = ee.__events[eventname];
        var j;
        for (j = 0; j < env.length; j++) {
          if (env[j] === foo) {
            break;
          }
        }
        if (j >= env.length) {
          env.push(foo);
        }
        if ('on'+eventname in ee) {
          if (ee.addEventListener)
            ee.addEventListener(eventname, foo);
          else
            ee.attachEvent('on'+eventname, foo);
        }
      }
      return this;
    }

    /**
    * @desc: one.
    */
    one(event, f) { 
      if (!event || typeof event !== 'string') 
        throw new Error('need event name');

      var _this = this;
      var tt = function(e) { _this.off(event, tt); f.bind(this)(e); };
      _this.on(event, tt);
      return this;
    }

    /**
    * @desc: off.
    */
    off(eventname, foo) {
      if (!eventname) 
        throw new Error('need event name');

      if (!this._elem) { return this; }
      if (!foo) {

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          var ee = this.get(i);
          if (ee instanceof Dom || ee.__domtify) {
            ee = ee._elem;
            if (!ee) {
              continue;
            }
          }
          if (ee.__events && ee.__events[eventname])
          {
            var env = ee.__events[eventname];
            var j;
            if ('on'+eventname in ee) {
              for (j = 0; j < env.length; j++) {
                if (ee.removeEventListener)
                  ee.removeEventListener(eventname, env[j]);
                else
                  ee.detachEvent('on'+eventname, env[j]);
              }
            }
            ee.__events[eventname] = [];
          }
        }
        return this;
      }

      if (typeof foo !== 'function')
        throw new Error('off need function params');
      

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        var ee = this.get(i);
        if (ee instanceof Dom) {
          ee = ee._elem;
        }
        if (ee.__events && ee.__events[eventname])
        {
          var env = ee.__events[eventname];
          var j;
          for (j = 0; j < env.length; j++) {
            if (env[j] === foo) {
              env.splice(j, 1);
              break;
            }
          }
        }
        if ('on'+eventname in ee) {
          if (ee.removeEventListener)
            ee.removeEventListener(eventname, foo);
          else
            ee.detachEvent('on'+eventname, foo);
        }
      }

      return this;
    }

    /**
    * @desc: trigger.
    */
    trigger(eventname, extraParameters) {
      if (!eventname) 
        throw new Error('need event name');
      
      if (!this._elem) { return this; }
      

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        var ee = this.get(i);
        if (ee instanceof Dom) {
          ee = ee._elem;
        }

        // fire.
        if (ee) {
          if ('on'+eventname in ee) {
            if (!Window.document.addEventListener) {
              ee.fireEvent('on'+eventname);
            }
            else {
              var env = Window.document.createEvent('HTMLEvents');
              env.initEvent(eventname, true, true);
              ee.dispatchEvent(env);
            }
          } 
          else {
            if (ee.__events && ee.__events[eventname])
            {
              var env = ee.__events[eventname];
              var j;

              var enve;
              // if (!Window.document.addEventListener) {
                enve = {
                  bubbles: false,
                  cancelable: false,
                  cancelBubble: false,
                  defaultPrevented: false,
                  // currentTarget: ee,
                  // target: ee,
                  type: eventname
                };
              // }
              // else {
              //   enve = Window.document.createEvent('HTMLEvents');
              //   enve.initEvent(eventname, false, false);
              // }

              enve.currentTarget = ee;
              enve.target = ee;

              for (j = 0; j < env.length; j++) {
                env[j](enve, extraParameters);
              }
            } // if.
          }
        } // if.
      }
      return this;
    }

    /**
    * @desc: parent
    * @return: 
    */
    parent(selector) {
      if (!this._elem) { return new Dom(); }
      var sel;
      if (selector)
        sel = new Dom(selector);
      if (this._isArray()) {
        var dom = new Dom();
        dom._elem = [];
        dom._isArr = true;
        dom.length = 0;

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          if (this.get(i).parentNode) {
            if (!sel || sel._isElementIn(this.get(i).parentNode)) {
              this._domtify(this.get(i).parentNode);
              dom._elem.push(this.get(i).parentNode);
              dom[dom.length] = this.get(i).parentNode;
              dom.length++;
            }
          }
        }
        if (dom._elem.length == 0) dom._elem = null;
        return dom;
      } else {
        if (!this._elem.parentNode) return new Dom();
        if (!sel || sel._isElementIn(this._elem.parentNode)) {
          return new Dom(this._elem.parentNode); 
        }
        return new Dom();
      } // if.
    }

    /**
    * @desc: parents
    * @return: 
    */
    parents(selector) {
      if (!this._elem) { return new Dom(); }
      var sel;
      if (selector)
        sel = new Dom(selector);

      var nodes = [];

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        if (!this.get(i).parentNode) continue;
        var elem = this.get(i);
        while (elem.parentNode) {
          if (elem.parentNode == Window || elem.parentNode == Window.document)
            break;

          if (!sel || sel._isElementIn(elem.parentNode)) {
            var j;
            for (j = 0; j < nodes.length; j++) {
              if (typeof nodes[j].isSameNode === 'function') {
                if (nodes[j].isSameNode(elem.parentNode)) {
                  break;
                }
              }
              else {
                if (nodes[j] === elem.parentNode) {
                  break;
                }
              }
            }
            if (j >= nodes.length)
              nodes.push(elem.parentNode);
          }
          elem = elem.parentNode;
        }
      } // for.

      var dom = new Dom();
      if (nodes.length > 0) {
        dom._elem = nodes;
        dom._isArr = true;
        dom.length = nodes.length;
        for (var i = 0; i < nodes.length; i++) {
          dom._domtify(nodes[i]);
          dom[i] = nodes[i];
        }
      }
      return dom;
    }

    /**
     * children
     * @param {*} selector 
     */
    children(selector) {
      if (!this._elem) { return new Dom(); }

      var nodes = [];

      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        var sel;
        if (selector)
          sel = _getElement(selector, this.get(i));
        else {
          sel = {_elem: [], _isarr: true};
          for (var j = 0; j < this.get(i).childNodes.length; j++) {
            sel._elem.push(this.get(i).childNodes[j]);
          }
        }
        
        if (!sel._elem)
          continue;
        
        if (sel._isarr) {
          nodes = nodes.concat(sel._elem);
        } else {
          nodes.push(sel._elem);
        }
      }

      var dom = new Dom();
      dom._elem = nodes;
      dom._isArr = true;
      dom.length = nodes.length;
      for (var i = 0; i < nodes.length; i++) {
        this._domtify(nodes[i]);
        dom[i] = nodes[i];
      }
      return dom;
    }

    /**
     * next
     * @param {*} selector 
     */
    next(selector) {
      if (!this._elem) { return new Dom(); }

      var dom;
      if (selector) {
        dom = this.parent();
        dom = dom.children(selector);
      }

      if (this._isArray()) {
        var nodes = [];

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          if (!dom || dom._isElementIn(this.get(i).nextSibling)) {
            if (this.get(i).nextSibling)
              nodes.push(this.get(i).nextSibling);
          }
        }

        var dom1 = new Dom();
        dom1._elem = nodes;
        dom1._isArr = true;
        dom1.length = nodes.length;
        for (var i = 0; i < nodes.length; i++) {
          this._domtify(nodes[i]);
          dom1[i] = nodes[i];
        }
        return dom1;
      }
      else {
        var nodes;
        if (!dom || dom._isElementIn(this._elem.nextSibling)) {
          if (this._elem.nextSibling)
            nodes = this._elem.nextSibling;
        }

        var dom1 = new Dom();
        dom1._elem = nodes;
        dom1[0] = nodes;
        dom1._isArr = false;
        dom1.length = nodes ? 1 : 0;
        return dom1;
      } // if..else
    }


    /**
     * prev
     * @param {*} selector 
     */
    prev(selector) {
      if (!this._elem) { return new Dom(); }

      var dom;
      if (selector) {
        dom = this.parent();
        dom = dom.children(selector);
      }

      if (this._isArray()) {
        var nodes = [];

        var _thisLength = (this.length) ? this.length : 1;

        for (var i = 0; i < _thisLength; i++) {
          if (!dom || dom._isElementIn(this.get(i).previousSibling)) {
            if (this.get(i).previousSibling)
              nodes.push(this.get(i).previousSibling);
          }
        }

        var dom1 = new Dom();
        dom1._elem = nodes;
        dom1._isArr = true;
        dom1.length = nodes.length;
        for (var i = 0; i < nodes.length; i++) {
          this._domtify(nodes[i]);
          dom1[i] = nodes[i];
        }
        return dom1;
      }
      else {
        var nodes;
        if (!dom || dom._isElementIn(this._elem.previousSibling)) {
          if (this._elem.previousSibling)
            nodes = this._elem.previousSibling;
        }

        var dom1 = new Dom();
        dom1._elem = nodes;
        dom1[0] = nodes;
        dom1._isArr = false;
        dom1.length = nodes ? 1 : 0;
        return dom1;
      } // if..else
    }

    /**
    * @desc: 遍历
    */
    each(cb) {
      if (cb) {
        for (var i = 0; i < this.length; i++) {
          cb(i, this.get(i));
        }
      }
    }

    // 将普通节点设置为Dom对象.
    _domtify(node) {
      if (node instanceof Dom)
        return;
      if (node.__domtify)
        return;

      var _proto = Object.getPrototypeOf(this);
      for (var key in _proto) {
        if (key != '__proto__' && key != 'constructor') {
          // 不覆盖native方法.
          if (!node[key]) {
            node[key] = _proto[key].bind(node);
          }
        }
      }

      // // plugin.
      for (var key in CreateDom.fn) {
        if (key == 'extend' || key == 'fn') continue;

        if (typeof CreateDom.fn[key] === 'function') {
          if (!node[key]) {
            node[key] = CreateDom.fn[key].bind(node);
          }
        }
      }

      // delete node.length;
      node._isArr = false;
      node._elem = node;
      // node[0] = node;
      node.__domtify = true;
    }

    // 当前是否是数组.
    _isArray() {
      return this._isArr;
    }

    // 指定节点是否存在于本对象中.
    _isElementIn(node) {
      if (!this._elem)  return false;


      var _thisLength = (this.length) ? this.length : 1;

      for (var i = 0; i < _thisLength; i++) {
        if (typeof this.get(i).isSameNode === 'function') {
          if (this.get(i).isSameNode(node))
            return true;
        }
        else {
          if (this.get(i) === node)
            return true;
        }
      }
      
      return false;
    }
  };

  CreateDom = function(n) {
    return new Dom(n);
  }
  // plugin.
  CreateDom.fn = {};
  CreateDom.extend = function(plugin) {
    if (arguments.length == 0)
      return {}

    if (arguments.length == 1) {
      for (var key in arguments[0]) {
        if (key == 'extend' || key == 'fn') continue;
        if (typeof arguments[0][key] === 'function') {
          CreateDom[key] = arguments[0][key];
        }
      }
      return this;
    }
    else {
      if (arguments[0] === false )
        throw new Error('can\'t be false');

      var o = {};
      var i = 0;
      if (arguments[0] === true )
        i = 1;
      for (; i < arguments.length; i++) {
        o = utils.mergeMap(o, arguments[i]);
      }
      return o;
    } // if..else.
  }


  /**
  * @desc: viewport.
  * @return: {width, height}
  */
  Dom.getViewPort = function() {
    if(Window.document.compatMode == "BackCompat") {   //浏览器嗅探，混杂模式
        return {
            width: Window.document.body.clientWidth,
            height: Window.document.body.clientHeight
        };
    } else {
        return {
            width: Window.document.documentElement.clientWidth,
            height: Window.document.documentElement.clientHeight
        };
    }
  }

  /**
  * @desc: documentport.
  * @return: {width, height}
  */
  Dom.getDocumentPort = function() {
    if(Window.document.compatMode == "BackCompat") {
      return {
          width: Window.document.body.scrollWidth,
          height: Window.document.body.scrollHeight
      };
    } else {
        return {
            width: Math.max(Window.document.documentElement.scrollWidth,Window.document.documentElement.clientWidth),
            height: Math.max(Window.document.documentElement.scrollHeight,Window.document.documentElement.clientHeight)
        }
    }
  }

  /**
  * @desc: document offset.
  * @return: {top, left}
  */
  Dom.getDocumentOffset = function() {
    var elementScrollLeft;
    var elementScrollTop;

    if (Window.document.compatMode == "BackCompat"){
      elementScrollLeft=Window.document.body.scrollLeft;
      elementScrollTop=Window.document.body.scrollTop;
　　} else {  // CSS1Compat
　　　 elementScrollLeft = (document.documentElement.scrollLeft == 0) ? document.body.scrollLeft : document.documentElement.scrollLeft;
      elementScrollTop = (document.documentElement.scrollTop == 0) ? document.body.scrollTop : document.documentElement.scrollTop;
　　}

    return {
      top: elementScrollTop,
      left: elementScrollLeft
    };
  }

  /**
  * @desc: 获取指定元素相对于视口的的offset
  * @return: 
  */
  Dom.getElementOffset = function(e) {
    if (!e) {
      return {};
    }

    var ee = CreateDom(e);
    ee = ee[0];
    if (ee) {
      if (typeof ee.getBoundingClientRect === 'function') {
        var rect = ee.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top
        };
      }
      else {
        var actualLeft = ee.offsetLeft;
        var actualTop = ee.offsetTop;
  　　　　var current = ee.offsetParent;

  　　　　while (current){
  　　　　　　actualLeft += current.offsetLeft;
  　　　　　　actualTop += current.offsetTop;
  　　　　　　current = current.offsetParent;
  　　　　}

        var elementScrollLeft;
        var elementScrollTop;

  　　　　if (Window.document.compatMode == "BackCompat"){
            elementScrollLeft=Window.document.body.scrollLeft;
            elementScrollTop=Window.document.body.scrollTop;
  　　　　} else {
            elementScrollLeft = (Window.document.documentElement.scrollLeft == 0) ? Window.document.body.scrollLeft : Window.document.documentElement.scrollLeft;
            elementScrollTop = (Window.document.documentElement.scrollTop == 0) ? Window.document.body.scrollTop : Window.document.documentElement.scrollTop;
  　　　　}

        return {
          left: actualLeft-elementScrollLeft,
          top: actualTop-elementScrollTop
        };
      } // if..else.
    }

    return {};
  }

  /**
  * @desc: 判断是否是dom对象.
  * @return: boolean.
  */
  Dom.isDom = function(e) {
    return (typeof HTMLElement === 'object') ? (e instanceof HTMLElement) : (e && typeof e === 'object' && e.nodeType === 1 && typeof e.nodeName === 'string');
  }

  /**
  * @desc: 统一处理 removeEventListener, detachEvent; 并提供useCapture参数问题.
  */
  Dom.removeEventListener = function(dom, eventName, foo, useCapture) {
    if (!dom) return;
    if (dom.addEventListener) {
      dom.removeEventListener(eventName, foo, useCapture);
    }
    else {
      dom.detachEvent('on'+eventName, foo);
    }
  }

  /**
  * @desc: 统一处理 addEventListener, attachEvent; 并提供useCapture参数问题.
  */
  Dom.addEventListener = function(dom, eventName, foo, useCapture) {
    if (!dom) return;
    if (dom.addEventListener) {
      dom.addEventListener(eventName, foo, useCapture);
    }
    else {
      dom.attachEvent('on'+eventName, foo);
    }
  }


  exports.Dom = Dom;
  exports.CreateDom = CreateDom;