describe('slide-puzzle', function() {
  before_each(function() {
    dom = fixture('slide-puzzle');
    container = $(dom).find('#board');
  });

  describe('when initializing', function() {
    it('correct amount of boxes are rendered', function() {
      expect(dom.length).to(equal,523)
      expect(container).to(be_visible);
    });
  });
});