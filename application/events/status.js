import {
    Events,
    EmbedBuilder
} from "discord.js";

import { client } from "../../app.js";

export default {
    data: Events.MessageCreate,

    async execute(message) {
        if (message.author.bot) return;
        if (message.content !== ".status") return;

        const uptime = process.uptime();

        const dias = Math.floor(uptime / 86400);
        const horas = Math.floor((uptime % 86400) / 3600);
        const minutos = Math.floor((uptime % 3600) / 60);
        const segundos = Math.floor(uptime % 60);

        const totalMembers = client.guilds.cache.reduce(
            (acc, guild) => acc + guild.memberCount,
            0
        );

        const memory = process.memoryUsage();

        const guildList = [...client.guilds.cache.values()]
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((guild, index) =>
                `${index + 1}. **${guild.name}** \`${guild.memberCount.toLocaleString()} membros\``
            )
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📊 Status do Bot")
            .addFields(
                {
                    name: "🌍 Servidores",
                    value: `${client.guilds.cache.size}`,
                    inline: true
                },
                {
                    name: "👥 Usuários",
                    value: totalMembers.toLocaleString(),
                    inline: true
                },
                {
                    name: "🤖 Usuários em cache",
                    value: client.users.cache.size.toLocaleString(),
                    inline: true
                },
                {
                    name: "📡 Ping",
                    value: `${client.ws.ping} ms`,
                    inline: true
                },
                {
                    name: "🧠 Heap",
                    value: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                    inline: true
                },
                {
                    name: "💾 RSS",
                    value: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
                    inline: true
                },
                {
                    name: "⚙️ Arquitetura",
                    value: process.arch,
                    inline: true
                },
                {
                    name: "🖥️ Plataforma",
                    value: process.platform,
                    inline: true
                },
                {
                    name: "🟢 Node.js",
                    value: process.version,
                    inline: true
                },
                {
                    name: "📚 Discord.js",
                    value: "v14",
                    inline: true
                },
                {
                    name: "📂 Canais",
                    value: client.channels.cache.size.toLocaleString(),
                    inline: true
                },
                {
                    name: "😀 Emojis",
                    value: client.guilds.cache
                        .reduce((acc, guild) => acc + guild.emojis.cache.size, 0)
                        .toLocaleString(),
                    inline: true
                },
                {
                    name: "🎭 Cargos",
                    value: client.guilds.cache
                        .reduce((acc, guild) => acc + guild.roles.cache.size, 0)
                        .toLocaleString(),
                    inline: true
                },
                {
                    name: "⏱ Uptime",
                    value: `${dias}d ${horas}h ${minutos}m ${segundos}s`
                },
                {
                    name: "📂 Lista de Servidores",
                    value: guildList || "Nenhum servidor encontrado."
                }
            )
            .setFooter({
                text: `PID ${process.pid}`
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });
    }
};