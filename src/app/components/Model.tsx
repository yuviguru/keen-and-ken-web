import { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Mesh } from 'three'

export default function Model({ modelPath = '/ken-bot-model.obj' }) {
  const obj = useLoader(OBJLoader, modelPath)
  const meshRef = useRef<Mesh>(null)

  return (
    <primitive 
      ref={meshRef} 
      object={obj} 
      position={[0, -1, 0]} 
      scale={1.5} 
      rotation={[10, Math.PI, 10]} 
      castShadow 
      receiveShadow 
    />
  )
}
