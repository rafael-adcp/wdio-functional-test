this project is the main skeleton of a functional test repo  

together with it, you'll find a node script that will do all the magic for you (or at least will try to...)

```
tasks > jenkins-build.js
```

this script will basically attempt to run a given suit of N tests, and assuming that some tests passed,
it will keep retrying with just the failing ones.

So first run will be `N`, second run will be `N - {tests that passed}`, ... until everything passed or until it fail twice with the same error payload. (its possible to customize it to check all previous failure reasons for that test to avoiding failing the same step more then one time)

Foreach build, it will generate a `mochawesome` report which will be located under `build_output > run_${retryNumber}`, which
is a nice way to see the output of your entire suit of tests, and when tests fails, it will show the stack + a print, check here for some prints (https://github.com/adamgruber/mochawesome/blob/master/docs/marge-report-1.0.1.png)

![Mocha Awesome pics](https://github.com/adamgruber/mochawesome/blob/master/docs/marge-report-menu-1.0.1.png)


By the end of the script it will also dump a summary containing:

a count of each failing tests  
a list foreach failing test with the failing message / step   
foreach build, it will show, elapsed time, tests that failed, tests that ran and tests that passed
and by the end, the message saying what happend, number of retries and how much time the entire script

EG:
```
{
  "totalTestFailures": {
    "/wdio-functional-test/tests/failing.js": 6,
    "/wdio-functional-test/tests/flaky.js": 6
  },
  "failureReasons": {
    "/wdio-functional-test/tests/failing.js": [
      {
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      }
    ],
    "/wdio-functional-test/tests/flaky.js": [
      {
        "message": "expected 5 to be above 10",
        "step": "google 2, should fail"
      },
      {
        "message": "expected 3 to be above 10",
        "step": "google 2, should fail"
      },
      {
        "message": "expected 4 to be above 10",
        "step": "google 2, should fail"
      },
      {
        "message": "expected 2 to be above 10",
        "step": "google 2, should fail"
      },
      {
        "message": "expected 7 to be above 10",
        "step": "google 2, should fail"
      },
      {
        "message": "expected 7 to be above 10",
        "step": "google 2, should fail"
      }
    ]
  },
  "build_1": {
    "elapsedTime": "12s",
    "failureList": [
      {
        "test_spec": "/wdio-functional-test/tests/failing.js",
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "test_spec": "/wdio-functional-test/tests/flaky.js",
        "message": "expected 5 to be above 10",
        "step": "google 2, should fail"
      }
    ],
    "ranTests": [
      "/wdio-functional-test/tests/failing.js",
      "/wdio-functional-test/tests/skipped.js",
      "/wdio-functional-test/tests/it_skipped.js",
      "/wdio-functional-test/tests/passing.js",
      "/wdio-functional-test/tests/flaky.js",
      "/wdio-functional-test/tests/flaky.js"
    ],
    "passedTests": [
      "/wdio-functional-test/tests/passing.js",
      "/wdio-functional-test/tests/flaky.js"
    ]
  },
  "build_2": {
    "elapsedTime": "11s",
    "failureList": [
      {
        "test_spec": "/wdio-functional-test/tests/failing.js",
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "test_spec": "/wdio-functional-test/tests/flaky.js",
        "message": "expected 3 to be above 10",
        "step": "google 2, should fail"
      }
    ],
    "ranTests": [
      "/wdio-functional-test/tests/failing.js",
      "/wdio-functional-test/tests/flaky.js",
      "/wdio-functional-test/tests/flaky.js"
    ],
    "passedTests": [
      "/wdio-functional-test/tests/flaky.js"
    ]
  },
  "build_3": {
    "elapsedTime": "10s",
    "failureList": [
      {
        "test_spec": "/wdio-functional-test/tests/failing.js",
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "test_spec": "/wdio-functional-test/tests/flaky.js",
        "message": "expected 4 to be above 10",
        "step": "google 2, should fail"
      }
    ],
    "ranTests": [
      "/wdio-functional-test/tests/failing.js",
      "/wdio-functional-test/tests/flaky.js",
      "/wdio-functional-test/tests/flaky.js"
    ],
    "passedTests": [
      "/wdio-functional-test/tests/flaky.js"
    ]
  },
  "build_4": {
    "elapsedTime": "10s",
    "failureList": [
      {
        "test_spec": "/wdio-functional-test/tests/failing.js",
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "test_spec": "/wdio-functional-test/tests/flaky.js",
        "message": "expected 2 to be above 10",
        "step": "google 2, should fail"
      }
    ],
    "ranTests": [
      "/wdio-functional-test/tests/failing.js",
      "/wdio-functional-test/tests/flaky.js",
      "/wdio-functional-test/tests/flaky.js"
    ],
    "passedTests": [
      "/wdio-functional-test/tests/flaky.js"
    ]
  },
  "build_5": {
    "elapsedTime": "12s",
    "failureList": [
      {
        "test_spec": "/wdio-functional-test/tests/failing.js",
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "test_spec": "/wdio-functional-test/tests/flaky.js",
        "message": "expected 7 to be above 10",
        "step": "google 2, should fail"
      }
    ],
    "ranTests": [
      "/wdio-functional-test/tests/failing.js",
      "/wdio-functional-test/tests/flaky.js",
      "/wdio-functional-test/tests/flaky.js"
    ],
    "passedTests": [
      "/wdio-functional-test/tests/flaky.js"
    ]
  },
  "build_6": {
    "elapsedTime": "11s",
    "failureList": [
      {
        "test_spec": "/wdio-functional-test/tests/failing.js",
        "message": "expected 1 to be above 3",
        "step": "something 1,  should fail"
      },
      {
        "test_spec": "/wdio-functional-test/tests/flaky.js",
        "message": "expected 7 to be above 10",
        "step": "google 2, should fail"
      }
    ],
    "ranTests": [
      "/wdio-functional-test/tests/failing.js",
      "/wdio-functional-test/tests/flaky.js",
      "/wdio-functional-test/tests/flaky.js"
    ],
    "passedTests": [
      "/wdio-functional-test/tests/flaky.js"
    ]
  },
  "message": "Some tests failed, look at the payload / report for more information",
  "status": "Failed",
  "totalRetrys": 6,
  "failedTwiceWithSamePayload": true
}

```