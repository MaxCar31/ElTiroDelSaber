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
  AlertDialogTrigger,
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
      navigate("/"); // Redirige a la pantalla de inicio si no hay nombre guardado
    }
  }, [navigate]);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setShowConfirmation(true);
  };

  const confirmLevelSelection = () => {
    navigate(`/questions?level=${selectedLevel}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">Selecciona Nivel</h1>
        <p className="text-center text-gray-700 mb-6">
          Bienvenido, <span className="font-semibold">{playerName}</span>. ¡Selecciona un nivel para comenzar!
        </p>
        <div className="grid grid-cols-1 gap-4">
          {/* Nivel fácil */}
          <Card onClick={() => handleLevelSelect("facil")} className="cursor-pointer hover:shadow-lg">
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
          <Card onClick={() => handleLevelSelect("medio")} className="cursor-pointer hover:shadow-lg">
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
          <Card onClick={() => handleLevelSelect("dificil")} className="cursor-pointer hover:shadow-lg">
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
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelSelection;
