describe('file_name_both', () => {
	it('google 1, should pass', () => {
		browser.url('http://www.google.com');
		return browser.waitUntil(()=>{
			return browser.getUrl().indexOf('google') != -1;
		});
		expect(browser.getUrl().indexOf('google')).above(0);
		expect(browser.getTitle().endsWith('Google'));
	})

	it('google 2, should fail', () => {
		
		expect(Math.floor(Math.random() * 10)%20).to.be.above(10);
	})
})