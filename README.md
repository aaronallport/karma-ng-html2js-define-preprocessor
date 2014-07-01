# karma-ng-html2js-define-preprocessor [![Build Status](https://travis-ci.org/karma-runner/karma-ng-html2js-define-preprocessor.png?branch=master)](https://travis-ci.org/karma-runner/karma-ng-html2js-define-preprocessor)

> Preprocessor for converting HTML files to [AngularJS](http://angularjs.org/) templates.

*Note:* If you are looking for a general preprocessor that is not tight to Angular, check out [karma-html2js-preprocessor](https://github.com/karma-runner/karma-html2js-preprocessor).

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
      '**/*.html': ['ng-html2js']
    },

    files: [
      '*.js',
      '*.html',
      // if you wanna load template files in nested directories, you must use this
      '**/*.html'
    ],

    ngHtml2JsDefinePreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/',
      // prepend this to the
      prependPrefix: 'served/',

      // or define a custom transform function
      cacheIdFromPath: function(filepath) {
        return cacheId;
      },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'foo'
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
  angular.module('template.html', []).config(function($templateCache) {
    $templateCache.put('template.html', '<div>something</div>');
  });
});
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
