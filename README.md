# Daniel

Sitio personal y bitácora. El front es React. El API en Python sirve el tablero y guarda los mensajes de contacto.

## Arrancar

En una terminal, el API:

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

En otra, la web:

```bash
cd web
npm install
npm run dev
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173). La raíz redirige a `/es`. El inglés está en `/en`.

Pruebas del API, desde `api/` con el entorno activo:

```bash
pytest
```

## Cómo se actualiza

- Números del experimento: [`api/data/now.json`](api/data/now.json). El API lo lee en cada petición, así que basta con guardar el archivo y recargar la página. El front no se recompila.
- Apunte nuevo: un `.mdx` en `web/src/content/es/notes/` o `web/src/content/en/notes/`. El mismo `slug` en los dos idiomas los empareja. Si solo existe en uno, la otra lengua lo muestra y lo dice.
- Caso de ingeniería: el mismo patrón en `web/src/content/*/projects/`.
- Textos de la interfaz: [`web/src/i18n/es.json`](web/src/i18n/es.json) y [`web/src/i18n/en.json`](web/src/i18n/en.json).
- Correo y redes: [`web/src/data/profile.ts`](web/src/data/profile.ts). Un `href` vacío no se muestra.

Un bloque ` ```mermaid ` dentro de una nota se dibuja en la página. El código lleva resaltado de sintaxis.

Los mensajes del formulario quedan en `api/data/contact.sqlite3`, que no se versiona.
