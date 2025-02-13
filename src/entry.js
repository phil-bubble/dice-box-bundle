import DiceBox from '@3d-dice/dice-box';
import { embeddedWasmBinary } from './wasm-loader';

// Extend DiceBox to use embedded WASM
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Always use the embedded WASM binary
        super({
            ...config,
            wasmBinary: embeddedWasmBinary
        });
    }
}

if (typeof window !== 'undefined') {
    window.DiceBox = ExtendedDiceBox;
}

export default ExtendedDiceBox;
