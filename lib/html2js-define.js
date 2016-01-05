var util = require('util');

var TEMPLATE = 'define([\'angular\'], function(angular) { angular.module(\'%s\', []).run([\'$templateCache\', function($templateCache) {\n' +
    '  $templateCache.put(\'%s\',\n    \'%s\');\n' +
    '}]);});\n';

var escapeContent = function(content) {
  return content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
};

var createHtml2JsPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.html2js');
  var moduleName = config.moduleName;
  var stripPrefix = new RegExp('^' + (config.stripPrefix || ''));
  var prependPrefix = config.prependPrefix || '';
  var stripSuffix = new RegExp((config.stripSuffix || '') + '$');
  var cacheIdFromPath = config && config.cacheIdFromPath || function(filepath) {
    return prependPrefix + filepath.replace(stripPrefix, '').replace(stripSuffix, '');
  };

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var htmlPath = cacheIdFromPath(file.originalPath.replace(basePath + '/', ''));

    if (!/\.js$/.test(file.path)) {
      file.path = file.path + '.js';
    }

    done(util.format(TEMPLATE, htmlPath, htmlPath, escapeContent(content)));
  };
};

createHtml2JsPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngHtml2JsDefinePreprocessor'];

module.exports = createHtml2JsPreprocessor;
