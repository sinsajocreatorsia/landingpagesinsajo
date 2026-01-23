# URGENTE: Instrucciones para Rotar Secrets Comprometidos

## Estado Actual: SECRETS EXPUESTOS

Los siguientes secrets fueron comprometidos al commitearse en `.env.production`:

| Secret | Estado | Acción Requerida |
|--------|--------|------------------|
| OPENAI_API_KEY | COMPROMETIDO | Rotar INMEDIATAMENTE |
| CAL_API_KEY | COMPROMETIDO | Rotar INMEDIATAMENTE |
| WEB3FORMS_KEY | COMPROMETIDO | Rotar en las próximas 24h |
| SUPABASE_ANON_KEY | EXPUESTO (público por diseño) | Verificar RLS policies |

---

## PASO 1: Rotar OpenAI API Key (URGENTE)

1. Ve a: https://platform.openai.com/api-keys
2. Haz clic en tu API key actual
3. Haz clic en "Revoke" para desactivarla
4. Crea una nueva API key
5. Copia la nueva key

### Actualizar en Vercel:
```bash
# O desde el dashboard de Vercel:
# Project → Settings → Environment Variables
# Edita OPENAI_API_KEY con el nuevo valor
```

---

## PASO 2: Rotar Cal.com API Key

1. Ve a: https://app.cal.com/settings/developer/api-keys
2. Elimina la key actual: `cal_live_350077be849eee9bb9a66b40ddec940f`
3. Crea una nueva API key
4. Actualiza en Vercel → Environment Variables → CAL_API_KEY

---

## PASO 3: Rotar Web3Forms Key

1. Ve a: https://web3forms.com/
2. Inicia sesión en tu cuenta
3. Genera un nuevo Access Key
4. Actualiza en Vercel → Environment Variables → WEB3FORMS_KEY

---

## PASO 4: Verificar Supabase RLS (Row Level Security)

La `SUPABASE_ANON_KEY` es pública por diseño, pero debes asegurar que RLS esté activo:

1. Ve a: https://supabase.com/dashboard/project/diiqsossuiuymexdocrg
2. Ve a Database → Tables → leads
3. Verifica que RLS esté ENABLED
4. Revisa las policies:

```sql
-- Policy recomendada para leads (solo insertar desde cliente)
CREATE POLICY "Allow insert for everyone"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Bloquear SELECT/UPDATE/DELETE para anon
CREATE POLICY "Block select for anon"
ON public.leads
FOR SELECT
TO anon
USING (false);
```

---

## PASO 5: Limpiar Historial de Git (OPCIONAL pero recomendado)

Para eliminar completamente los secrets del historial:

```bash
# Instalar git-filter-repo
pip install git-filter-repo

# Limpiar archivos del historial
git filter-repo --path .env --invert-paths
git filter-repo --path .env.local --invert-paths
git filter-repo --path .env.production --invert-paths

# Force push (CUIDADO - esto reescribe la historia)
git push origin --force-with-lease --all
```

**NOTA:** Si otros colaboradores tienen copias del repo, deberán hacer `git fetch --all && git reset --hard origin/main`

---

## PASO 6: Actualizar .gitignore

Asegúrate de que `.gitignore` incluya:

```gitignore
# Environment files
.env
.env.local
.env.production
.env*.local

# Vercel
.vercel
```

---

## Verificación Post-Rotación

Después de rotar todos los secrets:

1. Haz un nuevo deploy en Vercel
2. Verifica que el chat funciona (OpenAI)
3. Verifica que el calendario funciona (Cal.com)
4. Verifica que el formulario de leads funciona (Web3Forms)
5. Verifica que los leads se guardan en Supabase

---

## Mejores Prácticas para el Futuro

1. **NUNCA** commitear archivos `.env*` con secrets reales
2. Usar Vercel Environment Variables para TODOS los secrets
3. Crear `.env.example` con valores placeholder
4. Los archivos `.env.production` solo deben tener variables `NEXT_PUBLIC_*` que son públicas por diseño
5. Revisar PRs para asegurar que no incluyan secrets

---

**Última actualización:** 2024-12-22
**Estado:** Pendiente de acción del usuario
