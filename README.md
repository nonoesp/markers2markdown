# markers2markdown
Parse Adobe Audition CSV wave markers to a Markdown list of episode notes.

<img src="img/2018-11-26.png">

### Create and export Adobe Audition Markers

- Add markers to your wave file or Multitrack session.
- In the `Markers` panel, select all your markers.
- Right click and choose `Export Selected Markers to CSV`.
- Save your CSV file to the `data/` folder and edit the `inputPath` of `index.js`.

If you `Name` and `Description` fields contain commas and double quotes, replace them in the CSV file to `(comma)` and `(opening-quotes)`, respectively, to avoid parsing errors.

### Clone this repository

```bash
git clone https://github.com/nonoesp/markers2markdown
cd markers2markdown
```

### Parse your markers to Markdown

```bash
node index.js
```

### Instant parse

```bash
bash loop.sh
```

### License

Released under the [MIT](https://github.com/nonoesp/markers2markdown/blob/master/LICENSE) license.

## Author

Hi. I'm [Nono Martínez Alonso](https://nono.ma/about) (Nono.MA), a computational designer with a penchant for simplicity.

I host [Getting Simple](https://gettingsimple.com)—a podcast about how you can live a meaningful, creative, simple life—[sketch](https://sketch.nono.ma) things that call my attention, and [write](https://gettingsimple.com/writing) about enjoying a slower life.

If you find this code useful in any way, reach out on Twitter at [@nonoesp](https://twitter.com/nonoesp). Cheers!
