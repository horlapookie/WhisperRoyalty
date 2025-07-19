
import fs from 'fs';
import path from 'path';

const DATA_DIR = './data';
const PLAYER_DATA_FILE = path.join(DATA_DIR, 'player-data.json');
const BATTLE_DATA_FILE = path.join(DATA_DIR, 'battle-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class DataManager {
    constructor() {
        this.playerData = this.loadPlayerData();
        this.battleData = this.loadBattleData();
    }

    // Load player data from JSON file
    loadPlayerData() {
        try {
            if (fs.existsSync(PLAYER_DATA_FILE)) {
                const data = fs.readFileSync(PLAYER_DATA_FILE, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading player data:', error);
        }
        return {
            playerPokemon: {},
            playerStats: {},
            playerLeaderboard: {}
        };
    }

    // Save player data to JSON file
    savePlayerData() {
        try {
            const data = {
                playerPokemon: this.playerData.playerPokemon || {},
                playerStats: this.playerData.playerStats || {},
                playerLeaderboard: this.playerData.playerLeaderboard || {}
            };
            fs.writeFileSync(PLAYER_DATA_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving player data:', error);
        }
    }

    // Load battle data from JSON file
    loadBattleData() {
        try {
            if (fs.existsSync(BATTLE_DATA_FILE)) {
                const data = fs.readFileSync(BATTLE_DATA_FILE, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading battle data:', error);
        }
        return {
            battleLeaderboard: {},
            activeBattles: {}
        };
    }

    // Save battle data to JSON file
    saveBattleData() {
        try {
            const data = {
                battleLeaderboard: this.battleData.battleLeaderboard || {},
                activeBattles: this.battleData.activeBattles || {}
            };
            fs.writeFileSync(BATTLE_DATA_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving battle data:', error);
        }
    }

    // Player Pokemon methods
    getPlayerPokemon(playerId) {
        return this.playerData.playerPokemon[playerId] || [];
    }

    setPlayerPokemon(playerId, pokemon) {
        this.playerData.playerPokemon[playerId] = pokemon;
        this.savePlayerData();
    }

    addPlayerPokemon(playerId, pokemon) {
        if (!this.playerData.playerPokemon[playerId]) {
            this.playerData.playerPokemon[playerId] = [];
        }
        this.playerData.playerPokemon[playerId].push(pokemon);
        this.savePlayerData();
    }

    // Player Stats methods
    getPlayerStats(playerId) {
        return this.playerData.playerStats[playerId] || {
            wins: 0,
            losses: 0,
            battles: 0,
            pokemonCaught: 0,
            trainingCount: 0,
            gold: 0
        };
    }

    setPlayerStats(playerId, stats) {
        this.playerData.playerStats[playerId] = stats;
        this.savePlayerData();
    }

    savePlayerStats(playerId, stats) {
        this.playerData.playerStats[playerId] = stats;
        this.savePlayerData();
    }

    updatePlayerStats(playerId, updates) {
        const current = this.getPlayerStats(playerId);
        const updated = { ...current, ...updates };
        this.setPlayerStats(playerId, updated);
    }

    // Battle Leaderboard methods
    getBattleLeaderboard() {
        return this.battleData.battleLeaderboard || {};
    }

    setBattleLeaderboard(leaderboard) {
        this.battleData.battleLeaderboard = leaderboard;
        this.saveBattleData();
    }

    updateBattleLeaderboard(playerId, won) {
        const leaderboard = this.getBattleLeaderboard();
        if (!leaderboard[playerId]) {
            leaderboard[playerId] = { wins: 0, losses: 0, battles: 0 };
        }
        
        leaderboard[playerId].battles++;
        if (won) {
            leaderboard[playerId].wins++;
        } else {
            leaderboard[playerId].losses++;
        }
        
        this.setBattleLeaderboard(leaderboard);
    }

    // Auto-save every 30 seconds
    startAutoSave() {
        setInterval(() => {
            this.savePlayerData();
            this.saveBattleData();
        }, 30000);
    }
}

// Create global instance
export const dataManager = new DataManager();
