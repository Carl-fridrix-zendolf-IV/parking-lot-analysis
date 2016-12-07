import { BetssonTestPage } from './app.po';

describe('betsson-test App', function() {
  let page: BetssonTestPage;

  beforeEach(() => {
    page = new BetssonTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
