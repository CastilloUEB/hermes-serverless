const axios = require("axios")
const dayjs = require("dayjs")
const { DOMParser } = require("@xmldom/xmldom")
const { JSDOM } = require("jsdom")

class EspacioFisicoSchedule {

	#id = "";
	#role = "";
	#plaintext = "";
	#html = "";
	#objs = [];
	#matrix = [];

	// Esto se explica solo
	constructor(id, rol){
		this.#id = id;
		this.#role = rol;
	}

	// Petición de Axios
	#getScheduleHTML = async (id) => {
		const options = {
		  method: 'POST',
		  url: 'https://artemisa.unbosque.edu.co/serviciosacademicos/EspacioFisico/Interfas/funcionesEspaciosFisicosAsigandosReporte.php',
		  headers: {
		    'content-type': 'application/x-www-form-urlencoded',
		    Connection: 'keep-alive',
		    Accept: 'text/html, */*; q=0.01',
		    'Accept-Language': 'en-US',
		    Cookie: 'BIGipServerPool_Sala=436277420.20480.0000; PHPSESSID=0c18mdfsgj3lsn3rug7re3v2o4; TS01e1fbf3=017ce19861d13107e3d946e43807646dcdbf6c114afba1690139ecfb8ba84a312bcd9a66678079496a6b65315573f092d75bd7fc6792082f9883992a637561e8daf66b1504ce6ba153cd3140d39d106e9db5555294',
		    Origin: 'https://artemisa.unbosque.edu.co',
		    Referer: 'https://artemisa.unbosque.edu.co/serviciosacademicos/EspacioFisico/Interfas/EspaciosFisicosAsigandosReporte.php',
		    'SEC-CH-UA': '"Chromium";v="96", " Not A;Brand";v="99"',
		    'SEC-CH-UA-MOBILE': '?0',
		    'Sec-Fetch-Dest': 'empty',
		    'Sec-Fetch-Mode': 'cors',
		    'Sec-Fetch-Site': 'same-origin',
		    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.174 Safari/537.36',
		    'X-Requested-With': 'XMLHttpRequest'
		  },
		  data: {
		    actionID: 'consultardatos',
		    Fecha_ini: dayjs().subtract(dayjs().day()-1, "d").format("YYYY-MM-DD"),
		    Fecha_Fin: dayjs().day(7).format("YYYY-MM-DD"),
		    Num_Docente: `${this.#role==="docente" ? id : ""}`,
		    Num_Estudiante: `${this.#role==="estudiante" ? id : ""}`
		  }
		};

		await axios.request(options).then((res) => {
			this.#plaintext = res.data;
		}).catch((err) => {
			//TODO: This should throw an error and return a 50X error to the client
		  console.error(err);
		});
	}

	// Se convierte el resultado de la petición a Nodos de DOM
	#getScheduleHTMLAsDocument = () => {
		let scheduleHTMLDoc = new DOMParser().parseFromString(
			`
			<table>
				<tbody>
				${this.#plaintext}
				</tbody>
			</table>`,
			"text/html",
		);
		this.#html = scheduleHTMLDoc;
	 }

	// Se convierte el documento a un array de objetos
	#getScheduleDocumentAsObjectArray = () => {
		 let scheduleHTMLRows = new JSDOM(`${this.#html}`);
		 scheduleHTMLRows = scheduleHTMLRows.window.document.querySelectorAll("tr");
		 const schedule = [...scheduleHTMLRows].map((row) => (
			{ 
				classroom: row.childNodes[3].innerHTML,
				name: row.childNodes[6].innerHTML,
				date: row.childNodes[8].innerHTML,
				startHour: row.childNodes[10].innerHTML,
				endHour: row.childNodes[11].innerHTML
			}
		))
		this.#objs = schedule;
	}

	// Se convierte el array de objetos a matriz (Una tabla representada como matriz)
	#getObjectArrayAsMatrix = async () => {
	  const hours = getObjectsWithUniqueProperty(this.#objs, "startHour").map((obj)=>[obj.startHour]).sort();
	  hours.forEach((row)=>{
	    const filteredEventArray =
	      this.#objs.filter((event) => event.startHour === row[0])
	      .map((filteredEvent) => ({ 
	        name: filteredEvent.name,
	        day: dayjs(`${filteredEvent.date} 00:00`).day()-1 })
	      );
	    let sortedEventArray = [];
	    filteredEventArray.forEach((filteredEvent)=>{
	      sortedEventArray[filteredEvent.day] = filteredEvent.name;
	    });
	    row.push(
	      ...sortedEventArray
	    )
	  })
		this.#matrix = hours;
	}

	getMatrix = async () => {
		await this.#getScheduleHTML(this.#id)
			.then(() => this.#getScheduleHTMLAsDocument())
			.then(() => this.#getScheduleDocumentAsObjectArray())
			.then(() => this.#getObjectArrayAsMatrix());
		return this.#matrix;
	}

}

// función que toma un array de objetos 'arr' y solo devuelve los objetos cuyo valor 'prop' no esté repetido
let getObjectsWithUniqueProperty = (arr, prop) => {
  let uniqueBuffer = [];
  let uniqueResult = [];
  arr.forEach((arrItem) => {
    uniqueBuffer.find((buffer) => buffer === arrItem[prop]) == undefined
      ? uniqueBuffer.push(arrItem[prop])
      : uniqueBuffer.push(null);
  });
  uniqueBuffer.forEach((buffer) => {
    buffer === null
      ? null
      : uniqueResult.push(arr[uniqueBuffer.indexOf(buffer)]);
  });
  return uniqueResult;
};

module.exports = { EspacioFisicoSchedule };

// 60FPS by blksmiith
// a Fine Day (feat. Baledorf) by DXXDLY
