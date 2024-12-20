import { bot } from '../lib/plugins.js';
import { addBan, getBanned, removeBan } from '../sql/ban.js';
import { isSudo } from '../sql/sudo.js';

bot(
	{
		pattern: 'ban ?(.*)',
		isPublic: false,
		desc: 'Ban a user from the bot',
		type: 'user',
	},
	async (message, match) => {
		const jid = await message.thatJid(match);
		if (isSudo(jid)) return mentions.send('_You cannot ban a sudo user_');
		return message.send(await addBan(jid.split('@')[0]), { mentions: [jid] });
	},
);

bot(
	{
		pattern: 'unban ?(.*)',
		isPublic: false,
		desc: 'Unban a user from the bot',
		type: 'user',
	},
	async (message, match) => {
		const jid = await message.thatJid(match);
		return message.send(await removeBan(jid.split('@')[0]), { mentions: [jid] });
	},
);

bot(
	{
		pattern: 'getban',
		isPublic: false,
		desc: 'Get a list of all banned users',
		type: 'user',
	},
	async message => {
		const bannedUsers = await getBanned();
		if (bannedUsers.length === 0) return message.send('_No banned users._');
		const mentions = bannedUsers.map(jid => `${jid}@s.whatsapp.net`);
		return message.send('*_Banned Users:_*\n' + bannedUsers.map((jid, index) => `${index + 1}. @${jid}`).join('\n'), { mentions });
	},
);
