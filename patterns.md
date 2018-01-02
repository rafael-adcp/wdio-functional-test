sanit:
	check the environment
	ensure tests are pointing to dev
	has a valid test spec
	api`s are up and running (call api/status and confirm ready:1/ connection before test starts

smoke:
	use url navigation to reach apps and confirm that they are there up and running

navigation tests:
	use ui to reach apps, to ensure the workflow to reach the app is available

functional:
	test a functionality, to ensure nothing got broken due to latest code changes

page objects:
	action reaction principle, i clicked, i wait for something to be visible
	getter, return an element or a value
	setter with user actions, do something in the ui
	functions groups setters
	
```
get usuario() {
    browser.waitForVisible('blah');
    return browser.getText('blah');
  }

  set usuario(url) {
    browser.click('.blah');
    browser.keys(url);
  }

  appPage.usuario = "user_blah"
  appPage.usuario() // returns: user_blah

```


conf/
	config.json -> credentials

tests/
	/sanity
	/smoke
	/navigation
	/functional

page-objects/
	app1/
	app2/