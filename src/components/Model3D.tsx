import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';

// --- Sequential Preload Logic ---
const PRELOAD_ORDER = ['/3D/MOD1.glb', '/3D/MOD2.glb', '/3D/MOD3.glb'];

const PreloadManager = () => {
    useEffect(() => {
        const loadSequentially = async () => {
            // First one is usually already loading by the main Model component
            // We preload the others one by one to avoid network saturation
            for (const path of PRELOAD_ORDER) {
                try {
                    await useGLTF.preload(path);
                    // Small delay between preloads to keep main thread free
                    await new Promise(r => setTimeout(r, 1500));
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
function Model({ url, scale = 1 }: { url: string; scale?: number }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={scale} />;
}

interface Model3DProps {
    url?: string;
    scale?: number;
}

export default function Model3D({ url = '/3D/MOD1.glb', scale = 0.7 }: Model3DProps) {
    return (
        <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
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
