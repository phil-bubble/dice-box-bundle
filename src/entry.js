import DiceBox from '@3d-dice/dice-box';
import '@3d-dice/dice-box/dist/world.offscreen.js';
import '@3d-dice/dice-box/dist/world.onscreen.js';
import '@3d-dice/dice-box/dist/world.none.js';
import '@3d-dice/dice-box/dist/Dice.js';

// Extend DiceBox to handle initialization
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Ensure assetPath ends with a slash
        if (config.assetPath && !config.assetPath.endsWith('/')) {
            config.assetPath += '/';
        }
        
        super(config);
    }

    async init() {
        try {
            await super.init();
            console.log('🎲 DiceBox initialized successfully');
        } catch (error) {
            console.error('🎲 DiceBox initialization failed:', error);
            throw error;
        }
    }
}

if (typeof window !== 'undefined') {
    window.DiceBox = ExtendedDiceBox;
}

export default ExtendedDiceBox;