export function seleccionarPreguntasAleatorias<T>(bancoPreguntas: T[], cantidad: number): T[] {
    // Mezcla las preguntas aleatoriamente
    return bancoPreguntas.sort(() => Math.random() - 0.5).slice(0, cantidad);
}

export function calcularMensajeFinal(puntuacion: number, nombre: string, nivel: string): string {
    // Genera un mensaje basado en la puntuación
    return puntuacion >= 3
        ? `¡Felicidades, ${nombre}! Completaste el nivel ${nivel} con éxito.`
        : `Lo siento, ${nombre}. Intenta nuevamente para mejorar.`;
}
