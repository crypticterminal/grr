'use strict';

goog.provide('grrUi.appController.appControllerModule');

goog.require('grrUi.acl.aclModule');
goog.require('grrUi.artifact.artifactModule');
goog.require('grrUi.client.clientModule');
goog.require('grrUi.config.configModule');
goog.require('grrUi.core.coreModule');
goog.require('grrUi.cron.cronModule');
goog.require('grrUi.docs.docsModule');
goog.require('grrUi.flow.flowModule');
goog.require('grrUi.forms.formsModule');
goog.require('grrUi.hunt.huntModule');
/**
 * grrUi.local.localModule is empty by default and can be used for
 * deployment-specific plugins implementation.
 */
goog.require('grrUi.local.localModule');
goog.require('grrUi.outputPlugins.outputPluginsModule');
goog.require('grrUi.routing.routingModule');
goog.require('grrUi.semantic.semanticModule');
goog.require('grrUi.sidebar.sidebarModule');
goog.require('grrUi.stats.statsModule');
/**
 * If GRR is running with AdminUI.use_precompiled_js = True, then
 * grrUi.templates is a special autogenerated module containing all the
 * directives templates. If GRR is running with
 * AdminUI.use_precompiled_js = False, then this module is empty.
 */
goog.require('grrUi.templates.templatesModule');
goog.require('grrUi.user.userModule');


/**
 * Main GRR UI application module.
 */
grrUi.appController.appControllerModule = angular.module('grrUi.appController',
                                            [grrUi.acl.aclModule.name,
                                             grrUi.artifact.artifactModule.name,
                                             grrUi.client.clientModule.name,
                                             grrUi.config.configModule.name,
                                             grrUi.core.coreModule.name,
                                             grrUi.cron.cronModule.name,
                                             grrUi.docs.docsModule.name,
                                             grrUi.flow.flowModule.name,
                                             grrUi.forms.formsModule.name,
                                             grrUi.hunt.huntModule.name,
                                             grrUi.local.localModule.name,
                                             grrUi.outputPlugins.outputPluginsModule.name,
                                             grrUi.routing.routingModule.name,
                                             grrUi.semantic.semanticModule.name,
                                             grrUi.stats.statsModule.name,
                                             grrUi.sidebar.sidebarModule.name,
                                             grrUi.templates.templatesModule.name,
                                             grrUi.user.userModule.name]);

grrUi.appController.appControllerModule.config(function($httpProvider, $interpolateProvider,
                                           $qProvider, $locationProvider,
                                           $rootScopeProvider) {
  // Set templating braces to be '{$' and '$}' to avoid conflicts with Django
  // templates.
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');

  // Ensuring that Django plays nicely with Angular-initiated requests
  // (see http://www.daveoncode.com/2013/10/17/how-to-
  // make-angularjs-and-django-play-nice-together/).
  $httpProvider.defaults.headers.post[
    'Content-Type'] = 'application/x-www-form-urlencoded';

  // Erroring on unhandled rejection is a behavior added in Angular 1.6, our
  // code is written without this check in mind.
  $qProvider.errorOnUnhandledRejections(false);

  // Setting this explicitly due to Angular's behavior change between
  // versions 1.5 and 1.6.
  $locationProvider.hashPrefix('');

  // We use recursive data model generation when rendering forms. Therefore
  // have to increase the digestTtl limit to 50.
  $rootScopeProvider.digestTtl(50);
});

grrUi.appController.appControllerModule.run(function($injector, $http, $cookies,
                                        grrFirebaseService,
                                        grrReflectionService) {
  // Ensure CSRF token is in place for Angular-initiated HTTP requests.
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
  $http.defaults.headers.delete = $http.defaults.headers.patch = {
    'X-CSRFToken': $cookies.get('csrftoken')
  };

  grrFirebaseService.setupIfNeeded();

  // Call reflection service as soon as possible in the app lifetime to cache
  // the values. "ACLToken" is picked up here as an arbitrary name.
  // grrReflectionService loads all RDFValues definitions on first request
  // and then caches them.
  grrReflectionService.getRDFValueDescriptor('ACLToken');
});


/**
 * Hardcoding jsTree themes folder so that it works correctly when used
 * from a JS bundle file.
 */
$['jstree']['_themes'] = '/static/third-party/jstree/themes/';


/**
 * TODO(user): Remove when dependency on jQuery-migrate is removed.
 */
jQuery['migrateMute'] = true;


grrUi.appController.appControllerModule.controller('GrrUiAppController', function() {});
