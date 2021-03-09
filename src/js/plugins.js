"use strict";

(function (factory) {
  // Register plugin with the name `_plugin` to avoid namespace pollution.
  factory(jQuery, "_plugin");

  // Scan and apply plugins by default.
  // Auto binding plugins to html elements which `data-plugin` is set.
  // e.g. <div data-plugin="plugin-name" data-key="value" ... >...</div>
  // Except the plugin name, other attributes with `data-*` prefix will be
  // passed to the plugin as `props`.
  // * Think `props` as settings to plugins.
  $(document).ready(function () {
    $(document)._plugin();
  });
})(function ($, bindName) {
  $.widget("custom." + bindName, {
    // Plugin list for management.
    _plugins: [],

    // Plugin specs definition.
    // Will be used to determine if the given plugin meet requirements.
    // Only these non-optional specs are required and errors will be thrown
    // during the plugin registration period.
    // * JavaScript is only allow positioned arguments, so that the arguments
    // defined below could be considered in ordered.
    _pluginSpecs: {
      // Plugin should has its own props definition to tell that
      // which arguments are required to perform its tasks.
      // Props should be defined as an object like this:
      // * Props value scope validation is in consideration.
      //
      // props: {
      //   requiredKey: {},
      //   optionalKey: { optional: true },
      // },
      props: {
        type: "object",
        desc: [
          "Props definition for validation use, ",
          "keys which `optional` is set to true will not cause the validation failed.",
        ],
      },

      // Default props is optional but is useful to let user to
      // omit some parameters safely.
      // This object will be the base for merging user parameters.
      defaultProps: {
        type: "object",
        desc: "Default props values and will be overwrote by user input.",
        optional: true,
      },

      // UI manipulation logic here to response to the data changes.
      // As for performance consideration, this function will be performed at most
      // 60 times within a second to optimize the user experience.
      render: {
        type: "function",
        desc: "Will be triggered to response to the prop changes.",
        arguments: {
          elem: "Element object in jQuery instance.",
          props: "User parameters merged base on default props, if exists.",
        },
      },

      // Event handler binding logic here to response to the user actions.
      // Consider the handlers are responsible for produce data only because
      // there's no debounce settled and it's expensive for UI manipulation here
      // especially while deal with the mouse or scroll events.
      initialize: {
        type: "function",
        desc: [
          "Will be called only once for initialize the plugin with the target element, ",
          "consider to bind event handler here.",
        ],
        arguments: {
          elem: "Element object in jQuery instance.",
          props: "User parameters merged base on default props, if exists.",
        },
      },

      // A chance to do something like unbind plugin or garbage collection.
      // It's totally optional and use it by your need.
      cleanup: {
        type: "function",
        desc: [
          "To do some cleanup task after target element is removed from dom, ",
          "use it if necessary.",
        ],
        optional: true,
      },

      // A chance to modify the props as your need.
      // The return value of this function will be used as the final props to
      // pass to the `render` function, so keep in mind while using this hook.
      setOptions: {
        type: "function",
        desc: [
          "A hook to modify the props base on the user parameters and the old props, ",
          "this function will be called before `render` function.",
        ],
        optional: true,
        arguments: {
          props: "The new props.",
          oldProps: "The old one.",
        },
      },
    },

    // Required by jQuery UI to initialize a plugin with target element.
    // The target element is stored in `this.element` and never be a collection.
    // (as the official docs said, each element in a collection should has its own
    // state so this function will be called recursively to each element by jQuery UI)
    // The parameters passed as shown below are stored in `this.options`.
    // e.g. (says that our plugin was registered as `_plugin`)
    //  $(target)._plugin({ /* parameters */ })
    _create: function () {
      const elem = this.element;
      const options = this.options;
    },
  });
});
