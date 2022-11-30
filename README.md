# hermes-serverless

[![Netlify Status](https://api.netlify.com/api/v1/badges/fd4687c7-1741-4419-84b0-c3fcfb9514ca/deploy-status)](https://app.netlify.com/sites/hermes-serverless/deploys)

Una función serverless para consultar información de horarios de la U. El Bosque.

### Para los curiosos

Dejaré un par de recursos útiles para aquellos que estén leyendo esto, por si desean tomar este ćodigo y modificarlo para crear un servicio web similar o simplemente quieren aprender un poco sobre Node.js, el consumo de APIs y las migraciones de Deno a NodeJS.

**Paquetes de node utilizados**

- [dayjs]() | La mejor librería para tratar con datos temporales (Fechas, horas, etc.)

- [typescript]() | Paquete que viene con el compilador oficial de TypeScript

- [tsc-watch]() | Un comando que, ante cualquier cambio en el código fuente, compila tu código y lo corre (Vean [el vídeo de Fazt](https://www.youtube.com/c/FaztCode) para saber como configurarlo)

Como escribí todo el código fuente de Hermes en TypeScript con librerías del [repositorio de módulos de terceros](https://deno.land/x) y [la librería estándar](https://deno.land/std@0.161.0?doc) de Deno, tuve que seguir [un tutorial](https://www.youtube.com/watch?v=eU-p-jreAN4) del muy querido [Fazt](https://www.youtube.com/c/FaztCode) en el que enseña algunas configuraciones básicas de `tsc` (El compilador de TypeScript), para así no tener que cambiarme a JavaScript y, además, no tener que usar la sintaxis de importación de módulos `paquete = require("paquete")` de CommonJS (La sintaxis que Node soporta por defecto) que tanto detesto (VETE A LA M$%#"! COMMONJS).

- [xmldom](https://github.com/xmldom/xmldom) | Para la clase [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)

- [jsdom](https://github.com/jsdom/jsdom) | Para la interface [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) y su método [.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

- [axios]() | Para la API [.fetch()](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

Dado que este servicio utiliza principios web para los que Deno SÍ tiene reemplazos oficiales, pero NodeJS no, tuve que utilizar varias librerías escritas en JavaScript puro que imitan la funcionalidad de estos principios web.

**Lecturas recomendadas**

- [Docs de Typescript sobre la tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#examples), por si no te llevas bien con la configuración de `tsc`

- [Un artículo que compara a node-fetch y axios](https://masteringjs.io/tutorials/axios/vs-fetch), pues así podrás tomar tus propias conclusiones sobre si usar node-fetch (Polyfill) o Axios (Librería, que según yo es más chimbita)

- [Docs de dayjs referentes a su uso con TypeScript](https://day.js.org/docs/en/installation/typescript), pues me sirvieron bastante cuando al `tsc` le empezó a dar la chiripiorca por la sintaxis que estaba utilizando para importar la librería

- [Docs de Axios referentes a la estructura de las respuestas/responses](https://axios-http.com/docs/res_schema), por si tienes dudas sobre cómo es el esquema de los datos que estás consumiendo

- [Guía de estilo oficial de Deno](https://deno.land/manual@v1.27.2/references/contributing/style_guide), porque me gustan más las prácticas de calidad del código de la comunidad de Deno.

- [Identificadores de licencia SPDX](https://spdx.org/licenses/), porque son los identificadores que el `package.json` utiliza para identificar bajo que licencia está el paquete/proyecto que estamos creando (En este caso es `Unlicense`)

---

### Easter Egg

Utilicé un convertidor de cURL a Dart para generar el código que utilizaremos para hacer peticiones HTTP a acá desde la aplicación de Flutter. Échenle un vistazo:

```bash
# esto es bash

curl -X POST \
    'http://localhost:8888/.netlify/functions/getEspacioFisicoSchedule?' \
    -H 'content-type: application/json' \
    -d '{
    "id": "0745996",
    "role": "estudiante"
  }'
```

```dart
/* Esto es Dart */
import 'package:http/http.dart' as http;

void main() async {
  var headers = {
    'content-type': 'application/json',
  };

  var data = '{\n  "id": "0745996",\n  "role": "student"\n}';

  var url = Uri.parse('http://localhost:8888/.netlify/functions/getEspacioFisicoSchedule?');
  var res = await http.post(url, headers: headers, body: data);
  if (res.statusCode != 200) throw Exception('http.post error: statusCode= ${res.statusCode}');
  print(res.body);
}
```

Felicitaciones a los azares de la vida por hacer que mi laptop se apagara y me borrara el `package.json`, que a su vez hizo que fallara el despliegue en Netlify :V, pero yo soy más inteligente porque restauré el `package.json` a partir del `package-lock.json` :D Ahora por puro orgullo y por picoso pondré el badge de que el despliegue salió bien.
