"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material"
import * as THREE from "three"

export default function Page() {
  return <MannequinViewer />
}

const upperClothingOptions = ["/models/varsity_jacket.glb", "/models/jeans.glb"]
const lowerClothingOptions = ["/models/jeans.glb", "/models/varsity_jacket.glb"]

function MannequinViewer() {
  const [upperClothingIndex, setUpperClothingIndex] = useState(0)
  const [lowerClothingIndex, setLowerClothingIndex] = useState(0)
  const [canvasKey, setCanvasKey] = useState(0)

  const changeClothing = (type, direction) => {
    const setIndex = type === "upper" ? setUpperClothingIndex : setLowerClothingIndex
    const options = type === "upper" ? upperClothingOptions : lowerClothingOptions

    setIndex((prevIndex) =>
      direction === "left"
        ? prevIndex === 0
          ? options.length - 1
          : prevIndex - 1
        : (prevIndex + 1) % options.length
    )
  }

  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative", background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)" }}>
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, p: 2, zIndex: 10 }}>
        <Typography variant="h4" align="center" fontWeight="bold">
          3D Mannequin Clothing Viewer
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Use the controls below to change clothing items
        </Typography>
      </Box>

      <Canvas
        key={canvasKey}
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        onCreated={({ gl }) => {
          const canvas = gl.getContext().canvas
          const handleContextLost = (e) => {
            e.preventDefault()
            setTimeout(() => setCanvasKey(k => k + 1), 100)
          }
          canvas.addEventListener('webglcontextlost', handleContextLost)
          return () => canvas.removeEventListener('webglcontextlost', handleContextLost)
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
        <MannequinModel
          upperClothingUrl={upperClothingOptions[upperClothingIndex]}
          lowerClothingUrl={lowerClothingOptions[lowerClothingIndex]}
        />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={5} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI - Math.PI / 6} />
        <Environment preset="studio" />
      </Canvas>

      <ClothingControls
        onUpperLeft={() => changeClothing("upper", "left")}
        onUpperRight={() => changeClothing("upper", "right")}
        onLowerLeft={() => changeClothing("lower", "left")}
        onLowerRight={() => changeClothing("lower", "right")}
        upperIndex={upperClothingIndex}
        lowerIndex={lowerClothingIndex}
        upperTotal={upperClothingOptions.length}
        lowerTotal={lowerClothingOptions.length}
      />
    </Box>
  )
}

function MannequinModel({ upperClothingUrl, lowerClothingUrl }) {
  const groupRef = useRef()
  const { scene: mannequinScene } = useGLTF("/models/faaiz_model.glb")

  // Rotate model continuously
  // useFrame(() => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.002
  //   }
  // })

  return (
    <group ref={groupRef} dispose={null} scale={[1, 1, 1]} position={[0, -1, 0]}>
      <primitive object={mannequinScene.clone()} />
      
      {/* Upper clothing positioned at torso level */}
      <ClothingItem 
        url={upperClothingUrl} 
        position={[-5, -100, 0]}
        scale={[0.06, 0.06, 0.06]}
        rotation={[0, 0, 0]}
      />
      
      {/* Lower clothing positioned at hip level */}
      <ClothingItem 
        url={lowerClothingUrl} 
        position={[0, 0.9, 0.01]}
        scale={[1.1, 1.0, 1.7]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
}

function ClothingItem({ url, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useLoader(GLTFLoader, url)
  const ref = useRef()

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive 
        object={scene.clone()} 
        ref={ref}
        onUpdate={self => {
          // Ensure proper matrix updates
          self.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
        }}
      />
    </group>
  )
}

function ClothingControls({
  onUpperLeft,
  onUpperRight,
  onLowerLeft,
  onLowerRight,
  upperIndex,
  lowerIndex,
  upperTotal,
  lowerTotal,
}) {
  return (
    <Box sx={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
      <Card sx={{ width: 280, bgcolor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6">Upper Clothing</Typography>
          <Typography variant="body2" color="text.secondary">
            Item {upperIndex + 1} of {upperTotal}
          </Typography>
        </Box>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton onClick={onUpperLeft} size="large">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={onUpperRight} size="large">
              <ChevronRight />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: 280, bgcolor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6">Lower Clothing</Typography>
          <Typography variant="body2" color="text.secondary">
            Item {lowerIndex + 1} of {lowerTotal}
          </Typography>
        </Box>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton onClick={onLowerLeft} size="large">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={onLowerRight} size="large">
              <ChevronRight />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
