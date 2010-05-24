describe('slide-puzzle', function() {
  before_each(function() {
    dom = $(JSpec.parseXML(fixture('slide-puzzle')));
    container = dom.find('#board');
  });

  describe('when initializing', function() {
    it('container is visible', function() {
      expect(container).to(be_visible);
    });
  });
});