const fs = require('fs');
const parse = require('csv-parse');

fs.readFile('markers.csv', 'utf8', function(err, data) {
    if (err) throw err;
    //console.log(data);
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
        let output = notes.join('\n');

        fs.writeFile('notes.md', output, function(err) {
            if (err) throw err;
            console.log('Replaced!');
        });
    });
});