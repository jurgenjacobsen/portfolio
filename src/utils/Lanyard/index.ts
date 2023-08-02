import constants from "./constants";

/**
 * Plugin that lets you interact with Lanyard API using fetch or WebSocket.
 */
export default async function Lanyard(options: {
	userID: string;
	socket?: boolean;
}): Promise<WebSocket | object | void> {
	const supportsWebSocket = "WebSocket" in window || "MozWebSocket" in window;
	const { apiBase, webSocketBase } = constants;

	if (options.socket === true && supportsWebSocket === false)
		throw new Error("Browser doesn't support WebSocket connections.");

	// Throw error if no options are set.
	if (!options || Object.keys(options).length === 0)
		throw new Error("No options were provided.");
	// Throw error if userID is missing.
	else if (options.userID === undefined)
		throw new Error("Missing `userID` option.");
	// Use websocket if socket option is set to true.
	else if (options.socket === true) {
		const socket = new WebSocket(webSocketBase);

		let key = "subscribe_to_id";
		if (typeof options.userID === "object") key = "subscribe_to_ids";

		socket.addEventListener("open", () => {
			// Subscribe to ID(s)
			socket.send(
				JSON.stringify({
					op: 2,
					d: {
						[key]: options.userID,
					},
				}),
			);

			// Send heartbeat every 30 seconds
			setInterval(() => {
				socket.send(
					JSON.stringify({
						op: 3,
					}),
				);
			}, 30000);
		});

		return socket;
	}
	// Send a single request if userID is a string
	else if (typeof options.userID === "string") {
		const data = await fetch(`${apiBase}/users/${options.userID}`).then((res) =>
			res.json(),
		);

		return data;
	}
}
