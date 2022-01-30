const fs = require('fs');
const path = require('path');

const argv = require('yargs')
            .option('path', {
                alias: 'p',
                type: 'string',
                description: 'Path to Descript-exported file containing markers.',
                default: null
            })            
            .argv;

const chaptersSuffix = `-chapters.txt`;
const outlineSuffix = `-outline.txt`;

const findFilesByExtensionInDir = (dir: string, extension: string) => {

    const files = fs.readdirSync(dir).filter((file: string) => {
        return file.endsWith(`.txt`)
           && !file.endsWith(chaptersSuffix)
           && !file.endsWith(outlineSuffix);
    }).map((file: string) => {
        return path.join(dir, file);
    });

    return files;
};

const descriptTextToMarkers = (filePath: string) => {

    const contents = fs.readFileSync(filePath, { encoding: 'utf-8' });
    let markers = contents.split(`\n---\n`).map((marker: string) => {
        const parts = marker.split(`\n`);
        return parts[parts.length - 1]
        .split(`[00:`).join(``)
        .split(`[`).join(``)
        .split(`]`).join(``)
        ;
    });
    markers.pop();
    markers = markers.map((marker: string) => {
        const parts = marker.split(` `);
        const timestamp = parts.shift();
        const title = parts.join(` `);
        return { timestamp, title };
    })
    return markers;
};

interface Marker {
    timestamp: string;
    title: string;
}

const chaptersFormatter = (markers: Marker[]) =>
    markers.map((marker: Marker) =>
        `${marker.timestamp} ${marker.title.replace(`&amp;`, `&`)}`
    );

const outlineFormatter = (markers: Marker[]) =>
    markers.map((marker: Marker) =>
        `- ${marker.title.replace(`&amp;`, `&`)}. [${marker.timestamp}]`
        .split(`?.`).join(`?`)
        .split(`!.`).join(`!`)
        .split(`".`).join(`"`)
        .split(`'.`).join(`'`)
    )

// const chapters = markers.join(`\n`);
// fs.writeFileSync(`${filePath}${chaptersSuffix}`, chapters, `utf-8`);

// console.log(`\n## ${path.basename(filePath)}\n`);
// console.log(chapters);

const exportMarkers = (markerList: Marker[][], paths: string[]) => {

    paths.forEach((filePath: string, index: number) => {

        const markers = markerList[index];

        // Paths
        const chaptersPath = `${filePath}${chaptersSuffix}`;
        const outlinePath = `${filePath}${outlineSuffix}`;

        // Contents
        const chapters = chaptersFormatter(markers).join(`\n`);
        // const outline = outlineFormatter(markers).join(`\n`);

        // Save
        fs.writeFileSync(chaptersPath, chapters, `utf-8`);
        // fs.writeFileSync(outlinePath, outline, `utf-8`);

        console.log(`\n## ${path.basename(filePath).replace(`.txt`, ``)}\n`);
        console.log(`## Chapters\n`);
        console.log(chapters);
        // console.log(`\n## Outline\n`);
        // console.log(outline);

    });

}

let paths = [];
if (argv.path) {
    paths.push(argv.path);
} else {
    paths = findFilesByExtensionInDir('./data', 'txt');
}

const markers = paths.map((path: string) => descriptTextToMarkers(path));

exportMarkers(markers, paths);