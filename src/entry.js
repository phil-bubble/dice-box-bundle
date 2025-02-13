import DiceBox from '@3d-dice/dice-box';
import '@3d-dice/dice-box/dist/world.offscreen.js';
import '@3d-dice/dice-box/dist/world.onscreen.js';
import '@3d-dice/dice-box/dist/world.none.js';
import '@3d-dice/dice-box/dist/Dice.js';
import { embeddedWasmBinary } from './wasm-loader';

// Extend DiceBox to use embedded WASM
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Pre-initialize Ammo.js with our embedded WASM
        if (typeof Ammo === 'undefined') {
            console.log(' Pre-initializing Ammo.js with embedded WASM...');
            window.Ammo = async () => {
                return new Promise((resolve, reject) => {
                    try {
                        // Create a Blob from the WASM binary
                        const blob = new Blob([embeddedWasmBinary], { type: 'application/wasm' });
                        const url = URL.createObjectURL(blob);
                        
                        // Load the WASM module
                        WebAssembly.instantiateStreaming(fetch(url), {})
                            .then(result => {
                                URL.revokeObjectURL(url);
                                resolve(result.instance.exports);
                            })
                            .catch(error => {
                                URL.revokeObjectURL(url);
                                reject(error);
                            });
                    } catch (error) {
                        reject(error);
                    }
                });
            };
        }

        // Initialize DiceBox with the config
        super({
            ...config,
            wasmBinary: embeddedWasmBinary
        });
    }

    // Override init to ensure Ammo.js is initialized first
    async init() {
        try {
            // Wait for Ammo.js to be ready
            if (typeof Ammo === 'function') {
                await Ammo();
            }
            // Call parent init
            return await super.init();
        } catch (error) {
            console.error(' Error initializing DiceBox:', error);
            throw error;
        }
    }
}

if (typeof window !== 'undefined') {
    window.DiceBox = ExtendedDiceBox;
}

export default ExtendedDiceBox;
