import { Client, GatewayIntentBits, Events, GuildMember } from 'discord.js';
import { promises as fs, watch } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const { BANNISSEMENTS_DIR, GUILD_ID, DISCORD_TOKEN } = process.env;
if (!BANNISSEMENTS_DIR || !GUILD_ID || !DISCORD_TOKEN) {
    throw new Error('Les variables d\'environnement DISCORD_TOKEN, GUILD_ID et BANNISSEMENTS_DIR doivent être définies.');
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

let banLists: Map<string, Set<string>> = new Map();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBUG: boolean = process.env.DEBUG === 'true';

async function banMemberIfNecessary(member: GuildMember, reason: string): Promise<void> {
    if (banLists.get(reason)?.has(member.id)) {
        try {
            await member.ban({ reason: `[Spectrum] - ${reason}` });
            console.log(`Membre ${member.user.tag} banni pour : ${reason}`);
        } catch (error) {
            console.error(`Erreur en bannissant ${member.user.tag} : ${(error as Error).message}`);
        }
    }
}

async function loadBanLists(): Promise<void> {
    try {
        if (!BANNISSEMENTS_DIR) {
            throw new Error("Le dossier de bannissement n'est pas défini.");
        }
        const files = await fs.readdir(BANNISSEMENTS_DIR);
        const newBanLists: Map<string, Set<string>> = new Map();

        await Promise.all(files.map(async (file) => {
            const data = await fs.readFile(path.join(BANNISSEMENTS_DIR, file), 'utf8');
            const ids = new Set(data.split('\n').map(id => id.trim()).filter(Boolean));
            newBanLists.set(path.basename(file, path.extname(file)), ids);
        }));

        banLists = newBanLists;
        console.log('Listes de bannissement mises à jour.');
    } catch (error) {
        console.error(`Erreur lors du chargement des listes : ${(error as Error).message}`);
    }
}

async function checkAndBanExistingMembers(): Promise<void> {
    try {
        if (!GUILD_ID) {
            throw new Error("L'ID du serveur n'est pas défini.");
        }
        const guild = await client.guilds.fetch(GUILD_ID);
        const members = await guild.members.fetch({ withPresences: false });

        for (const member of members.values()) {
            for (const reason of banLists.keys()) {
                await banMemberIfNecessary(member, reason);
            }
        }
    } catch (error) {
        console.error(`Erreur lors de la vérification des membres : ${(error as Error).message}`);
    }
}

function watchBanListsDirectory(): void {
    if (!BANNISSEMENTS_DIR) {
        throw new Error("Le dossier de bannissement n'est pas défini.");
    }
    
    watch(BANNISSEMENTS_DIR, { encoding: 'utf8' }, async (eventType: string, filename: string | null) => {
        if (eventType === 'change' && filename) {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                console.log(`Fichier modifié : ${filename}`);
                await loadBanLists();
                await checkAndBanExistingMembers();
            }, 500);
        }
    });
}

client.once(Events.ClientReady, async () => {
    if (!client.user) {
        console.error("Client non connecté.");
        return;
    }
    console.log(`Connecté en tant que ${client.user.tag}`);
    await loadBanLists();
    await checkAndBanExistingMembers();
    watchBanListsDirectory();
    console.log('Surveillance du dossier activée.');
});

client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    console.log(`Nouveau membre : ${member.user.tag}`);
    for (const reason of banLists.keys()) {
        if (banLists.get(reason)?.has(member.id)) {
            await banMemberIfNecessary(member, reason);
            break;
        }
    }
});

client.login(DISCORD_TOKEN).catch(console.error);