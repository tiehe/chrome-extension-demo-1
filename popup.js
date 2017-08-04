window.onload = function() {
    chrome.tabs.executeScript(
            null,
            {file : "getcontent.js"},
            function() {
                if (chrome.runtime.lastError)
                    $('#message').html(chrome.runtime.lastError.message);
            }
    );
}

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getContent") {
        $('#message').html($('<div>', {id:'results'}));
        var result = parse(request.source);
        $.each(result, function(i, v){
            $('#results').append(v+'<br>');
        });
        return;
    }
});

function parse(flog) {
    var result = {
        'TOKEN': new Array(),
        'SC_B_ACCNUM':new Array(),
        'B_ACCNUM':new Array(),
        'M_ACCNUM':new Array(),
        'AMT':new Array(),
        'CURRENCY':new Array(),
        //'F_ACCNUM':new Array(),
        'TRANSACTION_ID': new Array()
    };
    var rawResult = new Array();

    var lines = flog.split('\n');
    var line, cells, i, j, key;

    for(i = 0;i < lines.length;i++){    // for each line
        line = lines[i].toLowerCase();  // use the lower case to compare
        for(j = 0; j<Object.keys(result).length; j++){  // for each key in "result"
            key = Object.keys(result)[j];

            if(line.startsWith(key.toLowerCase())) {    // if the key is found
                if(rawResult.includes(lines[i]))    // already recorded, then go on to next line
                    continue;

                rawResult.push(lines[i]);
                cells = lines[i].split('\t');   // show the original case
                if(!result[key].includes(cells[1]))
                    result[key].push(cells[1]);   // add the value in the line into the key's result
                break;  // once a key is found, no need to find other keys.
            }
        }
    }
    
    return rawResult;
}