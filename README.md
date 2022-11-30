# hermes-serverless

Una función serverless para consultar información de horarios de la U. El Bosque.

```bash
curl -X POST \
    'http://localhost:8888/.netlify/functions/getEspacioFisicoSchedule?' \
    -H 'content-type: application/json' \
    -d '{
    "id": "0745996",
    "role": "estudiante"
  }'
```

```dart
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
