'use strict';

goog.module('grrUi.semantic.rekall.rekallRegistryServiceTest');

const RekallRegistryService = goog.require('grrUi.semantic.rekall.rekallRegistry.RekallRegistryService');
const rekallModule = goog.require('grrUi.semantic.rekall.rekallModule');


describe('Rekall registry', () => {
  let grrRekallDirectivesRegistryService;
  let testRegistry;


  beforeEach(module(rekallModule.name));
  beforeEach(inject(($injector) => {
    grrRekallDirectivesRegistryService = $injector.get(
        'grrRekallDirectivesRegistryService');

    testRegistry = $injector.instantiate(RekallRegistryService, {});
  }));

  it('finds previously registered directive', () => {
    testRegistry.registerDirective('SomeType', Object);
    const foundDirective = testRegistry.findDirectiveForMro('SomeType');
    expect(foundDirective).toBe(Object);
  });

  it('returns undefined when searching for not registered directive', () => {
    const foundDirective = testRegistry.findDirectiveForMro('SomeType');
    expect(foundDirective).toBeUndefined();
  });

  it('returns more specific directive when multiple directives match', () => {
    const directive1 = Object();
    const directive2 = Object();

    testRegistry.registerDirective('SomeChildType', directive1);
    testRegistry.registerDirective('SomeParentType', directive2);

    const foundDirective =
        testRegistry.findDirectiveForMro('SomeChildType:SomeParentType');
    expect(foundDirective).toBe(directive1);
  });
});


exports = {};
