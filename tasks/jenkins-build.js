#!/usr/bin/env node
var exec = require('child_process').execSync;
var _ = require('lodash');
var fs = require('fs');

var Time = require('time-diff');
var time = new Time();

// create a start time for the entire script 
time.start('jenkins-build');

var config = require('../conf/config.json')
const originalConfigWdio = require('../wdio.config.json');

const originalTestSpec = originalConfigWdio.specs;

var buildPayload = {
    totalTestFailures: {},
    failureReasons: {}
};
var jenkinsBuildConfig = config.tasks.jenkins_build || null;
if (!jenkinsBuildConfig || !jenkinsBuildConfig.maximum_retries) {
    console.error('something is wrong with the json config file for jenkins_build');
    throw new Error('something is wrong with the json config file for jenkins_build');
}
else {
    //cleaning everything, removing all folders / files that were previous generated
    exec(`npm run clean`);
    exec('mkdir builds_output');
    var retryAttempts = 1;
    var testsPassed = false;
    var testsEqualFailPayload = false;
    //validar se no spec fornecido existem arquivos pra rodar, evitando falar que a build passou sem ter rodado algum teste (spec invalido)
    var previousTestFailureList = null;
    while (retryAttempts <= jenkinsBuildConfig.maximum_retries && !testsPassed && !testsEqualFailPayload) {
        var configWdio = require('../wdio.config.json');
        time.start(`build_${retryAttempts}`);
        try {
            //removing last execution custom report
            exec('rm -f custom_report.json');

            //executing tests
            exec(`node node_modules/webdriverio/bin/wdio wdio.conf.js`, { stdio: [process.stdin, process.stdout, process.stderr] })
        }
        catch (err) {
        }
        finally {
            //cleaning mocha awesome report folder
            exec("rm -Rf test_report")

            //making mocha awesome report folder
            exec("mkdir test_report")

            //creating a folder to store build screenshots
            exec("mkdir test_report/screenshots")

            //copying build screenshots to mochawesome report
            exec("cp ./errorShots/* ./test_report/screenshots/ | true") // | true is to avoid erros when there are no screenshots availables

            //generating the report
            exec("marge results/wdiomochawesome.json --reportDir './test_report' --reportTitle 'My Project Results' --showSkipped true --showHooks always --code true --inline true", { stdio: [process.stdin, process.stdout, process.stderr] });

            exec(`mkdir builds_output/run_${retryAttempts}`);
            exec(`cp -r ./test_report/* ./builds_output/run_${retryAttempts}/`);
            exec(`cp -r ./results/* ./builds_output/run_${retryAttempts}/`);
            exec(`cp custom_report.json ./builds_output/run_${retryAttempts}/`);

            var currentReport;
            
            try {
                currentReport = require(`../builds_output/run_${retryAttempts}/custom_report.json`);
            }
            catch (err) {
                currentReport = null;
            }

            
            //comparing test payload to avoid running more times if it fails twice with the same errors
            if (_.isEqual(previousTestFailureList, currentReport.failure_list)) {
                testsEqualFailPayload = true;
                console.log(`test payload from run ${retryAttempts} matchs payload from run ${retryAttempts - 1}, so this run will be aborted`)
            }

            previousTestFailureList = currentReport.failure_list;

            var elapsedTime = time.end(`build_${retryAttempts}`, 's')
            buildPayload[`build_${retryAttempts}`] = {
                elapsedTime: time.end(`build_${retryAttempts}`, 's'),
                failureList: currentReport.failure_list,
                ranTests: currentReport.ran_list,
                passedTests: currentReport.passed_list
            }
            configWdio.specs = [];

            //if something failed change wdio.config.json to run it, otherwise mark build as passed
            if (currentReport.failure_list && currentReport.failure_list.length > 0) {
                currentReport.failure_list.forEach(function (failedTest) {
                    configWdio.specs.push('./tests/' + failedTest.test_spec.split('/tests/')[1]);

                    if (buildPayload.totalTestFailures[failedTest.test_spec]) {
                        buildPayload.totalTestFailures[failedTest.test_spec] = buildPayload.totalTestFailures[failedTest.test_spec] + 1;
                    }
                    else {
                        buildPayload.totalTestFailures[failedTest.test_spec] = 1;
                    }


                    if (!buildPayload.failureReasons[failedTest.test_spec]) {
                        buildPayload.failureReasons[failedTest.test_spec] = [];
                    }
                    
                    buildPayload.failureReasons[failedTest.test_spec].push({
                        message: failedTest.message,
                        step: failedTest.step
                    });

                })
            }
            else {
                testsPassed = true;
            }


            //creating a new wdio.config.json with just the failing tests
            exec(`echo '${JSON.stringify(configWdio, null, 2)}' > wdio.config.json`)
            retryAttempts++;
        }
    }

    //this will be the last provided build payload
    
    var customReport = require('../custom_report.json') || null;
    if (!customReport) {
        console.log('something went wrong customReport shouldnt be null')
        throw new Error('Invalid customReport, please check test specs and available payloads to identify what went wrong')
    }
    var message = '';
    var buildPassed = false;
    
    /*passed > 0 will make sure that a build with a valid test spec ran with at least one test with at least one it passing
    otherwise it would be a passing build with 0 passed tests, 0 failures and N skipped tests*/
    if (customReport.failure_list.length > 0) {
        message = 'Some tests failed, look at the payload / report for more information';
    }
    else if (customReport.failure_list.length == 0 && customReport.passed_list.length == 0) {
        message = 'Nothing failed but nothing passed so this build will be tagged as failure';
    }
    else if (customReport.failure_list.length == 0 && customReport.passed_list.length > 0) {
        message = 'Build passed';
        buildPassed = true;
    }

    var status = buildPassed == true ? "Passed" : "Failed";

    buildPayload.message = message;
    buildPayload.status = status;
    buildPayload.totalRetrys = retryAttempts - 1;
    buildPayload.failedTwiceWithSamePayload = testsEqualFailPayload;


    console.log(JSON.stringify(buildPayload, null, 2));
    console.log(`Message:            ${message}`);
    console.log(`Build status:       ${status}`)
    console.log(`Total retries:      ${retryAttempts - 1}`)
    console.log(`Total Elapsed time: ${time.end('jenkins-build', 's')}`)

    //returning wdio.config to original state (what it was before starting to run tests)
    originalConfigWdio.specs = originalTestSpec;
    exec(`echo '${JSON.stringify(originalConfigWdio, null, 2)}' > wdio.config.json`)
    exec(`echo '${JSON.stringify(buildPayload, null, 2)}' > build_summary.json`)
}

function removeProp(obj, propName) {

    for (var p in obj) {

        if (obj.hasOwnProperty(p)) {

            if (p == propName) {
                delete obj[p];

            } else if (typeof obj[p] == 'object') {
                removeProp(obj[p], propName);
            }
        }
    }
    return obj;
}