# PaintJS

```html
<canvas id="my-canvas"></canvas>
```

to initialize PaintJS

```js
/* new PaintJS(target, width, height) */
var paint = new PaintJS('#my-canvas', 500, 500);
```

### Methods

| Name | Description |
| ------ | ------ |
| setTarget(target, width, height) | constructor |
| width() / width(500) | get/set width of canvas |
| height() / height(500) | get/set height of canvas |
| color('#000000') | color brush |
| size(10) | size brush |
| setBackground(url) | add css background and set width/height of canvas  |
| undo() | delete last draw |
| clear() | delete all draw |
