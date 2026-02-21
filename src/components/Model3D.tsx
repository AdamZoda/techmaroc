import React, { Suspense, useEffect, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { MODELS, PRELOAD_DELAY } from '../constants/models';

// --- Sequential Preload Logic ---
const PRELOAD_ORDER = MODELS.map(m => m.url);

const PreloadManager = () => {
    useEffect(() => {
        const loadSequentially = async () => {
            for (const path of PRELOAD_ORDER) {
                try {
                    await useGLTF.preload(path);
                    await new Promise(r => setTimeout(r, PRELOAD_DELAY));
                } catch (e) {
                    console.warn('Preload failed:', path);
                }
            }
        };
        loadSequentially();
    }, []);
    return null;
};

// --- AJUSTEMENT DE LA TAILLE ---
const Model = memo(({ url, scale = 1 }: { url: string; scale?: number }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={scale} />;
});

Model.displayName = 'Model3DInner';

interface Model3DProps {
    url?: string;
    scale?: number;
}

export default function Model3D({ url = MODELS[0].url, scale = MODELS[0].scale }: Model3DProps) {
    return (
        <div className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing">
            <PreloadManager />
            <Canvas
                shadows="soft"
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    stencil: false,
                    depth: true,
                    powerPreference: "high-performance",
                    alpha: true
                }}
                camera={{ fov: 45, position: [0, 0, 12] }}
            >
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />

                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} shadows="contact" adjustCamera={false}>
                        <Model url={url} scale={scale} />
                    </Stage>
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.8}
                    makeDefault
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}
