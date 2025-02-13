import DiceBox from '@3d-dice/dice-box';

// Extend DiceBox to handle initialization
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Create a minimal configuration
        const baseConfig = {
            // Required properties
            id: config.id,
            theme: config.theme || 'default',
            scale: config.scale || 6,
            
            // URLs
            assetPath: config.assetPath,
            origin: config.origin,
            
            // Force offscreen rendering for better performance
            offscreen: true
        };

        // Log configuration
        console.log('🎲 DiceBox Configuration:', baseConfig);

        super(baseConfig);
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

    destroy() {
        try {
            super.destroy();
            console.log('🎲 DiceBox: Destroyed successfully');
        } catch (error) {
            console.error('🎲 DiceBox: Destroy failed:', error);
            throw error;
        }
    }
}

if (typeof window !== 'undefined') {
    window.DiceBox = ExtendedDiceBox;
}

export default ExtendedDiceBox;