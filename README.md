# Dice Box Bundle

A bundled version of [@3d-dice/dice-box](https://github.com/3d-dice/dice-box) with themes for use in Bubble.io plugins.

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the bundle:
```bash
npm run build
```

The build will create:
- `dist/dice-box.bundle.js` - The main bundled JavaScript file
- `dist/assets/themes/` - Theme assets and configurations

## Usage

1. Include the bundle in your HTML:
```html
<script src="path/to/dice-box.bundle.js"></script>
```

2. Initialize DiceBox:
```javascript
const diceBox = new DiceBox({
    origin: 'path/to/assets/themes/',
    theme: 'default',
    scale: 6,
    offscreen: true
});

await diceBox.init();
```

## Available Themes
- default
- blueGreenMetal
- default-extras
- diceOfRolling
- diceOfRolling-fate
- gemstone
- gemstoneMarble
- genesys
- genesys2
- rock
- rust
- smooth
- smooth-pip
- wooden

## License
This bundle includes:
- @3d-dice/dice-box (MIT License)
- @3d-dice/dice-themes (MIT License)
