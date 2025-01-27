import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Home, RotateCcw, Share2, Trophy } from "lucide-react";
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

const FinalScreen: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtén los parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const stars = parseInt(searchParams.get("stars") || "0");
  const level = searchParams.get("level") || "facil";

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + 1, stars * 10);
        if (newProgress === stars * 10) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [stars]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "facil":
        return "text-green-500";
      case "medio":
        return "text-yellow-500";
      case "dificil":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getPerformanceMessage = (stars: number) => {
    if (stars >= 9) return "¡Excelente trabajo! Eres un genio de las matemáticas.";
    if (stars >= 7) return "¡Muy bien hecho! Tienes grandes habilidades matemáticas.";
    if (stars >= 5) return "Buen trabajo. Sigue practicando para mejorar aún más.";
    return "No te desanimes. Con más práctica, ¡lo harás mejor la próxima vez!";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100 p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <Card className="w-full max-w-md" role="main" tabIndex={-1}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-2" tabIndex={0}>
            ¡Juego Terminado!
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Nivel:{" "}
            <span className={`font-bold ${getLevelColor(level)}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <Trophy aria-label="Trofeo" role="img" className="w-16 h-16 text-yellow-500" />
          </div>
          <div className="text-center mb-6">
            <p className="text-2xl font-bold mb-2">
              Estrellas: {stars} <Star className="inline-block text-yellow-500" />
            </p>
            <Progress value={progress} className="w-full h-4" />
          </div>
          <p className="text-center mb-6">{getPerformanceMessage(stars)}</p>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => navigate("/levels")} 
              className="w-full focus:ring-2 focus:ring-indigo-500"
              tabIndex={0}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Jugar de nuevo
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              className="w-full focus:ring-2 focus:ring-indigo-500"
              tabIndex={0}
            >
              <Home className="mr-2 h-4 w-4" /> Volver al inicio
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" /> Compartir resultado
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Compartir tu resultado</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¡Comparte tu puntuación de {stars} estrellas en el nivel {level} con tus amigos!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Compartir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalScreen;
