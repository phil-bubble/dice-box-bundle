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
            
            // Force offscreen rendering for better performance
            offscreen: true
        };

        // Handle URLs carefully to avoid doubling
        if (config.assetPath) {
            try {
                // Remove any trailing slashes
                const cleanAssetPath = config.assetPath.replace(/\/+$/, '');
                baseConfig.assetPath = cleanAssetPath + '/';
                
                // Set explicit WASM path to avoid URL doubling
                baseConfig.wasmPath = `${cleanAssetPath}/ammo/ammo.wasm.wasm`;
            } catch (e) {
                console.error('Failed to process assetPath:', e);
            }
        }

        if (config.origin) {
            try {
                // Remove any trailing slashes
                const cleanOrigin = config.origin.replace(/\/+$/, '');
                baseConfig.origin = cleanOrigin + '/';
            } catch (e) {
                console.error('Failed to process origin:', e);
            }
        }

        // Log configuration
        console.log('🎲 DiceBox Configuration:', {
            ...baseConfig,
            assetPath: baseConfig.assetPath,
            wasmPath: baseConfig.wasmPath,
            origin: baseConfig.origin
        });

        super(baseConfig);
    }

    async init() {
        try {
            console.log('🎲 DiceBox: Starting initialization...');
            
            // Verify WASM path before initialization
            if (this.config.wasmPath) {
                console.log('🎲 DiceBox: Checking WASM file...', this.config.wasmPath);
                const response = await fetch(this.config.wasmPath);
                if (!response.ok) {
                    throw new Error(`WASM file not accessible: ${response.status} ${response.statusText}`);
                }
                console.log('🎲 DiceBox: WASM file is accessible');
            }

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