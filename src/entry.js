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
        
        console.log('🎲 DiceBox Initialization:', {
            config: normalizedConfig,
            wasmPath: normalizedConfig.wasmPath,
            assetPath: normalizedConfig.assetPath,
            origin: normalizedConfig.origin,
            theme: normalizedConfig.theme,
            themePath: normalizedConfig.themePath
        });
        
        super(normalizedConfig);
    }

    async init() {
        try {
            console.log('🎲 DiceBox: Starting initialization...');
            
            // Check WASM file before initialization
            const wasmPath = this.config.wasmPath || this.config.assetPath + 'ammo/ammo.wasm.wasm';
            console.log('🎲 DiceBox: Checking WASM file...', { wasmPath });
            
            try {
                const response = await fetch(wasmPath);
                console.log('🎲 DiceBox: WASM fetch response:', {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries())
                });
                
                if (!response.ok) {
                    throw new Error(`WASM file not accessible: ${response.status} ${response.statusText}`);
                }
            } catch (wasmError) {
                console.error('🎲 DiceBox: WASM file check failed:', {
                    error: wasmError,
                    message: wasmError.message,
                    stack: wasmError.stack
                });
                throw wasmError;
            }

            await super.init();
            console.log('🎲 DiceBox: Initialized successfully');
        } catch (error) {
            console.error('🎲 DiceBox: Initialization failed:', {
                error: error,
                message: error.message,
                stack: error.stack,
                config: this.config
            });
            throw error;
        }
    }
}

if (typeof window !== 'undefined') {
    window.DiceBox = ExtendedDiceBox;
}

export default ExtendedDiceBox;