"use strict";

(function (factory) {
  // Notice that the last argument is set to enable log info, or leave `null`
  // to silence all logs.
  factory(jQuery, console);

  // Scan and apply plugins by default.
  // Auto binding plugins to html elements which `data-plugin` is set.
  //    e.g. <div data-plugin="plugin-name" data-key="value" ... >...</div>
  // Except the plugin name, other attributes with `data-*` prefix will be
  // passed to the plugin as `props`.
  // * Think `props` as settings to plugins.
  $(function () {
    $.enableAutoBinding();
  });
})(function ($, logger) {
  /****************************************************************************
   *                        Enable Auto Binding                               *
   ****************************************************************************/

  $.enableAutoBinding = function () {
    $("[data-plugin]").each(function () {
      var that = $(this),
        data = that.data(),
        name = data["plugin"];

      if (!(name in $.fn)) {
        throw new ReferenceError("Plugin '" + name + "' does not exist.");
      }

      that[name](data);
    });
  };

  /****************************************************************************
   *                        Widget Registration                               *
   ****************************************************************************/

  $.wrapper.widget = function (name, base) {
    // TODO type check
    $.widget(name, base);
  };

  /****************************************************************************
   *                          Support Functions                               *
   ****************************************************************************/

  // For logging support, all logs will be suppress if logger is not set.
  function logging() {}
  Object.assign(logging, {
    error: (...data) => logger && logger.error(...data),
    info: (...data) => logger && logger.info(...data),
    warn: (...data) => logger && logger.warn(...data),
    log: (...data) => logger && logger.log(...data),
    debug: (...data) => logger && logger.debug(...data),
  });

  /**
   * Test if the object is the given type.
   *
   * @param {object} obj test object
   * @param {string} type type string
   * @returns test result
   */
  function isType(obj, type) {
    return typeof obj === type;
  }
});
