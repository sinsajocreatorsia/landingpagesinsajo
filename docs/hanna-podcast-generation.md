# Hanna Podcast Generation - Análisis de Viabilidad y Costos

## 📋 Resumen Ejecutivo

**Pregunta:** ¿Puede Hanna crear un podcast de 5 minutos en audio sobre un tema solicitado por el usuario?

**Respuesta:** SÍ, es totalmente viable. Hanna puede generar:
1. El contenido/guion del podcast (usando OpenRouter AI)
2. Convertirlo a audio de alta calidad (usando TTS API)

## 🎯 Arquitectura Propuesta

```
Usuario solicita podcast → Hanna genera guión → TTS API genera audio → Usuario descarga MP3
```

### Flujo Detallado:
1. **Usuario:** "Hanna, créame un podcast de 5 minutos sobre estrategias de email marketing"
2. **Hanna (AI):** Genera guión estructurado con:
   - Intro (30 seg)
   - 3-4 puntos principales (3-4 min)
   - Conclusión y llamado a la acción (30 seg)
3. **TTS API:** Convierte texto a audio en español
4. **Sistema:** Retorna archivo MP3 descargable

## 💰 Análisis de Costos (Enero 2026)

### Opción 1: OpenAI TTS API (Recomendada para comenzar)

**Modelos disponibles:**
- **TTS Standard (tts-1):** $15 por millón de caracteres
- **TTS HD (tts-1-hd):** $30 por millón de caracteres
- **GPT-4o-mini-tts:** ~$0.015 por minuto de audio

**Costo por podcast de 5 minutos:**
- Texto requerido: ~1,200 palabras = ~7,500 caracteres
- TTS Standard: $0.11 USD
- TTS HD: $0.23 USD
- GPT-4o-mini-tts: $0.075 USD

**Generación de contenido (guión):**
- Claude 3.5 Sonnet (via OpenRouter): ~$0.015 por guión
- GPT-4o-mini: ~$0.003 por guión

**COSTO TOTAL POR PODCAST:** $0.08 - $0.25 USD

