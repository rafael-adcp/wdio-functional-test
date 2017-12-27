var customReporter = require('./reporter/customReporter');

var wdioConfigJson = require('./wdio.config.json')

wdioConfigJson.reporters.push(customReporter);

wdioConfigJson.before = function () {
    const chai = require("chai");
    const path = require("path");

    global.expect = chai.expect;
    chai.Should();
    chai.config.includeStack = true;
}

exports.config = wdioConfigJson;
