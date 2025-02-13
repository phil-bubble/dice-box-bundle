import DiceBox from '@3d-dice/dice-box';
import '@3d-dice/dice-box/dist/world.offscreen.js';
import '@3d-dice/dice-box/dist/world.onscreen.js';
import '@3d-dice/dice-box/dist/world.none.js';
import '@3d-dice/dice-box/dist/Dice.js';
import { embeddedWasmBinary } from './wasm-loader';

// Extend DiceBox to use embedded WASM
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Initialize DiceBox with the config
        super({
            ...config,
            wasmBinary: embeddedWasmBinary
        });
    }

    // Override init to ensure Ammo.js is initialized first
    async init() {
        try {
            // Initialize Ammo.js if not already initialized
            if (typeof Ammo === 'undefined') {
                console.log(' Pre-initializing Ammo.js...');
                const wasmBinary = new Uint8Array(embeddedWasmBinary);
                
                // Create the import object that Ammo.js expects
                const imports = {
                    env: {
                        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
                        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
                        __memory_base: 0,
                        __table_base: 0,
                        _abort: () => {},
                        _emscripten_memcpy_big: () => {},
                        _emscripten_resize_heap: () => {},
                        abortStackOverflow: () => {},
                    }
                };

                // Compile and instantiate the WASM module
                const wasmModule = await WebAssembly.compile(wasmBinary);
                const instance = await WebAssembly.instantiate(wasmModule, imports);
                
                // Set up Ammo global
                window.Ammo = instance.exports;
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
