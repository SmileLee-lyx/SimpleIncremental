type ModuleInitializer = { init: () => void };

const modules: Record<string, ModuleInitializer> = {};

export function register(name: string, module: { init: () => void }) {
    if (name in modules) {
        console.warn(`Module '${ name }' already registered`);
    }
    modules[name] = module;
}

export function initialize_instances() {
    for (const [_, module] of Object.entries(modules)) {
        module.init();
    }
}

declare global {
    interface Window {
        instance_modules: string[];
    }
}

Object.defineProperty(window, 'instance_modules', { get: () => Object.keys(modules) });