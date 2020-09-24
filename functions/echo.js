exports.handler = async (event) => {
	const {text } = event.queryStringParameters;
	console.log(event)
	return {
		statusCode: 200,
		body: `You said ${text}`
	}
}