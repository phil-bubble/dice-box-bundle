import DiceBox from '@3d-dice/dice-box';
import '@3d-dice/dice-box/dist/world.offscreen.js';
import '@3d-dice/dice-box/dist/world.onscreen.js';
import '@3d-dice/dice-box/dist/world.none.js';
import '@3d-dice/dice-box/dist/Dice.js';

// Extend DiceBox to handle initialization
class ExtendedDiceBox extends DiceBox {
    constructor(config) {
        // Log the environment
        console.log('🎲 DiceBox Environment:', {
            window: typeof window !== 'undefined',
            WebAssembly: typeof WebAssembly !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        });

        // Create a clean configuration that can be safely cloned
        const cleanConfig = {
            // Required core properties
            id: config.id,
            theme: config.theme || 'default',
            scale: config.scale || 6,
            offscreen: true,
            
            // Ensure URLs are absolute and properly formatted
            assetPath: new URL(config.assetPath, window.location.href).toString(),
            origin: new URL(config.origin, window.location.href).toString(),
            
            // Optional properties
            themeDirectory: config.themeDirectory ? 
                new URL(config.themeDirectory, window.location.href).toString() : 
                undefined
        };

        // Ensure paths end with slashes
        if (!cleanConfig.assetPath.endsWith('/')) cleanConfig.assetPath += '/';
        if (!cleanConfig.origin.endsWith('/')) cleanConfig.origin += '/';
        if (cleanConfig.themeDirectory && !cleanConfig.themeDirectory.endsWith('/')) {
            cleanConfig.themeDirectory += '/';
        }

        // Set WASM path
        cleanConfig.wasmPath = new URL('ammo/ammo.wasm.wasm', cleanConfig.assetPath).toString();

        console.log('🎲 DiceBox Initialization:', {
            config: cleanConfig,
            wasmPath: cleanConfig.wasmPath,
            assetPath: cleanConfig.assetPath,
            origin: cleanConfig.origin,
            theme: cleanConfig.theme
        });

        // Initialize with clean config
        super(cleanConfig);
    }

    async init() {
        try {
            console.log('🎲 DiceBox: Starting initialization...');
            
            // Verify WASM availability before proceeding
            const wasmResponse = await fetch(this.config.wasmPath);
            if (!wasmResponse.ok) {
                throw new Error(`WASM file not accessible: ${wasmResponse.status} ${wasmResponse.statusText}`);
            }

            // Initialize with verified configuration
            await super.init();
            console.log('🎲 DiceBox: Initialized successfully');
        } catch (error) {
            console.error('🎲 DiceBox: Initialization failed:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
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