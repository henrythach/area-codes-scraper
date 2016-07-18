'use strict';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var log = fs.createWriteStream('results.csv');

var URL = 'http://www.allareacodes.com/';

// Get all the area codes
request(URL, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        var $ = cheerio.load(body);
        var areaCodes = findAreaCodesOnPage($);
        crawlTheSite(areaCodes, log);
    }
});

function findAreaCodesOnPage($) {
    var areaCodes = {};
    $('.codes_container b').each(function (i, element) {
        var areaCode = $(element).text();
        if (areaCode.length > 1) {
            areaCodes[areaCode] = true;
        }
    });
    return Object.keys(areaCodes);
}

function crawlTheSite(areaCodes) {
    areaCodes.forEach(function (areaCode) {
        var theUrl = URL + areaCode;
        console.log('Scraping ' + theUrl);
        request(theUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var $ = cheerio.load(body);
                var areaCodes = scrapeAreaCodeTableOnPage($)
                log.write(areaCodes.join('\n').toString() + '\n');
            }
        });
    });
}

function scrapeAreaCodeTableOnPage($) {
    var areaCodes = [];
    var areaCodesRows = $('.table.table-striped.table-condensed tbody > tr');
    areaCodesRows.each(function(i, areaCodesRow) {
        var tableColumns = $(areaCodesRow).children('td');
        var prefix = tableColumns.eq(0).text();
        var city = tableColumns.eq(1).text();
        var company = tableColumns.eq(2).text();
        var county = tableColumns.eq(3).text();
        var usage = tableColumns.eq(4).text();
        var introduced = tableColumns.eq(5).text();

        if (prefix.length > 1) {
            var row = [prefix, city, company, county, usage, introduced].map(function (column) {
                return '"' + column + '"';
            });
            areaCodes.push(row);
        }
    });
    return areaCodes;
}