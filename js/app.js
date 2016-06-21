"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();!function(){function t(t){var e=$(".fade-in"),i=500,s=[];null==t&&(t=new ScrollMagic.Controller({container:"body",loglevel:2}));var n=_.debounce(function(){s.forEach(function(t,e){var s=150*e;s=s>450?450:s,t.init||(t.init=!0,setTimeout(function(){t.$el.addClass("animate")},s),setTimeout(function(){t.$el.removeClass("fade-in slide-up animate")},s+i))}),s.length=0},100);e.each(function(e,i){var o=$(i),a=o.hasClass("slide-up")?100:50;new ScrollMagic.Scene({offset:a,triggerElement:i,triggerHook:"onEnter"}).on("start",function(t){switch(console.log(t.scrollDirection),t.scrollDirection){case"FORWARD":case"PAUSED":s.push({$el:o,init:!1}),n();break;case"REVERSE":o.addClass("fade-in slide-up")}}).addTo(t)})}var e=$({}),i=function(){function t(e,i){_classCallCheck(this,t),this.$container=e instanceof $?e:$(e),this.options=$.extend({},i,t._defaults),this.videoId=this.options.videoId||this.$container.data("video-id"),this.$content=this.$container.find(this.options.contentSelector),this.$closeBtn=this.$container.find(this.options.closeBtnSelector),this.active=!1,t._initApi(this._init.bind(this))}return _createClass(t,[{key:"open",value:function(){var i=this,s=this.options.duration;e&&e.trigger(t.EVENTS.beforeOpen),this._prevPos={top:this.$container.offset().top-$(window).scrollTop(),height:this.$container.outerHeight()},this.$iframe.fadeIn(s),this.$poster.fadeOut(s),this.$container.addClass("is-active").css({position:"fixed",zIndex:"999",width:"100%",top:this._prevPos.top,left:0}).animate({top:0,height:window.innerHeight},s,function(){i.active=!0,i.$container.addClass("is-opened"),i.player.playVideo(),e&&e.trigger(t.EVENTS.afterOpen)})}},{key:"close",value:function(){var i=this,s=this.options.duration,n=this._prevPos,o=n.top,a=n.height;e&&e.trigger(t.EVENTS.beforeClose),this.player.pauseVideo(),this.$iframe.fadeOut(s),this.$poster.fadeIn(s),this.$container.removeClass("is-opened").animate({top:o,height:a},s,function(){i.active=!1,i.$container.removeClass("is-active").css({position:"",zIndex:"",width:"",top:"",left:"",height:""}),e&&e.trigger(t.EVENTS.afterClose)})}},{key:"_init",value:function(){this._initPlayer(),this._setPoster()}},{key:"_initPlayer",value:function(){var t=this,e=$("<div></div>").appendTo(this.$container);this.player=new YT.Player(e[0],{height:"100%",width:"100%",videoId:this.videoId,events:{onReady:function(){t._bindActions(),t.$container.addClass(t.options.readyClass)}}}),this.$iframe=this.$container.find("iframe").hide()}},{key:"_setPoster",value:function(){this.$poster=$("<div />").addClass("video-poster").css({backgroundImage:"url(http://img.youtube.com/vi/"+this.videoId+"/maxresdefault.jpg)"}).appendTo(this.$container)}},{key:"_bindActions",value:function(){var t=this;this.$container.on("click",function(){t.active||t.open()}),this.$closeBtn.on("click",function(e){e.preventDefault(),t.active&&t.close()})}}]),t}();i._defaults={duration:500,contentSelector:".video-container__content",closeBtnSelector:".video-container__close",readyClass:"is-ready",activeClass:"is-active",openedClass:"is-opened"},i.EVENTS={beforeOpen:"video:before-open",afterOpen:"video:after-open",beforeClose:"video:before-close",afterClose:"video:after-close"},i._listeners=[],i._apiReady=!1,i._apiFetching=!1,i._initApi=function(){var t=arguments.length<=0||void 0===arguments[0]?function(){}:arguments[0];if(this._apiReady)return t();if(this._listeners.push(t),!this._apiFetching){var e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",document.head.appendChild(e),this._apiFetching=!0}},i._onYouTubeIframeAPIReady=function(){this._apiFetching=!1,this._apiReady=!0,this._listeners.forEach(function(t){return t()}),this._listeners=[]};var s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(){"function"==typeof s&&s(),i._onYouTubeIframeAPIReady()};var n=function(){var t=null,e=function(){function t(){_classCallCheck(this,t),this.$root=$("body"),this.disabled=!1,this.scrollPos=null,this._preventDefault=this._preventDefault.bind(this),this.measureScrollbar()}return _createClass(t,[{key:"_preventDefault",value:function(t){t.preventDefault()}},{key:"disable",value:function(){this.disabled||(this.$root.on("wheel",this._preventDefault),this.$root.addClass("scroll-disabled").css({paddingRight:this.scrollBar,overflow:"hidden"}),this.scrollPos=this.$root.scrollTop(),this.disabled=!0)}},{key:"enable",value:function(){this.disabled&&(this.$root.off("wheel",this._preventDefault),this.$root.removeClass("scroll-disabled").css({paddingRight:"",overflow:""}),this.$root.scrollTop(this.scrollPos),this.disabled=!1)}},{key:"measureScrollbar",value:function(){var t=document.createElement("div");t.style.position="absolute",t.style.top="-9999px",t.style.width="50px",t.style.height="50px",t.style.overflow="scroll",this.$root.append(t);var e=t.offsetWidth-t.clientWidth;this.$root[0].removeChild(t),this.scrollBar=e}}]),t}();return function(){return t||(t=new e),t}}(),o=function(){function t(e){var i=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];_classCallCheck(this,t),this._validateParams(i),this.$container=e instanceof $?e:$(e),this.params=$.extend(!0,{},t.DEFAULT_PARAMS,i),this.$text=this.$container.find(this.params.textSelector),this._createSvgElement(),this._updateSizes(),this.snap=Snap(this.$svg[0]),this.rawText=this.$text.html().split("<br>"),this.mask=this.snap.text(0,0,this.rawText).attr({fill:"white","class":this.params.textClass}),this.colorNormal=this.snap.rect(0,0,10,10).attr({fill:this.params.normalColor}),this.colorActive=this.snap.rect(0,0,10,10).attr({fill:"l()#d82020-#ff5656-#e945ad",fillOpacity:0}),this.colorsGroup=this.snap.group(this.colorNormal,this.colorActive).attr({mask:this.mask}),this._bindEvents(),this.resize(),this.$container.addClass("is-ready")}return _createClass(t,[{key:"_createSvgElement",value:function(){this.$svg=$(document.createElementNS("http://www.w3.org/2000/svg","svg")).css({position:"absolute",top:0,left:0}).appendTo(this.$container)}},{key:"_updateSizes",value:function(){var t=this.$text;this.sizes={w:t.width(),h:t.height(),fontSize:parseFloat(t.css("font-size")),lineHeight:parseFloat(t.css("line-height"))}}},{key:"_bindEvents",value:function(){var t=this;this.$container.on("mouseenter",function(e){t._mouseListener(e)}),this.$container.on("mouseleave",function(e){t._mouseListener(e)}),$(window).on("resize",_.throttle(function(){t._updateSizes(),t.resize()},300))}},{key:"_validateParams",value:function(t){var e=t.textSelector,i=t.textClass;if(!e&&"string"!=typeof e)throw new Error('"textSelector" must be a valid css selector string');if(!i&&"string"!=typeof i)throw new Error('"textClass" must be a valid css selector string')}},{key:"resize",value:function(){var t=.185,e=this.sizes,i=e.w,s=e.h,n=e.fontSize,o=n*t;this.snap.attr({viewBox:"0 0 "+i+" "+s,width:i+"px",height:s+"px"}),this.mask.selectAll("tspan").forEach(function(t,e){t.attr({x:0,y:n*(e+1)-o})}),this.colorNormal.attr({width:i,height:s}),this.colorActive.attr({width:i,height:s})}},{key:"_mouseListener",value:function(t){var e=this.params.duration;switch(t.type){case"mouseenter":this.colorActive.animate({fillOpacity:1},e,mina.easein);break;case"mouseleave":this.colorActive.animate({fillOpacity:0},e,mina.easeout)}}}]),t}();o.DEFAULT_PARAMS={normalColor:"#333333",duration:500};var a=function(){function t(e){var i=this;_classCallCheck(this,t),this.$container=e,this.$input=e.find("input"),this.$label=e.find("label"),this.$border=e.find(".border-line"),this.$input.on("focusin",function(t){i._inputListener(t)}),this.$input.on("focusout",function(t){i._inputListener(t)})}return _createClass(t,[{key:"_inputListener",value:function(t){switch(t.type){case"focusin":this.$label.addClass("minified"),this.$border.addClass("active");break;case"focusout":0==this.$input.val().trim().length&&this.$label.removeClass("minified"),this.$border.removeClass("active")}}}]),t}(),r=function(){function t(e){var i=this;_classCallCheck(this,t),this.$dispatcher=$({}),this.$container=e,this.$inputs=e.find(".input-field"),this.$closeBtn=e.find(".close-btn"),this.$loginInputsContainer=e.find(".mail-n-password"),this.$loginEmailField=e.find("#login .input-field_email input"),this.$loginPasswordField=e.find("#login .input-field_password input"),this.$signupEmailField=e.find("#signup .input-field_email input"),this.$signupPasswordField=e.find("#signup .input-field_password input"),this.$helperBtn=e.find(".helper-btn"),this.inputs=[],this.state=void 0,this.signupPasswordDefaultCSS=this.$signupPasswordField.parent().attr("class");var s;for(s=0;s<this.$inputs.length;s++)this.inputs.push(new a(this.$inputs.eq(s)));this.setState(t.NORMAL_STATE),this.$signupPasswordField.on("input",function(t){i._passwordFieldListener(t)}),this.$helperBtn.on("click",function(t){i._helperBtnListener(t)}),this.$closeBtn.on("click",function(t){i._closeBtnListener(t)}),this.$container.on("mousewheel",function(t){t.preventDefault(),t.stopPropagation()})}return _createClass(t,[{key:"show",value:function(){$("body").addClass("log-in-state"),this.$container.removeClass("hidden")}},{key:"hide",value:function(){$("body").removeClass("log-in-state"),this.$container.addClass("hidden")}},{key:"setState",value:function(e){if(e!=this.state){switch(e){case t.NORMAL_STATE:this.$loginInputsContainer.removeClass("recover-pswd-state"),this.$helperBtn.find(".helper-btn__content_forgot").removeClass("hidden"),this.$helperBtn.find(".helper-btn__content_back").addClass("hidden");break;case t.FORGOT_PASSWORD_STATE:this.$loginInputsContainer.addClass("recover-pswd-state"),this.$helperBtn.find(".helper-btn__content_forgot").addClass("hidden"),this.$helperBtn.find(".helper-btn__content_back").removeClass("hidden")}this.state=e}}},{key:"_passwordFieldListener",value:function(t){var e=zxcvbn(this.$signupPasswordField.val());this.$signupPasswordField.parent().attr({"class":this.signupPasswordDefaultCSS+" strength_"+e.score})}},{key:"_helperBtnListener",value:function(e){var i;this.state==t.NORMAL_STATE?i=t.FORGOT_PASSWORD_STATE:this.state==t.FORGOT_PASSWORD_STATE&&(i=t.NORMAL_STATE),this.setState(i)}},{key:"_closeBtnListener",value:function(t){this.hide()}}]),t}();r.NORMAL_STATE="normal_state",r.FORGOT_PASSWORD_STATE="forgot_password_state";var l=new r($(".log-in")),c=n(),h=new ScrollMagic.Controller({container:"body"});t(h),$(".js-login, .js-register").on("click",function(t){t.preventDefault(),l.show()}),e.on(i.EVENTS.beforeOpen,function(){c.disable()}),e.on(i.EVENTS.afterClose,function(){c.enable()}),$(".js-video").each(function(t,e){return new i(e)}),$(".js-gradient").each(function(t,e){return new o(e,{textSelector:"h2",textClass:"h1-like"})}),new ScrollMagic.Scene({triggerElement:"body",triggerHook:"onLeave",offset:50}).setClassToggle(".header.header--mini","is-visible").addTo(h)}();
//# sourceMappingURL=app.js.map
