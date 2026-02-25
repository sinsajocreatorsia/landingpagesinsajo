# Hanna Pro - Optimizaciones y Beneficios

## 🎯 Filosofía: Lo Mejor para Pro

Los usuarios Pro reciben la **mejor experiencia posible** en Hanna SaaS, optimizando tanto la calidad de respuestas como el uso eficiente de recursos.

---

## ⚡ Optimizaciones Técnicas Implementadas

### 1. **Modelo de IA Superior**

**Free/Basic:**
- Modelo: `openai/gpt-4o-mini`
- Calidad: Buena para consultas generales
- Costo: ~$0.15 por millón de tokens

**Pro:**
- Modelo: `anthropic/claude-3.5-sonnet`
- Calidad: **Excelente** para consultoría estratégica
- Ventajas:
  - Razonamiento más profundo
  - Mejor comprensión de contexto de negocio
  - Generación de diagramas Mermaid nativos
  - Respuestas más matizadas y estratégicas
- Costo: ~$3 por millón de tokens (20x más caro, pero **vale la pena**)

---

### 2. **Respuestas Más Largas y Profundas**

**Free/Basic:**
```typescript
max_tokens: 600
temperature: 0.7
```
- Respuestas de ~400-600 palabras
- Análisis estándar

**Pro:**
```typescript
max_tokens: 1500  // 2.5x más largo
temperature: 0.8  // Más creatividad
```
- Respuestas de ~1,000-1,500 palabras
- Análisis profundo con múltiples perspectivas
- Ejemplos más detallados
- Estrategias paso a paso completas

**Impacto:** Pro users pueden obtener respuestas **2.5x más completas** en un solo mensaje.

---

### 3. **Contexto de Conversación Ampliado**

**Free/Basic:**
- Historial: Últimos **10 mensajes**
- Contexto limitado

**Pro:**
- Historial: Últimos **20 mensajes**
- Contexto completo de conversaciones largas
- Hanna "recuerda" mejor tus objetivos y situación
- Seguimiento estratégico mejorado

**Beneficio:** Conversaciones más coherentes y personalizadas a largo plazo.

---

### 4. **Audio Mode (TTS) + Voice Input (STT)**

**Free:**
- ❌ Sin audio
- Solo texto

**Pro:**
- ✅ Text-to-Speech (Hanna lee respuestas en voz)
- ✅ Speech-to-Text (Habla en lugar de escribir)
- ✅ Voces españolas naturales
- ✅ Gratis (Web Speech API del navegador)

**Uso:** Escucha consejos mientras:
- Conduces al trabajo
- Estás en el gym
- Haces otras tareas

---

### 5. **Mensajes Ilimitados**

**Free:**
- 5 mensajes por día
- Límite se resetea cada 24 horas

**Pro:**
- ∞ Mensajes ilimitados
- Sin restricciones
- Consulta cuando necesites

---

### 6. **Personalización Completa**

**Free:**
- Configuración de tono básica
- Sistema prompt estándar

**Pro:**
- ✅ Configuración de tono avanzada
- ✅ Business Profile personalizado
- ✅ Custom instructions
- ✅ Hanna se adapta a tu negocio específico

---

## 💰 Análisis de Costos vs Valor

### Costos Operacionales por Usuario Pro

**Uso promedio mensual:**
- 100 mensajes/mes (3-4 mensajes/día)
- ~1,200 tokens por consulta (promedio)
- ~1,500 tokens por respuesta Pro

**Costo por usuario Pro:**
```
Input:  100 × 1,200 tokens = 120,000 tokens
Output: 100 × 1,500 tokens = 150,000 tokens

Claude 3.5 Sonnet pricing:
Input:  $3 / 1M tokens  → $0.36
Output: $15 / 1M tokens → $2.25

Total: $2.61 USD/mes por usuario Pro promedio
```

**Precio del plan Pro:** $15-20 USD/mes (estimado)

**Margen:** ~$12-17 USD/mes por usuario

---

### Optimización de Costos

**Estrategias implementadas:**

1. **API Keys separadas** por tipo de uso:
   - Workshop (conversiones)
   - SaaS Free (volumen alto, modelo económico)
   - SaaS Pro (calidad premium)
   - **Beneficio:** Tracking preciso de costos

2. **Límites inteligentes:**
   - Free: max_tokens 600 (reduce costos)
   - Pro: max_tokens 1500 (maximiza valor)
   - **Beneficio:** Optimización automática

