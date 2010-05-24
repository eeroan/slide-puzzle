JSpec.describe('slide-puzzle', function() {
  before_each(function() {
    ctx = $('#board');
    ctx.empty();
    ctx.slidePuzzle({image:'../../main/Koala.jpg', split:3});
  });

  describe('when initializing', function() {
    it('container is visible', function() {
      expect(ctx).to(be_visible);
    });

    it('game has right amount of pieces', function() {
      expect(ctx.find('.box')).to(have_length, 8);
    });
  });
});