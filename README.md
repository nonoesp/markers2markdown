# markers2markdown
Parse Adobe Audition CSV wave markers to a Markdown list of episode notes.

### Create and export Adobe Audition Markers

- Add markers to your wave file or Multitrack session.
- In the `Markers` panel, select all your markers.
- Right click and choose `Export Selected Markers to CSV`.
- Save your CSV file to the `data/` folder and edit the `inputPath` of `index.js`.

### Clone this repository

	git clone https://github.com/nonoesp/markers2markdown
	cd markers2markdown

### Parse your markers to Markdown

	node index.js