# Plan Completo de Configuración - Workshop Sinsajo

## Estado Actual
- Landing page: https://www.screatorsai.com/academy/workshop
- Página de éxito: https://www.screatorsai.com/academy/workshop/success
- Stripe: Modo TEST configurado
- Dominio: screatorsai.com apuntando a Vercel

---

## PASO 1: Configurar Webhook de Stripe (URGENTE)

### 1.1 Acceder al Dashboard de Stripe
1. Ve a https://dashboard.stripe.com
2. Asegúrate de estar en **modo Test** (toggle arriba a la derecha)
3. En el menú lateral, ve a **Developers → Webhooks**

### 1.2 Crear el Endpoint del Webhook
1. Click en **"Add endpoint"**
2. En **Endpoint URL** ingresa:
   ```
   https://www.screatorsai.com/api/webhooks/stripe
   ```
3. En **Description** (opcional): "Workshop payment notifications"
4. Click en **"Select events"**

### 1.3 Seleccionar los Eventos
Marca estos eventos:
- [x] `checkout.session.completed` - Cuando se completa un pago
- [x] `checkout.session.expired` - Cuando expira una sesión
- [x] `payment_intent.payment_failed` - Cuando falla un pago
- [x] `charge.refunded` - Cuando se hace un reembolso

5. Click en **"Add endpoint"**

### 1.4 Copiar el Webhook Secret
1. Una vez creado, click en el endpoint
2. En la sección **"Signing secret"**, click en **"Reveal"**
3. Copia el valor que empieza con `whsec_...`

### 1.5 Añadir a Vercel
1. Ve a https://vercel.com/dashboard
2. Selecciona el proyecto **sinsajo-v2** (o landingpagesinsajo)
3. Ve a **Settings → Environment Variables**
4. Añade una nueva variable:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: (pega el whsec_... que copiaste)
   - **Environment**: Production, Preview, Development
5. Click en **Save**
6. Ve a **Deployments** y click en **"Redeploy"** en el último deployment

### 1.6 Probar el Webhook
1. En Stripe Dashboard → Webhooks → tu endpoint
2. Click en **"Send test webhook"**
3. Selecciona `checkout.session.completed`
4. Click en **"Send test webhook"**
5. Deberías ver respuesta 200 OK

---

## PASO 2: Configurar Resend para Emails

### 2.1 Crear Cuenta en Resend (si no tienes)
1. Ve a https://resend.com
2. Regístrate con tu email
3. Verifica tu cuenta

### 2.2 Añadir y Verificar Dominio
1. En el dashboard de Resend, ve a **Domains**
2. Click en **"Add Domain"**
3. Ingresa: `screatorsai.com`
4. Resend te mostrará registros DNS que necesitas añadir

### 2.3 Configurar DNS en Hostinger
Ve a Hostinger → Dominios → screatorsai.com → Zona DNS

Añade estos registros (Resend te dará los valores exactos):

| Tipo | Nombre | Valor |
|------|--------|-------|
| TXT | @ | v=spf1 include:_spf.resend.com ~all |
| CNAME | resend._domainkey | (valor de Resend) |
| CNAME | r | (valor de Resend) |

**Nota**: Los valores exactos los proporciona Resend en su dashboard.

### 2.4 Verificar Dominio
1. Después de añadir los registros DNS, espera 5-10 minutos
2. En Resend, click en **"Verify"**
3. El estado debería cambiar a "Verified"

### 2.5 Obtener API Key
1. En Resend, ve a **API Keys**
2. Click en **"Create API Key"**
3. Nombre: "Sinsajo Workshop"
4. Permission: "Sending access"
5. Copia la API key (empieza con `re_...`)

### 2.6 Añadir a Vercel
1. Ve a Vercel → Settings → Environment Variables
2. Añade/actualiza:
   - **Name**: `RESEND_API_KEY`
   - **Value**: (tu API key)
3. Añade también:
   - **Name**: `FROM_EMAIL`
   - **Value**: `Sinsajo Creators <noreply@screatorsai.com>`
4. Redeploy el proyecto

---

## PASO 3: Crear Comunidad de WhatsApp

### 3.1 Crear Grupo/Comunidad
1. Abre WhatsApp en tu teléfono
2. Ve a **Comunidades** o crea un **Grupo nuevo**
3. Nombre sugerido: "IA para Empresarias Exitosas - Workshop"
4. Añade una descripción y foto

### 3.2 Obtener Link de Invitación
1. Abre el grupo/comunidad
2. Toca el nombre del grupo (arriba)
3. Scroll hasta **"Invitar mediante enlace"**
4. Toca **"Copiar enlace"**
5. El link se ve así: `https://chat.whatsapp.com/XXXXXXXXXX`

### 3.3 Actualizar el Código
Edita el archivo `app/academy/workshop/success/page.tsx`:

