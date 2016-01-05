# karma-ng-html2js-define-preprocessor [![Build Status](https://travis-ci.org/aaronallport/karma-ng-html2js-define-preprocessor.svg?branch=master)](https://travis-ci.org/aaronallport/karma-ng-html2js-define-preprocessor)

> Preprocessor for converting HTML files to [AngularJS 1.x](http://angularjs.org/) templates, wrapped in `define` calls for use with RequireJS/AMD projects.

*Note:* If you are looking for a general preprocessor that is not tied to Angular, check out [karma-html2js-preprocessor](https://github.com/karma-runner/karma-html2js-preprocessor).

*Note:* If you are using Angular 2.x, use [karma-redirect-preprocessor](https://github.com/sjelin/karma-redirect-preprocessor).

## Installation

The easiest way is to keep `karma-ng-html2js-define-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-ng-html2js-define-preprocessor": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-ng-html2js-define-preprocessor --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.html': ['ng-html2js-define']
    },

    files: [
      '*.js',
      '*.html',
      '*.html.ext',
      // if you wanna load template files in nested directories, you must use this
      '**/*.html'
    ],

    // if you have defined plugins explicitly, add karma-ng-html2js-define-preprocessor
    // plugins: [
    //     <your plugins>
    //     'karma-ng-html2js-define-preprocessor',
    // ]

    ngHtml2JsDefinePreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/',
      stripSuffix: '.ext',
      // prepend this to the
      prependPrefix: 'served/',

      // or define a custom transform function
      // - cacheId returned is used to load template
      //   module(cacheId) will return template at filepath
      cacheIdFromPath: function(filepath) {
        // example strips 'public/' from anywhere in the path
        // module(app/templates/template.html) => app/public/templates/template.html
        var cacheId = filepath.strip('public/', '');
        return cacheId;
      },

      // - setting this option will create only a single module that contains templates
      //   from all the files, so you can load them all with module('foo')
      // - you may provide a function(htmlPath, originalPath) instead of a string
      //   if you'd like to generate modules dynamically
      //   htmlPath is a originalPath stripped and/or prepended
      //   with all provided suffixes and prefixes
      moduleName: 'foo'
    }
  });
};
```

### Multiple module names

Use *function* if more than one module that contains templates is required.

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // ...

    ngHtml2JsDefinePreprocessor: {
      // ...

      moduleName: function (htmlPath, originalPath) {
        return htmlPath.split('/')[0];
      }
    }
  });
};
```

If only some of the templates should be placed in the modules,
return `''`, `null` or `undefined` for those which should not.

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // ...

    ngHtml2JsDefinePreprocessor: {
      // ...

      moduleName: function (htmlPath, originalPath) {
        var module = htmlPath.split('/')[0];
        return module !== 'tpl' ? module : null;
      }
    }
  });
};
```



## How does it work ?

This preprocessor converts HTML files into JS strings and generates Angular modules, wrapped in `define` calls. These modules, when loaded, puts these HTML files into the `$templateCache` and therefore Angular won't try to fetch them from the server.

For instance this `template.html`...
```html
<div>something</div>
```
... will be served as `template.html.js`:
```js
define(['angular'], function(angular) {
  angular.module('template.html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template.html', '<div>something</div>');
  }]);
});
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
