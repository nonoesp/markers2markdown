const fs = require('fs');
const parse = require('csv-parse');

// Path to your input CSV file
const inputPath = 'data/markers.csv';
// Path to your output Markdown notes file
const outputPath = 'bin/notes.md';
// Comes from Adobe Audition? (.i.e., CSV with \t separations)
const isSeparatedByTabs = true;
// Set title to bold?
const isTitleBold = false;
// Sentence ends (that do not need an ending point)
const sentenceEnds = ['"', '\'', '?', '!', '.', '>', ':', '—'];

fs.readFile(inputPath, 'utf8', function(err, data) {
    if (err) throw err;

    if (isSeparatedByTabs) {
        data = data
            .split(',').join('(comma)')
            .split('"').join('(open-quote)')
            .split('\t').join(',');
    }

    parse(data, {}, (err, parsed) => {
        let notes = [];
        for (let i = 1; i < parsed.length; i++) {
            let time = parsed[i][1].split('.')[0];
            let title = parsed[i][0];
            title = title.split('(comma)').join(',')
                .split('(open-quote)').join('"');
            const titleLast = title.split('').reverse()[0];

            // Description
            let description = parsed[i][5];
            description = description.split('(comma)').join(',')
                .split('(open-quote)').join('"');

            if (description != '' && title != '') {
                if (sentenceEnds.includes(titleLast) == false) {
                    description = ` - ${description}`;
                } else {
                    description = ` ${description}`;
                }
            } else {
                if (sentenceEnds.includes(titleLast) == false && title != '') {
                    title += '.';
                }
            }
            if (isTitleBold && title != '') {
                title = `**${title}**`;
            }
            let text = `- ${title}${description} [${time}]`;
            notes.push(text);
        }
        let outputText = notes.join('\n');

        fs.writeFile(outputPath, outputText, function(err) {
            if (err) throw err;
        });
    });
});