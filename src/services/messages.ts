import { Green, StoreDb, serialize, execute, Serialize } from "lib";
import type { WASocket, BaileysEventMap } from "baileys";

export async function messagesUpsert(
	sock: WASocket,
	event: BaileysEventMap["messages.upsert"]
) {
	for (const message of event.messages) {
		if (!message || typeof message !== "object") continue;

		const msg = await serialize(sock, message);
		const protocol = msg?.message?.protocolMessage;

		if (protocol?.type === 0) {
			sock.ev.emit("messages.delete", {
				keys: [{ ...protocol.key }],
			});
		}

		await Promise.allSettled([_callCommands(msg), StoreDb.save(event)]);
	}
}

export async function messagesDelete(
	sock: WASocket,
	event: BaileysEventMap["messages.delete"]
) {
	Green("Message deleted:", event);
}

function _callCommands(msg: Serialize) {
	// const prefix = getprefix();
	// if (!!prefix && /\S/.test(prefix)) {
	// 	if (!msg.text.startsWith(prefix)) return;
	// }

	return execute(msg);
}
