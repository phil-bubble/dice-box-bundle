import DiceBox from '@3d-dice/dice-box';
import '@3d-dice/dice-box/dist/world.offscreen.js';
import '@3d-dice/dice-box/dist/world.onscreen.js';
import '@3d-dice/dice-box/dist/world.none.js';
import '@3d-dice/dice-box/dist/Dice.js';

// Extend DiceBox to handle initialization
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Normalize paths
        const normalizedConfig = { ...config };
        
        // Ensure assetPath ends with a slash
        if (normalizedConfig.assetPath && !normalizedConfig.assetPath.endsWith('/')) {
            normalizedConfig.assetPath += '/';
        }

        // Ensure origin ends with a slash
        if (normalizedConfig.origin && !normalizedConfig.origin.endsWith('/')) {
            normalizedConfig.origin += '/';
        }

        // Make sure we're using the correct WASM file path
        normalizedConfig.wasmPath = normalizedConfig.assetPath + 'ammo/ammo.wasm.wasm';
        
        console.log('🎲 DiceBox Config:', normalizedConfig);
        
        super(normalizedConfig);
    }

    async init() {
        try {
            console.log('🎲 DiceBox: Starting initialization...');
            await super.init();
            console.log('🎲 DiceBox: Initialized successfully');
        } catch (error) {
            console.error('🎲 DiceBox: Initialization failed:', error);
            throw error;
        }
    }
}

if (typeof window !== 'undefined') {
    window.DiceBox = ExtendedDiceBox;
}

export default ExtendedDiceBox;