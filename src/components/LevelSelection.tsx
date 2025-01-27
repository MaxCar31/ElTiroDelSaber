import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Brain, Zap } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LevelSelection: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("nombreJugador");
    if (name) {
      setPlayerName(name);
    } else {
      navigate("/"); 
    }
  }, [navigate]);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setShowConfirmation(true);
  };

  const confirmLevelSelection = () => {
    navigate(`/questions?level=${selectedLevel}`);
  };

  const handleKeyPress = (level: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLevelSelect(level);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div role="main" tabIndex={-1} className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">Selecciona Nivel</h1>
        <p className="text-center text-gray-700 mb-6">
          Bienvenido, <span className="font-semibold">{playerName}</span>. ¡Selecciona un nivel para comenzar!
        </p>
        <div className="grid grid-cols-1 gap-4">
          {/* Nivel fácil */}
          <Card 
            onClick={() => handleLevelSelect("facil")} 
            onKeyPress={handleKeyPress("facil")}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar nivel fácil"
            className="cursor-pointer hover:shadow-lg focus:ring-2 focus:ring-indigo-500"
          >
            <CardHeader>
              <CardTitle>
                <Zap className="inline-block mr-2 text-yellow-500" />
                Fácil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Preguntas básicas para calentar motores.</CardDescription>
            </CardContent>
          </Card>

          {/* Nivel medio */}
          <Card 
            onClick={() => handleLevelSelect("medio")} 
            onKeyPress={handleKeyPress("medio")}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar nivel medio"
            className="cursor-pointer hover:shadow-lg focus:ring-2 focus:ring-indigo-500"
          >
            <CardHeader>
              <CardTitle>
                <Brain className="inline-block mr-2 text-blue-500" />
                Medio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Un desafío intermedio para poner a prueba tus conocimientos.</CardDescription>
            </CardContent>
          </Card>

          {/* Nivel difícil */}
          <Card 
            onClick={() => handleLevelSelect("dificil")} 
            onKeyPress={handleKeyPress("dificil")}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar nivel difícil"
            className="cursor-pointer hover:shadow-lg focus:ring-2 focus:ring-indigo-500"
          >
            <CardHeader>
              <CardTitle>
                <Trophy className="inline-block mr-2 text-red-500" />
                Difícil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Solo para expertos. ¿Estás listo para el reto?</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Diálogo de confirmación */}
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Nivel</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas comenzar en el nivel <strong>{selectedLevel}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={confirmLevelSelection}>Sí, comenzar</AlertDialogAction>
              <Button variant="ghost" onClick={() => setShowConfirmation(false)}>
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Botón Volver */}
        <div className="flex justify-start mt-6">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full focus:ring-2 focus:ring-indigo-500"
            tabIndex={0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelSelection;
