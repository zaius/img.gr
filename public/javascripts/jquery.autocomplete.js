/*
 *
 *  Ajax Autocomplete for jQuery, version 1.0.3
 *  (c) 2009 Tomas Kirda
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
 *
 *  Last Review: 10:49 AM 3/13/2009
 *
 */

(function($) {

  $.fn.autocomplete = function(options) {
    return this.each(function() {
      return new Autocomplete(this, options);
    });
  };

  var Autocomplete = function(el, options) {
    this.el = $(el);
    this.id = this.el.attr('id');
    this.el.attr('autocomplete', 'off');
    this.suggestions = [];
    this.data = [];
    this.badQueries = [];
    this.selectedIndex = -1;
    this.currentValue = this.el.val();
    this.intervalId = 0;
    this.cachedResponse = [];
    this.onChangeInterval = null;
    this.ignoreValueChange = false;
    this.serviceUrl = options.serviceUrl;
    this.options = {
      autoSubmit: false,
      minChars: 1,
      maxHeight: 300,
      deferRequestBy: 0,
      width: 0
    };
    if (options) { $.extend(this.options, options); }
    this.initialize();
  };

  Autocomplete.isArray = function(obj) { return obj && obj.constructor === Array; };

  Autocomplete.highlight = function(value, re) {
	//alert(value);
    return value.replace(re, function(match) { return '<strong>' + match + '<\/strong>'; });
  };

  Autocomplete.prototype = {

    killerFn: null,

    initialize: function() {

      var me = this;

      this.killerFn = function(e) {
        if ($(e.target).parents('.autocomplete').size() === 0) {
          me.killSuggestions();
          me.disableKillerFn();
        }
      };

      var uid = new Date().getTime()
      var autocompleteElId = 'Autocomplete_' + uid;

      if (!this.options.width) { this.options.width = this.el.width(); }
      this.mainContainerId = 'AutocompleteContainter_' + uid;

      $('<div id="' + this.mainContainerId + 
'" style="position:absolute;"><div class="autocomplete-w1"><div class="autocomplete-w2"><div class="autocomplete" id="' + 
autocompleteElId + '" style="display:none; width:' + this.options.width + 'px;"></div></div></div></div>').appendTo('body');
	
      this.container = $('#' + autocompleteElId);
      this.fixPosition();
      if (window.opera) {
        this.el.keypress(function(e) { me.onKeyPress(e); });
      } else {
        this.el.keydown(function(e) { me.onKeyPress(e); });
      }
      this.el.keyup(function(e) { me.onKeyUp(e); });
      this.el.blur(function() { me.enableKillerFn(); });
      this.el.focus(function() { me.fixPosition(); });

      this.container.css({ maxHeight: this.options.maxHeight + 'px' });
    },

    fixPosition: function() {
      var offset = this.el.offset();
      $('#' + this.mainContainerId).css({ top: (offset.top + this.el.height()) + 'px', left: offset.left + 'px' });
    },

    enableKillerFn: function() {
      var me = this;
      $(document).bind('click', me.killerFn);
    },

    disableKillerFn: function() {
      var me = this;
      $(document).unbind('click', me.killerFn);
    },

    killSuggestions: function() {
      var me = this;
      this.stopKillSuggestions();
      this.intervalId = window.setInterval(function() { me.hide(); me.stopKillSuggestions(); }, 300);
    },

    stopKillSuggestions: function() {
      window.clearInterval(this.intervalId);
    },

    onKeyPress: function(e) {
      if (!this.enabled) { return; }
      // return will exit the function
      // and event will not fire
      switch (e.keyCode) {
        case 27: //Event.KEY_ESC:
          this.el.val(this.currentValue);
          this.hide();
          break;
        case 9: //Event.KEY_TAB:
        case 13: //Event.KEY_RETURN:
          if (this.selectedIndex === -1) {
            this.hide();
            return;
          }
          this.select(this.selectedIndex);
          if (e.keyCode === 9/* Event.KEY_TAB */) { return; }
          break;
        case 38: //Event.KEY_UP:
          this.moveUp();
          break;
        case 40: //Event.KEY_DOWN:
          this.moveDown();
          break;
        default:
          return;
      }
      e.stopImmediatePropagation();
      e.preventDefault();
    },

    onKeyUp: function(e) {
      switch (e.keyCode) {
        case 38: //Event.KEY_UP:
        case 40: //Event.KEY_DOWN:
          return;
      }
      clearInterval(this.onChangeInterval);
      if (this.currentValue !== this.el.val()) {
        if (this.options.deferRequestBy > 0) {
          // Defer lookup in case when value changes very quickly:
          this.onChangeInterval = setInterval((function() {
            this.onValueChange();
          }).bind(this), this.options.deferRequestBy);
        } else {
          this.onValueChange();
        }
      }
    },

    onValueChange: function() {
      clearInterval(this.onChangeInterval);
      this.currentValue = this.el.val();
      this.selectedIndex = -1;
      if (this.ignoreValueChange) {
        this.ignoreValueChange = false;
        return;
      }
      if (this.currentValue === '' || this.currentValue.length < this.options.minChars) {
        this.hide();
      } else {
        this.getSuggestions();
      }
    },

    getSuggestions: function() {
      var cr = this.cachedResponse[this.currentValue];
      if (cr && Autocomplete.isArray(cr.suggestions)) {
        this.suggestions = cr.suggestions;
        this.data = cr.data;
        this.suggest();
      } else if (!this.isBadQuery(this.currentValue)) {
        var me = this;
        $.get(this.serviceUrl, { query: this.currentValue }, function(json) { me.processResponse(json); }, 'json');
      }
    },

    isBadQuery: function(q) {
      var i = this.badQueries.length;
      while (i--) {
        if (q.indexOf(this.badQueries[i]) === 0) { return true; }
      }
      return false;
    },

    hide: function() {
      this.enabled = false;
      this.selectedIndex = -1;
      this.container.hide();
    },

    suggest: function() {

      if (this.suggestions.length === 0) {
        this.hide();
        return;
      }

	//var parsedValue = this.currentValue.split("> ")[2]
//	alert(this.currentValue)
      var re = new RegExp('\\b' + this.currentValue.match(/\w+/g).join('|\\b'), 'gi');
      var me = this;
      var len = this.suggestions.length;
      var div, res_array, res_name, res_image;
      this.container.html('');
      for (var i = 0; i < len; i++) {
		res_array = me.suggestions[i].split("> ")
		res_img = res_array[0];
		//alert(res_img);
		res_name = res_array[1];
		//alert(res_name);
        div = $((me.selectedIndex === i ? '<div class="selected"' : '<div') + ' title="' + res_name + '">' + res_img + "> " + Autocomplete.highlight(res_name, re) + '</div>');
        div.mouseover((function(xi) { return function() { me.activate(xi); }; })(i));
        div.click((function(xi) { return function() { me.select(xi); }; })(i));
        //console.log(div);
        this.container.append(div);
      }
      this.enabled = true;
      this.container.show();
    },

    processResponse: function(json) {
      var response;
      try {
        response = json;
        if (!Autocomplete.isArray(response.data)) { response.data = []; }
      } catch (err) { return; }
      this.suggestions = response.suggestions;
      this.data = response.data;
      this.cachedResponse[response.query] = response;
      if (response.suggestions.length === 0) { this.badQueries.push(response.query); }
      if (response.query === this.currentValue) { this.suggest(); }
    },

    activate: function(index) {
      var divs = this.container.children();
      var activeItem;
      // Clear previous selection:
      if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
        $(divs.get(this.selectedIndex)).attr('class', '');
      }
      this.selectedIndex = index;
      if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
        activeItem = divs.get(this.selectedIndex);
        $(activeItem).attr('class', 'selected');
      }
      return activeItem;
    },

    deactivate: function(div, index) {
      div.className = '';
      if (this.selectedIndex === index) { this.selectedIndex = -1; }
    },

    select: function(i) {
      var selectedValue = this.suggestions[i];
      if (selectedValue) {
        this.el.val(selectedValue.split("> ")[2]);
        if (this.options.autoSubmit) {
          var f = this.el.parents('form');
          if (f.length > 0) { f.get(0).submit(); }
        }
        this.ignoreValueChange = true;
        this.hide();
        this.onSelect(i);
      }
    },

    moveUp: function() {
      if (this.selectedIndex === -1) { return; }
      if (this.selectedIndex === 0) {
        this.container.children().get(0).className = '';
        this.selectedIndex = -1;
        this.el.val(this.currentValue.split("> ")[2]);
        return;
      }
      this.adjustScroll(this.selectedIndex - 1);
    },

    moveDown: function() {
      if (this.selectedIndex === (this.suggestions.length - 1)) { return; }
      this.adjustScroll(this.selectedIndex + 1);
    },

    adjustScroll: function(i) {
      var activeItem = this.activate(i);
      var offsetTop = activeItem.offsetTop;
      var upperBound = this.container.scrollTop();
      var lowerBound = upperBound + this.options.maxHeight - 25;
      if (offsetTop < upperBound) {
        this.container.scrollTop(offsetTop);
      } else if (offsetTop > lowerBound) {
        this.container.scrollTop(offsetTop - this.options.maxHeight + 25);
      }
      this.el.val(this.suggestions[i].split("> ")[2]);
    },

    onSelect: function(i) {
      (this.options.onSelect || function() { })(this.suggestions[i], this.data[i]);
    }

  };

})(jQuery);