3. **Historial balanceado:**
   - Free: 10 mensajes (reduce tokens enviados)
   - Pro: 20 mensajes (mejor contexto)
   - **Beneficio:** Costo-beneficio óptimo

4. **Modelo por plan:**
   - Free: GPT-4o-mini ($0.15/1M)
   - Pro: Claude 3.5 Sonnet ($3-15/1M)
   - **Beneficio:** 20x diferencia justifica upgrade

---

## 🚀 Funcionalidades Exclusivas Pro (Futuro)

### Fase 2 (Próximos 2 meses):
- [ ] Generación de podcasts (5-15 minutos)
- [ ] Exportar conversaciones a PDF
- [ ] Biblioteca de estrategias guardadas
- [ ] Templates personalizados

### Fase 3 (Próximos 6 meses):
- [ ] Análisis de competencia automático
- [ ] Generación de imágenes para contenido
- [ ] Integración con redes sociales
- [ ] Dashboard de métricas de negocio

---

## 📊 Comparativa Free vs Pro

| Feature | Free | Pro |
|---------|------|-----|
| **Modelo IA** | GPT-4o-mini | Claude 3.5 Sonnet ⭐ |
| **Mensajes/día** | 5 | Ilimitados ∞ |
| **Longitud respuesta** | ~400-600 palabras | ~1,000-1,500 palabras ⭐ |
| **Contexto** | 10 mensajes | 20 mensajes ⭐ |
| **Calidad análisis** | Buena | Excelente ⭐ |
| **Audio (TTS/STT)** | ❌ | ✅ ⭐ |
| **Diagramas Mermaid** | Básicos | Avanzados ⭐ |
| **Business Profile** | ❌ | ✅ ⭐ |
| **Personalización tono** | Básica | Completa ⭐ |
| **Soporte prioritario** | ❌ | ✅ ⭐ |
| **Podcasts generados** | ❌ | ✅ (Próximamente) ⭐ |

**Conclusión:** Pro users obtienen **10x más valor** por ~$15-20/mes.

---

## 🎯 Estrategia de Producto

### Objetivo:
**Hacer que Free users vean el valor de Pro tan claramente que el upgrade sea obvio.**

### Tácticas:

1. **Mostrar diferencias en UI:**
   - Badge "Pro" visible
   - Features bloqueados con CTA "Upgrade to Pro"
   - Comparación inline cuando Free user alcanza límites

2. **Gatillos de conversión:**
   - Al 3er mensaje: "Usuarios Pro obtienen análisis 2.5x más profundos"
   - Al 5to mensaje (límite): Modal de upgrade con beneficios
   - En modo audio: "Escucha respuestas mientras trabajas (Pro only)"

3. **Value demonstration:**
   - Free users ven respuestas "resumidas"
   - Nota: "Versión completa disponible en Pro (200% más insights)"

---

## 💡 Recomendaciones de Optimización Continua

### Monitoreo:
- [ ] Dashboard de costos por plan (OpenRouter analytics)
- [ ] Métricas de conversión Free → Pro
- [ ] NPS por plan (Free vs Pro)
- [ ] Tasa de retención Pro

### A/B Testing futuro:
- [ ] max_tokens óptimo para Pro (1500 vs 2000)
- [ ] temperature óptimo (0.8 vs 0.9)
- [ ] Límite Free (5 vs 3 mensajes/día)

### Costos variables:
- Si costos Pro superan $5/usuario → considerar GPT-4o
- Si uso promedio baja de 50 msg/mes → aumentar max_tokens a 2000
- Si conversión Free→Pro es alta (>10%) → mantener diferencia agresiva

---

## 🔐 Código de Implementación

### Backend (route.ts:292-298)
```typescript
const apiParams = messageLimit.plan === 'pro'
  ? {
      model: selectedModel, // Claude 3.5 Sonnet
      messages,
      temperature: 0.8,    // Más creatividad
      max_tokens: 1500,    // 2.5x más largo
    }
  : {
      model: selectedModel, // GPT-4o-mini
      messages,
      temperature: 0.7,
      max_tokens: 600,
    }
```

### Frontend (HannaDashboardClient.tsx:147-162)
```typescript
const historyLimit = profile.plan === 'pro' ? 20 : 10

const response = await fetch('/api/hanna/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: text.trim(),
    userId: user.id,
    toneConfig: toneConfig,
    history: messages.slice(-historyLimit).map(m => ({
      role: m.role,
      content: m.content,
    })),
  }),
})
```

---

**Última actualización:** Febrero 2026
**Próxima revisión:** Mensual (optimización basada en métricas reales)
