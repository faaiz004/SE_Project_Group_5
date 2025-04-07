import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function AvatarModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={[0, -1.5, 0]} />
}

function ClothingModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={[0, -1.5, 0]} />
}

export default function AvatarViewer() {
  const avatarURL = 'models\faaiz_model.glb'
  const jacketURL = 'models\varsity_jacket.glb' // change to your clothing file

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <AvatarModel url={avatarURL} />
          <ClothingModel url={jacketURL} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  )
}