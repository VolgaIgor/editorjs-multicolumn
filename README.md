# Multicolumn Block Tool for Editor.js
Adds the ability to make 2 and 3 column content.

### Preview
![Preview image](https://raw.githubusercontent.com/VolgaIgor/editorjs-multicolumn/refs/heads/main/asset/screenshot.png)

## Installation
### Install via NPM
Get the package

```shell
$ npm i editorjs-multicolumn
```

Include module at your application

```javascript
import Multicolumn from 'editorjs-multicolumn';
```

### Load from CDN

You can load a specific version of the package from jsDelivr CDN.

Require this script on a page with Editor.js.

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-multicolumn"></script>
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/editorjs-multicolumn.bundle.js` file to your page.

## Usage
```javascript
const editor = EditorJS({
  // ...
  tools: {
    // ...
    multicolumn: {
      class: Multicolumn,
      config: {
        editorLibrary: EditorJS,
        editorTools: {
          header: {
            class: Header,
            inlineToolbar: false,
            config: {
              placeholder: 'Header'
            }
          },
          checklist: Checklist,
          delimiter: Delimiter,
          // ...
        }
      }
    },
  }
  // ...
});
```

### Config Params

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| editorLibrary | `object`   | EditorJS library |
| editorTools   | `object[]` | Configuration of editor blocks to be available in multicolumn |

## Output data

This Tool returns `data` with following format

| Field          | Type       | Description                      |
| -------------- | ---------  | -------------------------------- |
| columns        | `integer`  | Number of columns (`2` of `3`)   |
| content        | `object[]` | Array of saved column data       |