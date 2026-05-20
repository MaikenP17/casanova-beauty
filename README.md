# Casanova Beauty — Setup

## Paso 1: Extraer los frames del video

Instala ffmpeg si no lo tienes: https://ffmpeg.org/download.html

Desde la raíz del proyecto, ejecuta en terminal:

**Windows (PowerShell o CMD):**
```bash
ffmpeg -i "Recursos/Video Scroll.mp4" -vf "fps=24,scale=1280:-1" -q:v 5 "Recursos/frames/frame_%04d.jpg"
```

Esto generará ~169 archivos JPG en `Recursos/frames/`.

## Paso 2: Verificar y actualizar TOTAL_FRAMES

Si el número de frames generado es diferente a 169, actualiza la constante en `js/scroll-video.js`:

```js
const TOTAL_FRAMES = 169; // ← cambia este número si es diferente
```

Para contar los frames generados (PowerShell):
```powershell
(Get-ChildItem "Recursos\frames\*.jpg").Count
```

## Paso 3: Abrir en el navegador

Abre `index.html` en **Google Chrome**.

> **Notas:**
> - Las fuentes de Google Fonts requieren conexión a internet.
> - Sin los frames extraídos, el hero mostrará un fondo rosa sólido (el resto del sitio funciona igual).
> - El carrito persiste en localStorage entre sesiones.
