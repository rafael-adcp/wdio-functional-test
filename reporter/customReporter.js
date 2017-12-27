//http://webdriver.io/guide/reporters/customreporter.html

var util = require('util'),
    events = require('events'),
    fs = require('fs');


var CustomReporter = function (baseReporter, config, options) {
    var customReporter = {
        failure_list: [],
        ran_list: [],
        passed_list: []
    }
    this.on('start', function (options) {
    });

    this.on('end', function (options) {
        try {
            fs.writeFileSync('custom_report.json', JSON.stringify(customReporter, null, 2));
        }
        catch(err){
            console.lor(err);
            throw err;
        }
    });

    this.on('suite:start', function (options) {
    });

    this.on('suite:end', function (options) {
    });

    this.on('test:start', function (options) {
    });

    this.on('test:end', function (options) {
        customReporter.ran_list.push(options.file);
    });

    this.on('hook:start', function (options) {
    });

    this.on('hook:end', function (options) {
    });

    this.on('test:pass', function (options) {
        customReporter.passed_list.push(options.file)
    });

    this.on('test:pending', function (options) {
    });

    this.on('test:fail', function (options) {
        customReporter.failure_list.push({
            test_spec: options.file,
            message: options.err.message,
            step: options.title
        })
    });
};

CustomReporter.reporterName = 'CustomReporter';

/**
 * Inherit from EventEmitter
 */
util.inherits(CustomReporter, events.EventEmitter);

/**
 * Expose Custom Reporter
 */
exports = module.exports = CustomReporter;