export interface ModelConfig {
    url: string;
    scale: number;
}

export const MODELS: ModelConfig[] = [
    { url: '/3D/MOD1.glb', scale: 0.7 },
    { url: '/3D/MOD2.glb', scale: 40 },
    { url: '/3D/MOD3.glb', scale: 0.8 }
];

export const PRELOAD_DELAY = 1500; // ms between preloads