**Voces disponibles:** 6 voces (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
**Idiomas:** Español incluido sin costo adicional

---

### Opción 2: ElevenLabs (Mejor calidad, más costoso)

**Modelos:**
- Standard TTS: 1 crédito por carácter
- Turbo TTS: 0.5 créditos por carácter

**Costo por podcast de 5 minutos:**
- Texto requerido: ~7,500 caracteres
- Con Standard: ~7,500 créditos = $0.45 - $1.13 USD (según plan)
- Con Turbo: ~3,750 créditos = $0.23 - $0.56 USD

**Planes mensuales:**
- Free: 10,000 créditos/mes (~10 min) = GRATIS
- Starter: $5/mes (30,000 créditos = ~30 min)
- Creator: $22/mes
- Pro: $99/mes (500,000 créditos)

**COSTO TOTAL POR PODCAST:** $0.23 - $1.13 USD

**Voces:** 32 idiomas incluyendo español (España, México)
**Calidad:** Superior a OpenAI (voces más naturales)

---

### Opción 3: PlayHT (Alternativa económica)

**Pricing:**
- Free: 2,500 palabras gratis/mes
- Creator: $31/mes (120,000 palabras)
- Pro: $79/mes (600,000 palabras)

**Costo por podcast de 5 minutos:**
- ~1,200 palabras
- Pay-as-you-go: ~$0.50 USD
- Con plan mensual: $0.03 - $0.16 USD

---

## 📊 Comparativa de Opciones

| Proveedor | Costo/Podcast | Calidad | Velocidad | Español |
|-----------|---------------|---------|-----------|---------|
| OpenAI TTS-1 | $0.11 | Buena | Rápido | ✅ Excelente |
| OpenAI TTS-HD | $0.23 | Muy Buena | Rápido | ✅ Excelente |
| ElevenLabs | $0.23-$1.13 | Excelente | Medio | ✅ Excelente |
| PlayHT | $0.03-$0.50 | Buena | Rápido | ✅ Muy Buena |

## 💡 Recomendación

### Para MVP (Minimum Viable Product):
**OpenAI TTS Standard (tts-1)**
- ✅ Costo muy bajo ($0.11 por podcast)
- ✅ Calidad aceptable
- ✅ Rápida implementación
- ✅ Mismo proveedor que ya usamos (OpenRouter)
- ✅ API simple y confiable

### Para Producto Premium (Pro users):
**ElevenLabs Turbo**
- ✅ Calidad superior (voces ultra-naturales)
- ✅ Experiencia de "radio profesional"
- ✅ Justifica el upgrade a Pro
- ⚠️ Costo medio ($0.23-$0.56)

## 🚀 Implementación Técnica

### 1. Endpoint API Nuevo
```typescript
POST /api/hanna/generate-podcast

Request:
{
  "topic": "Email marketing para coaches",
  "duration": 5, // minutos
  "style": "professional" | "casual" | "storytelling",
  "userId": "user-id"
}

Response:
{
  "audioUrl": "https://cdn.../podcast-123.mp3",
  "transcript": "texto completo...",
  "duration": 5.2,
  "cost": 0.11
}
```

### 2. Flujo de Backend
```python
1. Generar guión con Claude/GPT
2. Optimizar texto para TTS (remover Markdown, etc.)
3. Enviar a OpenAI TTS API
4. Guardar MP3 en Supabase Storage
5. Retornar URL pública
```

### 3. Límites por Plan
- **Free:** 0 podcasts/mes (solo demo)
- **Pro:** 10 podcasts/mes incluidos
- **Extra:** $0.50 USD cada podcast adicional

## 📈 Proyección de Costos Mensuales

### Escenario Conservador (100 usuarios Pro activos)
- 50% usan 1 podcast/mes = 50 podcasts
- 30% usan 3 podcasts/mes = 90 podcasts
- 20% usan 5 podcasts/mes = 100 podcasts
- **Total:** 240 podcasts/mes
- **Costo (OpenAI):** $26.40 USD/mes
- **Costo (ElevenLabs):** $55-$270 USD/mes

### Escenario Optimista (500 usuarios Pro activos)
- **Total:** 1,200 podcasts/mes
- **Costo (OpenAI):** $132 USD/mes
- **Costo (ElevenLabs):** $276-$1,356 USD/mes

## ⚡ Características Adicionales

### Para diferenciarnos:
1. **Música de fondo** (intro/outro)
2. **Múltiples voces** (conversación simulada)
3. **Efectos de sonido** (transiciones)
4. **Capítulos** (timestamps)
5. **Transcripción incluida** (SEO + accesibilidad)

## 🎯 MVP Features (Fase 1)

### Básico:
- ✅ Generación de guión personalizado
- ✅ Conversión a audio (voz única)
- ✅ Descarga MP3
- ✅ Límite: 5 minutos máximo

### Siguiente fase:
- 🔜 Música de fondo
- 🔜 Selección de voz
- 🔜 Velocidad ajustable
- 🔜 Podcasts de hasta 15 minutos

## 📝 Conclusión

**¿Es viable?** SÍ, absolutamente.

**¿Es costeable?** SÍ, muy económico ($0.08-$0.25 por podcast).

**¿Agrega valor?** SÍ DEFINITIVAMENTE. Permite:
- Usuarios puedan escuchar consejos mientras conducen/gym
- Contenido reutilizable para redes sociales
- Diferenciador competitivo importante
- Justifica upgrade a Pro

**Costo estimado de implementación:** 8-12 horas desarrollo
**ROI esperado:** Alto (aumenta conversión Free → Pro)

---

## 🔗 Referencias

### OpenAI TTS:
- [OpenAI TTS Pricing](https://platform.openai.com/docs/pricing)
- [OpenAI TTS API Documentation](https://platform.openai.com/docs/guides/text-to-speech)

### ElevenLabs:
- [ElevenLabs Pricing](https://elevenlabs.io/pricing)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)

### Alternativas:
- [Google Cloud TTS Pricing](https://cloud.google.com/text-to-speech/pricing)
- [Amazon Polly Pricing](https://aws.amazon.com/polly/pricing/)
- [Play.ht](https://play.ht/pricing/)

---

**Última actualización:** Febrero 2026
**Próxima revisión:** Trimestral (para actualizar costos)
