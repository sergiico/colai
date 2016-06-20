'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    /**
     * jQuery object for simple PubSub interface
     */
    var $dispatcher = $({});

    var Video = function () {
        function Video(el, options) {
            _classCallCheck(this, Video);

            this.$container = el instanceof $ ? el : $(el);
            this.options = $.extend({}, options, Video._defaults);
            this.videoId = this.options.videoId || this.$container.data('video-id');
            this.$content = this.$container.find(this.options.contentSelector);
            this.$closeBtn = this.$container.find(this.options.closeBtnSelector);
            this.active = false;
            Video._initApi(this._init.bind(this));
        }

        _createClass(Video, [{
            key: 'open',
            value: function open() {
                var _this = this;

                var duration = this.options.duration;

                $dispatcher && $dispatcher.trigger(Video.EVENTS.beforeOpen);
                this._prevPos = {
                    top: this.$container.offset().top - $(window).scrollTop(),
                    height: this.$container.outerHeight()
                };
                this.$iframe.fadeIn(duration);
                this.$poster.fadeOut(duration);
                this.$container.addClass('is-active').css({
                    position: 'fixed',
                    zIndex: '999',
                    width: '100%',
                    top: this._prevPos.top,
                    left: 0
                }).animate({
                    top: 0,
                    height: window.innerHeight
                }, duration, function () {
                    _this.active = true;
                    _this.$container.addClass('is-opened');
                    _this.player.playVideo();
                    $dispatcher && $dispatcher.trigger(Video.EVENTS.afterOpen);
                });
            }
        }, {
            key: 'close',
            value: function close() {
                var _this2 = this;

                var duration = this.options.duration;
                var _prevPos = this._prevPos;
                var top = _prevPos.top;
                var height = _prevPos.height;

                $dispatcher && $dispatcher.trigger(Video.EVENTS.beforeClose);
                this.player.pauseVideo();
                this.$iframe.fadeOut(duration);
                this.$poster.fadeIn(duration);
                this.$container.removeClass('is-opened').animate({
                    top: top,
                    height: height
                }, duration, function () {
                    _this2.active = false;
                    _this2.$container.removeClass('is-active').css({
                        position: '',
                        zIndex: '',
                        width: '',
                        top: '',
                        left: '',
                        height: ''
                    });
                    $dispatcher && $dispatcher.trigger(Video.EVENTS.afterClose);
                });
            }
        }, {
            key: '_init',
            value: function _init() {
                this._initPlayer();
                this._setPoster();
            }
        }, {
            key: '_initPlayer',
            value: function _initPlayer() {
                var _this3 = this;

                var div = $('<div></div>').appendTo(this.$container);
                this.player = new YT.Player(div[0], {
                    height: '100%',
                    width: '100%',
                    videoId: this.videoId,
                    events: {
                        onReady: function onReady() {
                            _this3._bindActions();
                            _this3.$container.addClass(_this3.options.readyClass);
                        }
                    }
                });
                this.$iframe = this.$container.find('iframe').hide();
            }
        }, {
            key: '_setPoster',
            value: function _setPoster() {
                this.$poster = $('<div />').addClass('video-poster').css({
                    backgroundImage: 'url(http://img.youtube.com/vi/' + this.videoId + '/maxresdefault.jpg)'
                }).appendTo(this.$container);
            }
        }, {
            key: '_bindActions',
            value: function _bindActions() {
                var _this4 = this;

                this.$container.on('click', function () {
                    if (!_this4.active) _this4.open();
                });

                this.$closeBtn.on('click', function (e) {
                    e.preventDefault();
                    if (_this4.active) _this4.close();
                });
            }
        }]);

        return Video;
    }();

    Video._defaults = {
        duration: 500,
        contentSelector: '.video-container__content',
        closeBtnSelector: '.video-container__close',
        readyClass: 'is-ready',
        activeClass: 'is-active',
        openedClass: 'is-opened'
    };

    Video.EVENTS = {
        beforeOpen: 'video:before-open',
        afterOpen: 'video:after-open',
        beforeClose: 'video:before-close',
        afterClose: 'video:after-close'
    };
    Video._listeners = [];
    Video._apiReady = false;
    Video._apiFetching = false;

    Video._initApi = function () {
        var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

        if (this._apiReady) return cb();
        this._listeners.push(cb);

        if (this._apiFetching) return;

        var script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
        this._apiFetching = true;
    };

    Video._onYouTubeIframeAPIReady = function () {
        this._apiFetching = false;
        this._apiReady = true;
        this._listeners.forEach(function (func) {
            return func();
        });
        this._listeners = [];
    };

    var _oldCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = function () {
        if (typeof _oldCallback === 'function') _oldCallback();
        Video._onYouTubeIframeAPIReady();
    };

    var ScrollController = function () {
        var _instance = null;

        var ScrollController = function () {
            function ScrollController() {
                _classCallCheck(this, ScrollController);

                this.$root = $('body');
                this.disabled = false;
                this.scrollPos = null;
                this._preventDefault = this._preventDefault.bind(this);
                this.measureScrollbar();
            }

            _createClass(ScrollController, [{
                key: '_preventDefault',
                value: function _preventDefault(e) {
                    e.preventDefault();
                }
            }, {
                key: 'disable',
                value: function disable() {
                    if (this.disabled) return;
                    this.$root.on('wheel', this._preventDefault);
                    this.$root.addClass('scroll-disabled').css({
                        paddingRight: this.scrollBar,
                        overflow: 'hidden'
                    });
                    this.scrollPos = this.$root.scrollTop();
                    this.disabled = true;
                }
            }, {
                key: 'enable',
                value: function enable() {
                    if (!this.disabled) return;
                    this.$root.off('wheel', this._preventDefault);
                    this.$root.removeClass('scroll-disabled').css({
                        paddingRight: '',
                        overflow: ''
                    });
                    this.$root.scrollTop(this.scrollPos);
                    this.disabled = false;
                }
            }, {
                key: 'measureScrollbar',
                value: function measureScrollbar() {
                    var scrollDiv = document.createElement('div');
                    scrollDiv.style.position = 'absolute';
                    scrollDiv.style.top = '-9999px';
                    scrollDiv.style.width = '50px';
                    scrollDiv.style.height = '50px';
                    scrollDiv.style.overflow = 'scroll';
                    this.$root.append(scrollDiv);
                    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                    this.$root[0].removeChild(scrollDiv);
                    this.scrollBar = scrollbarWidth;
                }
            }]);

            return ScrollController;
        }();

        return function () {
            if (!_instance) {
                _instance = new ScrollController();
            }
            return _instance;
        };
    }();

    /*
     module GradientText was taken from main page and was adapted
     for inner pages, without back compatibility
     */
    /**
     * Originally created by AP on 20.03.16.
     */

    var GradientText = function () {
        function GradientText(el) {
            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, GradientText);

            this._validateParams(params);
            this.$container = el instanceof $ ? el : $(el);
            this.params = $.extend(true, {}, GradientText.DEFAULT_PARAMS, params);
            this.$text = this.$container.find(this.params.textSelector);

            this._createSvgElement();
            this._updateSizes();

            this.snap = Snap(this.$svg[0]);
            this.rawText = this.$text.html().split('<br>');
            this.mask = this.snap.text(0, 0, this.rawText).attr({
                fill: 'white',
                'class': this.params.textClass
            });

            this.colorNormal = this.snap.rect(0, 0, 10, 10).attr({
                fill: this.params.normalColor
            });
            this.colorActive = this.snap.rect(0, 0, 10, 10).attr({
                fill: 'l()#d82020-#ff5656-#e945ad',
                fillOpacity: 0
            });
            this.colorsGroup = this.snap.group(this.colorNormal, this.colorActive).attr({
                mask: this.mask
            });

            this._bindEvents();
            this.resize();
            this.$container.addClass('is-ready');
        }

        _createClass(GradientText, [{
            key: '_createSvgElement',
            value: function _createSvgElement() {
                this.$svg = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg')).css({
                    position: 'absolute',
                    top: 0,
                    left: 0
                }).appendTo(this.$container);
            }
        }, {
            key: '_updateSizes',
            value: function _updateSizes() {
                var _t = this.$text;
                this.sizes = {
                    w: _t.width(),
                    h: _t.height(),
                    fontSize: parseFloat(_t.css('font-size')),
                    lineHeight: parseFloat(_t.css('line-height'))
                };
            }
        }, {
            key: '_bindEvents',
            value: function _bindEvents() {
                var _this5 = this;

                this.$container.on('mouseenter', function (e) {
                    _this5._mouseListener(e);
                });
                this.$container.on('mouseleave', function (e) {
                    _this5._mouseListener(e);
                });
                $(window).on('resize', _.throttle(function () {
                    _this5._updateSizes();
                    _this5.resize();
                }, 300));
            }
        }, {
            key: '_validateParams',
            value: function _validateParams(_ref) {
                var textSelector = _ref.textSelector;
                var textClass = _ref.textClass;

                if (!textSelector && typeof textSelector !== 'string') {
                    throw new Error('"textSelector" must be a valid css selector string');
                }
                if (!textClass && typeof textClass !== 'string') {
                    throw new Error('"textClass" must be a valid css selector string');
                }
            }
        }, {
            key: 'resize',
            value: function resize() {
                var magicValue = 0.185;
                var _sizes = this.sizes;
                var w = _sizes.w;
                var h = _sizes.h;
                var fontSize = _sizes.fontSize;

                var lineHeightOffset = fontSize * magicValue;

                this.snap.attr({
                    viewBox: '0 0 ' + w + ' ' + h,
                    width: w + 'px',
                    height: h + 'px'
                });
                this.mask.selectAll('tspan').forEach(function (tspan, i) {
                    tspan.attr({
                        x: 0,
                        y: fontSize * (i + 1) - lineHeightOffset
                    });
                });
                this.colorNormal.attr({
                    width: w,
                    height: h
                });
                this.colorActive.attr({
                    width: w,
                    height: h
                });
            }
        }, {
            key: '_mouseListener',
            value: function _mouseListener(e) {
                var duration = this.params.duration;

                switch (e.type) {
                    case 'mouseenter':
                        this.colorActive.animate({
                            fillOpacity: 1
                        }, duration, mina.easein);
                        break;
                    case 'mouseleave':
                        this.colorActive.animate({
                            fillOpacity: 0
                        }, duration, mina.easein);
                        break;
                }
            }
        }]);

        return GradientText;
    }();

    GradientText.DEFAULT_PARAMS = {
        normalColor: '#333333',
        duration: 500
    };

    /*
     these two modules (InputField and LogIn)
     are the same as on main page, nothing was changed
     */
    /**
     * Created by AP on 25.04.16.
     */

    var InputField = function () {
        /**
         *
         * @param {jQuery} $container
         */

        function InputField($container) {
            var _this6 = this;

            _classCallCheck(this, InputField);

            this.$container = $container;
            this.$input = $container.find('input');
            this.$label = $container.find('label');
            this.$border = $container.find('.border-line');

            this.$input.on('focusin', function (e) {
                _this6._inputListener(e);
            });
            this.$input.on('focusout', function (e) {
                _this6._inputListener(e);
            });
        }

        /**
         *
         * @param {jQuery.Event} e
         * @private
         */


        _createClass(InputField, [{
            key: '_inputListener',
            value: function _inputListener(e) {
                switch (e.type) {
                    case 'focusin':
                        {
                            this.$label.addClass('minified');
                            this.$border.addClass('active');
                            break;
                        }
                    case 'focusout':
                        {
                            if (this.$input.val().trim().length == 0) {
                                this.$label.removeClass('minified');
                            }
                            this.$border.removeClass('active');
                            break;
                        }
                }
            }
        }]);

        return InputField;
    }();

    /**
     * Created by AP on 25.04.16.
     */


    var LogIn = function () {
        /**
         *
         * @param $container
         */

        function LogIn($container) {
            var _this7 = this;

            _classCallCheck(this, LogIn);

            this.$dispatcher = $({});
            this.$container = $container;
            this.$inputs = $container.find('.input-field');
            this.$closeBtn = $container.find('.close-btn');
            this.$loginInputsContainer = $container.find('.mail-n-password');
            this.$loginEmailField = $container.find('#login .input-field_email input');
            this.$loginPasswordField = $container.find('#login .input-field_password input');
            this.$signupEmailField = $container.find('#signup .input-field_email input');
            this.$signupPasswordField = $container.find('#signup .input-field_password input');
            this.$helperBtn = $container.find('.helper-btn');

            /** @type {Array.<InputField>} */
            this.inputs = [];

            /** @type {String} */
            this.state = undefined;

            /** @type {String} */
            this.signupPasswordDefaultCSS = this.$signupPasswordField.parent().attr('class');

            var i;
            for (i = 0; i < this.$inputs.length; i++) {
                this.inputs.push(new InputField(this.$inputs.eq(i)));
            }

            this.setState(LogIn.NORMAL_STATE);

            this.$signupPasswordField.on('input', function (e) {
                _this7._passwordFieldListener(e);
            });
            this.$helperBtn.on('click', function (e) {
                _this7._helperBtnListener(e);
            });
            this.$closeBtn.on('click', function (e) {
                _this7._closeBtnListener(e);
            });
            this.$container.on('mousewheel', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        }

        /**
         * Show component
         */


        _createClass(LogIn, [{
            key: 'show',
            value: function show() {
                $('body').addClass('log-in-state');
                this.$container.removeClass('hidden');
            }

            /**
             * Hide component
             */

        }, {
            key: 'hide',
            value: function hide() {
                $('body').removeClass('log-in-state');
                this.$container.addClass('hidden');
            }
        }, {
            key: 'setState',
            value: function setState(state) {
                if (state == this.state) {
                    return;
                }

                switch (state) {
                    case LogIn.NORMAL_STATE:
                        {
                            this.$loginInputsContainer.removeClass('recover-pswd-state');
                            this.$helperBtn.find('.helper-btn__content_forgot').removeClass('hidden');
                            this.$helperBtn.find('.helper-btn__content_back').addClass('hidden');
                            break;
                        }
                    case LogIn.FORGOT_PASSWORD_STATE:
                        {
                            this.$loginInputsContainer.addClass('recover-pswd-state');
                            this.$helperBtn.find('.helper-btn__content_forgot').addClass('hidden');
                            this.$helperBtn.find('.helper-btn__content_back').removeClass('hidden');
                            break;
                        }
                }
                this.state = state;
            }

            /**
             *
             * @param {jQuery.Event} e
             * @private
             */

        }, {
            key: '_passwordFieldListener',
            value: function _passwordFieldListener(e) {
                var result = zxcvbn(this.$signupPasswordField.val());

                this.$signupPasswordField.parent().attr({
                    'class': this.signupPasswordDefaultCSS + ' ' + 'strength_' + result.score
                });
            }

            /**
             *
             * @param {jQuery.Event} e
             * @private
             */

        }, {
            key: '_helperBtnListener',
            value: function _helperBtnListener(e) {
                var targetState;

                if (this.state == LogIn.NORMAL_STATE) {
                    targetState = LogIn.FORGOT_PASSWORD_STATE;
                } else if (this.state == LogIn.FORGOT_PASSWORD_STATE) {
                    targetState = LogIn.NORMAL_STATE;
                }
                this.setState(targetState);
            }

            /**
             *
             * @param {jQuery.Event} e
             * @private
             */

        }, {
            key: '_closeBtnListener',
            value: function _closeBtnListener(e) {
                this.hide();
            }
        }]);

        return LogIn;
    }();

    LogIn.NORMAL_STATE = 'normal_state';
    LogIn.FORGOT_PASSWORD_STATE = 'forgot_password_state';

    var loginScreen = new LogIn($('.log-in'));
    var scroll = ScrollController();

    $('#login-btn, #register-btn').on('click', function (e) {
        e.preventDefault();
        console.log(loginScreen);
        loginScreen.show();
    });

    $dispatcher.on(Video.EVENTS.beforeOpen, function () {
        scroll.disable();
    });

    $dispatcher.on(Video.EVENTS.afterClose, function () {
        scroll.enable();
    });

    $('.js-video').each(function (i, el) {
        return new Video(el);
    });
    $('.js-gradient').each(function (i, el) {
        return new GradientText(el, {
            textSelector: 'h2',
            textClass: 'h1-like'
        });
    });
})();
//# sourceMappingURL=app.js.map
