'use strict';

goog.module('grrUi.semantic.urnDirectiveTest');

const semanticModule = goog.require('grrUi.semantic.semanticModule');
const testsModule = goog.require('grrUi.tests.testsModule');


describe('urn directive', () => {
  let $compile;
  let $rootScope;
  let grrRoutingService;


  beforeEach(module('/static/angular-components/semantic/urn.html'));
  beforeEach(module(semanticModule.name));
  beforeEach(module(testsModule.name));

  beforeEach(inject(($injector) => {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    grrRoutingService = $injector.get('grrRoutingService');
  }));

  const renderTestTemplate = (value) => {
    $rootScope.value = value;

    const template = '<grr-urn value="value" />';
    const element = $compile(template)($rootScope);
    $rootScope.$apply();

    return element;
  };

  it('does not show anything when value is empty', () => {
    const element = renderTestTemplate(null);
    expect(element.text().trim()).toBe('');
  });

  it('shows plain string if grrRoutingService can\'t convert URN', () => {
    spyOn(grrUi.routing, 'aff4UrnToUrl').and.returnValue(undefined);

    const element = renderTestTemplate('aff4:/foo/bar');
    expect(element.text().trim()).toBe('aff4:/foo/bar');
    expect(element.find('a').length).toBe(0);
  });

  it('shows a link if grrRoutingService can convert URN', () => {
    spyOn(grrUi.routing, 'aff4UrnToUrl').and.returnValue({
      state: 'someState',
      params: {},
    });
    spyOn(grrRoutingService, 'href').and.returnValue('/some/real/link');

    const element =
        renderTestTemplate('aff4:/C.0001000200030004/fs/os/foo/bar');
    expect(element.find('a').text().trim()).toBe(
        'aff4:/C.0001000200030004/fs/os/foo/bar');
    expect(element.find('a').attr('href')).toBe(
        '/some/real/link');
  });
});


exports = {};
