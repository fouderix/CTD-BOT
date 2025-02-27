import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import Discord from "discord.js";
import InvitesTracker from "@androz2091/discord-invites-tracker";

import { log } from "$utils/log";
import { handleInteractionCreate } from "$events/interactionCreate";
import { connectDB } from "$db/init";
import { context } from "$context/context";
import { handleMemberAdd } from "$events/memberAdd";
import { handleMessageCreated } from "$events/message";
import { handleMemberRemove } from "$events/memberRemove";

const intents: Discord.IntentsString[] = [
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_INVITES",
    "GUILD_MEMBERS",
];
const client = new Discord.Client({
    intents: intents,
});
context.client = client;

const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true,
});
tracker.on("guildMemberAdd", handleMemberAdd);
client.on("guildMemberRemove", handleMemberRemove);

client.once("ready", async () => {
    log(`🤖 Bot ${client.user?.tag} successfully started 🚀`);
});

client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", handleMessageCreated);

connectDB().then(() => {
    client.login(process.env.BOT_TOKEN);
});
