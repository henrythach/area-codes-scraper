'use strict';

function findAreaCodesOnPage() {
    var areaCodes = {};
    var codesContainers = document.querySelectorAll('.codes_container');
    codesContainers.forEach(function(codesContainer) {
        // Find all the area codes in each codes container
        var anchors = codesContainer.querySelectorAll('a');
        anchors.forEach(function(anchor) {
            var areaCode = anchor.querySelector('b').textContent;
            if (areaCode.length > 1) {
                areaCodes[areaCode] = true;
            }
        });
    });

    return Object.keys(areaCodes);
}

function scrapeAreaCodeTableOnPage() {
    var areaCodes = {};
    var areaCodesTable = document.querySelector('.table.table-striped.table-condensed');
    var areaCodesRows = areaCodesTable.querySelectorAll('tbody > tr');
    areaCodesRows.forEach(function(areaCodesRow) {
        var tableColumns = areaCodesRow.querySelectorAll('td');
        var prefix = tableColumns[0].textContent;
        var city = tableColumns[1].textContent;
        var company = tableColumns[2].textContent;
        var county = tableColumns[3].textContent;
        var usage = tableColumns[4].textContent;
        var introduced = tableColumns[5].textContent;

        if (prefix.length > 1) {
            areaCodes[prefix] = {
                prefix,
                city,
                company,
                county,
                usage,
                introduced
            };
        }
    });

    return areaCodes;
}