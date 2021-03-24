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
    !window.__prevent_auto_binding && $.enableAutoBinding();
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

  $.wrapper = function (name, base) {
    this.widget(name, base);
  };

  $.wrapper.widget = function (name, base) {
    var packaging = "custom",
      defineName = name.split(".");

    if (defineName.length > 1) {
      packaging = defineName[0];
      name = defineName[1];
    }

    if (name in $.fn) {
      throw new Error("Plugin '" + name + "' already exists.");
    }

    var props,
      specs = {},
      key,
      _create,
      _setOptions;

    function empty() {}
    function alwaysTrue() {
      return true;
    }

    if ("props" in base) {
      props = base.props;

      Object.keys(props).forEach(function (key) {
        var spec = $.extend({}, props[key]),
          _validate = spec.validate || alwaysTrue;

        if (isType(_validate, "string")) {
          // Literal type.
          spec.validate = function (val) {
            return isType(val, _validate);
          };
        } else if (isType(_validate, "array")) {
          // A list of literal values.
          spec.validate = function (val) {
            return _validate.indexOf(val) > -1;
          };
        } else if (isType(_validate, "function")) {
          // Validation function.
          spec.validate = _validate;
        } else {
          // Not supported value.
          throw new TypeError(
            "Invalid validate definition for plugin '" + name + "': " + spec
          );
        }

        specs[key] = spec;
      });

      if ("_create" in base) {
        _create = base._create;
        base._create = function () {
          var options = this.options,
            missing = [],
            failed = {},
            value,
            msgs;

          for (key in specs) {
            value = options[key];

            if (value === undefined && !specs[key].optional) {
              // Missing key if undefined and not set as optional.
              missing.push(key);
            }

            if (value !== undefined && !specs[key].validate(value)) {
              // Invalid value.
              failed[key] = value;
            }
          }

          if (missing.length > 0 || Object.keys(failed).length > 0) {
            msgs = ["Validation failed for plugin '" + name + "'."];

            if (missing.length > 0) {
              msgs.push("Missing keys: " + missing.join(", "));
            }

            if (Object.keys(failed).length > 0) {
              msgs.push("Invalid values: ", JSON.stringify(failed));
            }

            throw new TypeError(msgs.join("\n"));
          }

          return _create.apply(this, arguments);
        };
      }

      if ("_setOptions" in base) {
        _setOptions = base._setOptions;
        base._setOptions = function (options) {
          var value, msg;
          for (key in options) {
            if (key in spec) {
              value = options[key];
              if (!specs[key].validate(value)) {
                if (msg === undefined) {
                  msg = [
                    "Validation failed for plugin '" + name + "'.",
                    "Invalid values: ",
                  ];
                }
                msg.push(key + ":" + value);
              }
            }
          }

          if (msg !== undefined) {
            throw new TypeError(msgs.join("\n"));
          }

          return _setOptions.apply(this, arguments);
        };
      }
    }

    // TODO type check
    $.widget(packaging + "." + name, base);
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
    switch (type) {
      case "list":
      case "array":
        return Array.isArray(obj);
      default:
        return typeof obj === type;
    }
  }
});
