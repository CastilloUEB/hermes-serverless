const { EspacioFisicoSchedule } = require("../src/espacioFisicoClient.js")

// TODO: Aquí debería haber console.logs para debuggear :(
exports.handler = async (event, context) => {
  const { id, role } = JSON.parse(event.body);
	const schedule = new EspacioFisicoSchedule(id, role)
	return {
		statusCode: 200,
		body: JSON.stringify({ 
			scheduleMatrix: await schedule.getMatrix()
		})
	}
}
