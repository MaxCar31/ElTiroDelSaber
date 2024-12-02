import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, HelpCircle, Volume2, VolumeX } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const WelcomeScreen: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const router = useNavigate()

  useEffect(() => {
    const savedName = localStorage.getItem("nombreJugador")
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handleStart = () => {
    if (playerName.trim()) {
      localStorage.setItem("nombreJugador", playerName)
      router("/levels")
    } else {
      setError("Por favor, ingresa tu nombre.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
    setError(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b  from-purple-100 to-indigo-100 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">MATHHOOT!</h1>
        <div className="mb-4">
          <Label htmlFor="playerName" className="text-sm font-medium text-gray-700">
            Nombre del Jugador
          </Label>
          <Input
            type="text"
            id="playerName"
            value={playerName}
            onChange={handleInputChange}
            placeholder="Ingresa tu nombre"
            className="mt-1"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
        </div>
        <Button onClick={handleStart} className="w-full mb-4">
          Iniciar Juego
        </Button>
        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cómo jugar MATHHOOT!</AlertDialogTitle>
                <AlertDialogDescription>
                  1. Ingresa tu nombre y haz clic en &quot;Iniciar Juego&quot;.
                  <br />
                  2. Elige un nivel de dificultad.
                  <br />
                  3. Responde las preguntas matemáticas lo más rápido posible.
                  <br />
                  4. ¡Gana estrellas por cada respuesta correcta!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Entendido</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen

