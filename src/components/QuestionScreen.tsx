import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Volume2, VolumeX } from "lucide-react";
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
import { seleccionarPreguntasAleatorias } from "../data/questionUtils";
import { preguntasDificil } from "@/data/preguntasDificil";
import { preguntasFacil } from "@/data/preguntasFacil";
import { preguntasMedio } from "@/data/preguntasMedio";

const QuestionScreen: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stars, setStars] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const [hitTarget, setHitTarget] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // Aumentado a 15 segundos
  const [isMuted, setIsMuted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const level = searchParams.get("level");

  useEffect(() => {
    let questionPool:any;
    switch (level) {
      case "facil":
        questionPool = preguntasFacil;
        break;
      case "medio":
        questionPool = preguntasMedio;
        break;
      case "dificil":
        questionPool = preguntasDificil;
        break;
      default:
        questionPool = [];
    }
    setQuestions(seleccionarPreguntasAleatorias(questionPool, 10));
  }, [level]);

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(false, -1);
    }
  }, [timeLeft, isAnswered]);

  const handleAnswer = (isCorrect: boolean, idx: number) => {
    setIsAnswered(true);
    setHitTarget(idx);
    setRotation(-25 + idx * 30);
    setShowGif(true);

    // Encontrar la respuesta correcta
    const correctAnswer = questions[currentQuestion].opciones.find((opt: any) => opt.correcta);

    // Mensaje modificado para incluir la respuesta correcta
    const message = isCorrect 
      ? "¡Respuesta Correcta! ¡Felicitaciones!" 
      : `Respuesta Incorrecta. La respuesta correcta era: ${correctAnswer.texto}`;
    setAnnouncement(message);
    setFeedbackMessage(message);

    // Reproducir sonido si no está muteado
    if (!isMuted) {
      const audio = new Audio(isCorrect ? '/correct.mp3' : '/incorrect.mp3');
      audio.play().catch(console.error);
    }

    setTimeout(() => {
      setShowGif(false);
      setShowFeedback(true);

      if (isCorrect) {
        setStars((prev) => prev + 1);
      } else {
        setStrikes((prev) => prev + 1);
      }

      setTimeout(() => {
        setShowFeedback(false);
        if (strikes >= 2 || currentQuestion >= 9) {
          navigate(`/final?stars=${stars}&level=${level}`);
        } else {
          setCurrentQuestion((prev) => prev + 1);
          setRotation(0);
          setHitTarget(null);
          setTimeLeft(15);
          setIsAnswered(false);
          // Anunciar nueva pregunta
          setAnnouncement(`Nueva pregunta: ${questions[currentQuestion + 1]?.texto}`);
        }
      }, 2000);
    }, 2000);
  };

  const handleKeyPress = (option: any, idx: number) => (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isAnswered) {
      handleAnswer(option.correcta, idx);
    }
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (isAnswered) return;

    const options = questions[currentQuestion]?.opciones;
    if (!options) return;

    switch (e.key) {
      case '1':
      case '2':
      case '3':
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < options.length) {
          handleAnswer(options[idx].correcta, idx);
        }
        break;
      case 'ArrowLeft':
        // Navegar a la opción anterior
        break;
      case 'ArrowRight':
        // Navegar a la opción siguiente
        break;
      case 'Enter':
      case ' ':
        // Seleccionar opción actual
        break;
    }
  };

  const getProgressColor = (timeLeft: number) => {
    if (timeLeft > 10) return "bg-green-500";
    if (timeLeft > 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getButtonStyles = (option: any, idx: number) => {
    if (hitTarget === null) return "bg-gray-300 hover:bg-gray-400";
    
    if (option.correcta) {
      return "bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-lg transform scale-105";
    }
    
    if (hitTarget === idx && !option.correcta) {
      return "bg-red-500 hover:bg-red-600 text-white border-red-600";
    }
    
    return "bg-gray-300 opacity-50";
  };

  if (!questions.length) return <div className="flex justify-center items-center h-screen">Cargando preguntas...</div>

  return (
    <div 
      className="relative p-6 bg-gradient-to-b from-purple-100 to-indigo-100 min-h-screen flex flex-col items-center"
      onKeyDown={handleKeyNavigation}
      role="application"
      aria-label="Pantalla de preguntas"
    >
      {/* Anun  ciador para lectores de pantalla */}
      <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {announcement}
      </div>

      <Card className="w-full max-w-2xl" role="main">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Button variant="ghost" onClick={() => navigate("/levels")} className="p-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cómo jugar</AlertDialogTitle>
                  <AlertDialogDescription>
                    1. Lee la pregunta cuidadosamente.
                    <br />
                    2. Selecciona la respuesta correcta haciendo clic en la diana.
                    <br />
                    3. ¡Responde antes de que se acabe el tiempo!
                    <br />
                    4. Gana estrellas por respuestas correctas y evita los errores.
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
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4" role="status">
            <span className="font-bold text-lg" aria-label={`${stars} estrellas conseguidas`}>
              ⭐ {stars}
            </span>
            <span className="font-bold text-lg" aria-label={`${strikes} de 3 errores permitidos`}>
              ❌ {strikes}/3
            </span>
          </div>
          
          {/* Barra de progreso de preguntas */}
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>Progreso</span>
              <span>{currentQuestion + 1} de {questions.length}</span>
            </div>
            <Progress 
              value={(currentQuestion / questions.length) * 100} 
              className="h-2"
              aria-label={`Pregunta ${currentQuestion + 1} de ${questions.length}`}
            />
          </div>

          {/* Barra de tiempo */}
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>Tiempo restante</span>
              <span>{timeLeft}s</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${getProgressColor(timeLeft)}`}
                style={{ width: `${(timeLeft / 15) * 100}%` }}
                role="progressbar"
                aria-valuenow={timeLeft}
                aria-valuemin={0}
                aria-valuemax={15}
              />
            </div>
          </div>

          <CardTitle 
            className="text-2xl font-bold mb-6 text-center"
            role="heading"
            aria-level={1}
          >
            {questions[currentQuestion]?.texto}
          </CardTitle>

          <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-4xl mx-auto" role="radiogroup">
            {questions[currentQuestion]?.opciones.map((option:any, idx:any) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Button
                  onClick={() => !isAnswered && handleAnswer(option.correcta, idx)}
                  onKeyPress={handleKeyPress(option, idx)}
                  className={`w-full h-24 relative rounded-lg transition-all duration-300 transform 
                    ${getButtonStyles(option, idx)}
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none
                  `}
                  disabled={isAnswered}
                  tabIndex={0}
                  role="radio"
                  aria-checked={hitTarget === idx}
                  aria-label={`Opción ${idx + 1}: ${option.texto}`}
                >
                  <img
                    src={hitTarget === idx ? "/dianadestroy.png" : "/diana.png"}
                    alt="Diana"
                    className={`w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      ${option.correcta && hitTarget !== null ? 'animate-bounce' : ''}
                    `}
                  />
                  <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow">
                    {option.texto}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        style={{
          transform: `translateX(-50%) rotate(${rotation}deg) ${showGif ? "rotate(-90deg)" : ""}`,
          transition: "transform 0.5s",
        }}
      >
        <img
          src={showGif ? "/tiro-con-arco-06.gif" : "/arco.png"}
          alt={showGif ? "Tiro con arco animado" : "Arco"}
          className={showGif ? "w-64 h-64" : "w-48"}
        />
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 bg-white p-4 rounded-lg shadow-lg text-center"
          >
            <p className="text-lg font-bold">{feedbackMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuestionScreen

