JSpec.describe('slide-puzzle', function() {
  before_each(function() {
    ctx = $('<div>').attr('id','board');
    ctx.slidePuzzle({image:'../../main/Koala.jpg', split:3, width:600, height:450});
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