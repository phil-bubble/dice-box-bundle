const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const themesDir = path.join(__dirname, '../node_modules/@3d-dice/dice-themes/themes');

// Create themes directory if it doesn't exist
if (!fs.existsSync(themesDir)) {
    fs.mkdirSync(themesDir, { recursive: true });
}

const themes = [
    'blueGreenMetal',
    'default',
    'default-extras',
    'diceOfRolling',
    'diceOfRolling-fate',
    'gemstone',
    'gemstoneMarble',
    'genesys',
    'genesys2',
    'rock',
    'rust',
    'smooth',
    'smooth-pip',
    'wooden'
];

// Install or update dice-themes package
console.log('Installing/updating @3d-dice/dice-themes...');
execSync('npm install @3d-dice/dice-themes@latest', { stdio: 'inherit' });

console.log('Themes have been downloaded to:', themesDir);
console.log('Now run npm run build to update the bundle with the new themes.');
