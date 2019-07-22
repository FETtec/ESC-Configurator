/*
 * jQuery UI Notification
 * Copyright (c) 2011 Marcus Ekwall
 *
 * http://writeless.se/projects/jquery-ui-notification/
 *
 * Depends:
 *   - jQuery 1.4
 *   - jQuery UI 1.8 widget factory
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/
(function ($) {

    // role=application on body required for screenreaders to correctly interpret aria attributes
    if (!$(document.body).is('[role]')) {
        $(document.body).attr('role', 'application');
    }

    var increments = 0;
    $.widget("ui.notification", {
        options: {
            notificationClass: "ui-widget-content",
            offset: 10,
            duration: 2000,
            show: {
                effect: 'fade',
                options: {},
                speed: 250,
                callback: function () { }
            },
            hide: {
                effect: 'fade',
                options: {},
                speed: 250,
                callback: function () { }
            },
            fancyHide: true,
            sticky: false,
            stack: "below"
        },
        content: {
            title: "Notification",
            content: function () {
                return $(this).attr("title");
            },
            template: "<h4>${Title}</h4><p>${Content}</p>",
        },
        _init: function () {
            // container for notifications
            this.notifications = [];

            // notification dummy
            this.notification = $("<div></div>")
                .attr("role", "notification")
                .attr("aria-hidden", "true")
                .addClass("ui-notification ui-widget ui-corner-all")
                .hide();

            if (this.options.stack == "below") {
                this.notification.css('marginBottom', this.options.offset);
            } else {
                this.notification.css('marginTop', this.options.offset);
            }

            // notification close button dummy
            this.notificationClose = $("<a/>")
                .attr("href", "#")
                .attr("role", "button")
                .addClass("ui-notification-close ui-corner-all")
                .hover(function () {
                    $(this).addClass("ui-state-hover");
                }, function () {
                    $(this).removeClass("ui-state-hover");
                })
                .append(
                    $("<span></span>")
                        .addClass("ui-icon ui-icon-closethick")
                        .text("close")
                );

            // notification content dummy
            this.notificationContent = $("<div></div>")
                .addClass("ui-notification-content");
        },

        enable: function () {
            this.options.disabled = false;
        },

        disable: function () {
            this.options.disabled = true;
        },

        widget: function (index) {
            return index ? this.notifications[index] : this.notifications;
        },

        index: function () {
            return increments;
        },

        create: function (content, options) {
            var self = this;

            // get defaults
            content = $.extend({}, this.content, content);

            // override options if necessary
            options = $.extend({}, this.options, options);

            if (options.disabled) {
                return;
            }

            // create a new notification instance
            this.notifications.push(new $.ui.notification.instance(this)._create(content, $.extend({}, this.options, options)));
        }
    });

    // instance constructor
    $.extend($.ui.notification, {
        instance: function (widget) {
            this.parent = widget;
        }
    });

    // notification instance
    $.extend($.ui.notification.instance.prototype, {
        _create: function (content, options) {
            this.options = options;

            // render content template
            var content = content.template
                .replace("${Title}", content.title)
                .replace("${Content}", content.content);

            // create notification element
            this.element = this.parent.notification.clone(true).attr("id", "ui-notification-" + increments++)
                // append the content
                .append(this.parent.notificationContent.clone().html(content))
                // add custom class
                .addClass(options.notificationClass);

            if (options.stack == "below") {
                this.element.appendTo(this.parent.element);
            } else {
                this.element.prependTo(this.parent.element);
            }

            // if sticky, add close button
            var self = this;
            if (options.sticky) {
                this.parent.notificationClose
                    .clone(true)
                    .click(function (event) {
                        self.hide();
                        return false;
                    })
                    .prependTo(this.element);
            } else {
                // otherwise set timeout to close it automatically
                setTimeout(function () { self.hide(); }, self.options.duration);
            }

            // let's show the notifiction
            this.show();

            // return instance
            return this;
        },
        show: function () {
            var anim = this.options.show;
            this.element
                .attr("aria-hidden", "false")
                .show(
                    anim.effect,
                    anim.options,
                    anim.speed,
                    anim.callback
                );
        },
        hide: function () {
            var self = this,
                anim = this.options.hide,
                wrap = $("<div></div>")
                    .height(this.element.outerHeight(true));

            if (this.options.fancyHide) {
                this.element.wrap(wrap);
            }
            this.element.hide(
                anim.effect,
                anim.options,
                anim.speed,
                function () {
                    if (self.options.fancyHide) {
                        $(this).parent().animate({ height: 0 },
                            250,
                            function () {
                                $(this).remove();
                            }
                        );
                    } else {
                        $(this).remove();
                    }
                    if (anim.callback) {
                        anim.callback();
                    }
                }
            );
        }

    });

})(jQuery);