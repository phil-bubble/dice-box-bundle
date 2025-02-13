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

        // Add custom WASM loading logic
        normalizedConfig.wasmLoader = async (wasmPath) => {
            console.log('🎲 DiceBox: Loading WASM from:', wasmPath);
            try {
                const response = await fetch(wasmPath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch WASM: ${response.status} ${response.statusText}`);
                }
                
                // Try compileStreaming first
                try {
                    console.log('🎲 DiceBox: Attempting streaming compilation...');
                    const wasmModule = await WebAssembly.compileStreaming(fetch(wasmPath));
                    console.log('🎲 DiceBox: Streaming compilation successful');
                    return wasmModule;
                } catch (streamError) {
                    console.log('🎲 DiceBox: Streaming compilation failed, falling back to regular compilation...', streamError);
                    // Fall back to regular compilation
                    const wasmBuffer = await response.arrayBuffer();
                    const wasmModule = await WebAssembly.compile(wasmBuffer);
                    console.log('🎲 DiceBox: Regular compilation successful');
                    return wasmModule;
                }
            } catch (error) {
                console.error('🎲 DiceBox: WASM loading failed:', error);
                throw error;
            }
        };
        
        super(normalizedConfig);
    }

    async init() {
        try {
            console.log('🎲 DiceBox: Starting initialization...');
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