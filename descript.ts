const fs = require('fs');
const path = require('path');

const argv = require('yargs')
            .option('path', {
                alias: 'p',
                type: 'string',
                description: 'Path to Descript-exported file containing markers.',
                default: null
            })
            .option('video-id', {
                alias: 'v',
                type: 'string',
                description: 'YouTube video ID.',
                default: 'VIDEO_ID'
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

    const markers = contents
    .split('\n')
    .filter((s: string) => s.substring(0, 2) == '##')
    .map((marker: string) => {
        return marker
        .split(`[00:`).join(`[`)
        .split(`## [`).join(`[`)
    })
    .map((marker: string) => {
        const parts = marker.split(` `);
        let timestamp = (parts.shift() as string)
        .split(`[`).join(``)
        .split(`]`).join(``);
        if (timestamp.length == 2) {
            timestamp = `00:${timestamp}`
        }
        const title = parts.join(` `);
        return { timestamp, title };
    })
    return markers;
};

interface Marker {
    timestamp: string;
    title: string;
}

const timestamp2Seconds = (time: string) => {
    const parts: number[] = time.split(':').map(s => parseInt(s));
    const units = [3600, 60, 1];
    let seconds = 0;
    while(parts.length > 0) {
        const amount = parts.pop() ?? 0;
        const unit = units.pop() ?? 0;
        seconds += amount * unit;
    }
    return seconds;
}

const chaptersFormatter = (markers: Marker[]) =>
    markers.map((marker: Marker) =>
        `${marker.timestamp} - ${marker.title.replace(`&amp;`, `&`)}`
    );

const outlineFormatter = (markers: Marker[]) =>
    markers.map((marker: Marker) =>
        `- ${marker.title.replace(`&amp;`, `&`)}. [${marker.timestamp}]`
        .split(`?.`).join(`?`)
        .split(`!.`).join(`!`)
        .split(`".`).join(`"`)
        .split(`'.`).join(`'`)
    )

const linkedChaptersFormatter = (markers: Marker[], videoId: string) =>
markers.map((marker: Marker, index: number) =>
    `[\`${marker.timestamp}\`]`+
    `(https://youtu.be/${videoId}?t=${timestamp2Seconds(marker.timestamp)})`+
    ` · ${marker.title.replace(`&amp;`, `&`)}${index < markers.length - 1 ? '\\' : ''}`
);

const linkedChaptersFormatterV2 = (markers: Marker[], videoId: string) =>
markers.map((marker: Marker) =>
    `- [${marker.timestamp} `+
    `${marker.title.replace(`&amp;`, `&`)}]`+
    `(https://youtu.be/${videoId}?t=${timestamp2Seconds(marker.timestamp)})`
);

const plainLinkedChaptersFormatter = (markers: Marker[], videoId: string) =>
markers.map((marker: Marker) =>
    `- \`${marker.timestamp}\` `+
    `${marker.title.replace(`&amp;`, `&`)}`+
    ` → https://youtu.be/${videoId}?t=${timestamp2Seconds(marker.timestamp)}`
);

// const chapters = markers.join(`\n`);
// fs.writeFileSync(`${filePath}${chaptersSuffix}`, chapters, `utf-8`);

// console.log(`\n## ${path.basename(filePath)}\n`);
// console.log(chapters);

const exportMarkers = (markerList: Marker[][], paths: string[], videoId: string) => {

    paths.forEach((filePath: string, index: number) => {

        const markers = markerList[index];

        // Paths
        const chaptersPath = `${filePath}${chaptersSuffix}`;
        // const outlinePath = `${filePath}${outlineSuffix}`;

        // Contents
        const chapters = chaptersFormatter(markers).join(`\n`);
        const chaptersLinked = linkedChaptersFormatter(markers, videoId).join(`\n`);
        const chaptersPlainLinked = plainLinkedChaptersFormatter(markers, videoId).join(`\n`);
        // const outline = outlineFormatter(markers).join(`\n`);

        // Save
        fs.writeFileSync(chaptersPath, chapters, `utf-8`);
        // fs.writeFileSync(outlinePath, outline, `utf-8`);

        console.log(`\n## ${path.basename(filePath).replace(`.txt`, ``)}\n`);
        console.log(`**Chapters**`);
        console.log(``);
        console.log(chaptersPlainLinked);
        console.log(``);
        console.log(`## Chapters - Linked`);
        console.log(``);
        console.log(chaptersLinked);
        console.log(``);
        console.log(`## Chapters`);
        console.log(``);
        console.log(chapters);
        // console.log(`\n## Outline\n`);
        // console.log(outline);

    });

}

let paths = [];
const videoId = argv['video-id'];
if (argv.path) {
    paths.push(argv.path);
} else {
    paths = findFilesByExtensionInDir('./data', 'txt');
}

const markers = paths.map((path: string) => descriptTextToMarkers(path));

exportMarkers(markers, paths, videoId);