const fs = require('fs');
const parse = require('csv-parse');

// Path to your input CSV file
const inputPath = 'data/markers.csv';
// Path to your output Markdown notes file
const outputPath = 'bin/notes.md';

fs.readFile(inputPath, 'utf8', function(err, data) {
    if (err) throw err;
    parse(data, {}, (err, parsed) => {
        let notes = [];
        for (let i = 1; i < parsed.length; i++) {
            let title = parsed[i][0];
            let time = parsed[i][1].split('.')[0];
            let description = parsed[i][5];
            if (description != '') {
                description = ` - ${description}`;
            }
            let text = `- ${title}${description} [${time}]`
                .split('(comma)').join(',')
                .split('(opening-quote)').join('"');
            notes.push(text);
        }
        let outputText = notes.join('\n');

        fs.writeFile(outputPath, outputText, function(err) {
            if (err) throw err;
        });
    });
});