Línea 23, cambia:
```typescript
const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/REPLACE_WITH_YOUR_LINK'
```
Por:
```typescript
const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/TU_LINK_REAL'
```

### 3.4 Commit y Deploy
```bash
cd sinsajo-v2
git add app/academy/workshop/success/page.tsx
git commit -m "feat: add WhatsApp community link"
git push
```

---

## PASO 4: Verificar Variables de Entorno en Vercel

Asegúrate de tener TODAS estas variables en Vercel:

### Variables Requeridas
| Variable | Valor | Estado |
|----------|-------|--------|
| `NEXT_PUBLIC_BASE_URL` | `https://www.screatorsai.com` | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | tu_url_supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu_anon_key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | tu_service_role_key | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | ✅ |
| `STRIPE_SECRET_KEY` | `sk_test_...` | ✅ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | ⏳ Paso 1 |
| `RESEND_API_KEY` | `re_...` | ⏳ Paso 2 |
| `FROM_EMAIL` | `Sinsajo Creators <noreply@screatorsai.com>` | ⏳ Paso 2 |
| `OPENROUTER_API_KEY` | `sk-or-...` | ✅ (para chat) |

---

## PASO 5: Test End-to-End (Modo Test)

### 5.1 Hacer un Pago de Prueba
1. Ve a https://www.screatorsai.com/academy/workshop
2. Click en "Reservar Mi Lugar"
3. Usa la tarjeta de prueba:
   - Número: `4242 4242 4242 4242`
   - Fecha: cualquier fecha futura (ej: 12/28)
   - CVC: cualquier 3 dígitos (ej: 123)
   - Email: tu email real para recibir el correo
4. Completa el pago

### 5.2 Verificar Flujo Completo
Después del pago, verifica:

- [ ] Redirige a página de éxito con confetti
- [ ] Muestra logo animado de Sinsajo
- [ ] Muestra detalles del workshop
- [ ] Muestra botón de WhatsApp
- [ ] Muestra formulario de onboarding
- [ ] Llega email de confirmación (si Resend está configurado)

### 5.3 Verificar en Supabase
1. Ve a Supabase → Table Editor
2. Verifica tabla `workshop_registrations`:
   - Nuevo registro con tus datos
   - `payment_status` = 'completed'
3. Verifica tabla `email_logs` (si existe):
   - Registro del email enviado

### 5.4 Verificar en Stripe
1. Ve a Stripe Dashboard → Payments
2. Deberías ver el pago de prueba
3. Ve a Webhooks → tu endpoint → Events
4. Deberías ver evento `checkout.session.completed`

---

## PASO 6: Pasar a Producción

### 6.1 Obtener Claves LIVE de Stripe
1. En Stripe Dashboard, cambia de Test a **Live** (toggle arriba)
2. Ve a Developers → API Keys
3. Copia:
   - `pk_live_...` (Publishable key)
   - `sk_live_...` (Secret key)

### 6.2 Crear Webhook LIVE
1. En modo Live, ve a Developers → Webhooks
2. Repite el Paso 1.2-1.4 para crear un webhook en producción
3. Copia el nuevo `whsec_...`

### 6.3 Actualizar Variables en Vercel
Actualiza en Vercel (Settings → Environment Variables):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`
- `STRIPE_SECRET_KEY` → `sk_live_...`
- `STRIPE_WEBHOOK_SECRET` → nuevo `whsec_...`

### 6.4 Redeploy
1. Ve a Vercel → Deployments
2. Click en "Redeploy" con el último commit
3. Espera que termine

### 6.5 Test Final en Producción
1. Haz un pago real pequeño (o pide a alguien)
2. Verifica que todo funcione
3. Procesa un reembolso de prueba si es necesario

---

## Checklist Final

### Configuración Técnica
- [ ] Webhook de Stripe creado y funcionando
- [ ] STRIPE_WEBHOOK_SECRET en Vercel
- [ ] Dominio verificado en Resend
- [ ] RESEND_API_KEY en Vercel
- [ ] FROM_EMAIL configurado
- [ ] Link de WhatsApp actualizado

### Pruebas Completadas
- [ ] Pago de prueba exitoso
- [ ] Email de confirmación recibido
- [ ] Registro creado en Supabase
- [ ] Página de éxito muestra todo correctamente
- [ ] Formulario de onboarding funciona
- [ ] Botón de WhatsApp funciona

### Producción
- [ ] Claves LIVE de Stripe configuradas
- [ ] Webhook LIVE creado
- [ ] Pago real de prueba exitoso
- [ ] Listo para lanzamiento

---

## Soporte

Si tienes problemas:
1. Revisa los logs en Vercel (Deployments → Functions)
2. Revisa eventos en Stripe Dashboard → Webhooks
3. Revisa tabla `email_logs` en Supabase

¿Necesitas ayuda? Contacta: sales@screatorsai.com
