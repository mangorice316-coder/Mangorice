/**
 * Project Starbridge - Campaign & 2-Player Co-Op Engine
 * Manages 10-Mission Campaign Progression and Houston vs Base Commander Co-Op Mode
 */

class CampaignManager {
  constructor(engine) {
    this.engine = engine;
    this.currentMissionId = 1;
    this.completedMissions = new Set();
    
    // Co-op state
    this.coopModeActive = false;
    this.houstonUplinkQueue = [];
    this.radioLog = [];
  }

  getCurrentMission() {
    return NASA_DATA.MISSIONS.find(m => m.id === this.currentMissionId);
  }

  startMission(missionId) {
    this.currentMissionId = missionId;
    const mission = this.getCurrentMission();
    if (!mission) return;

    // Set world according to mission
    if (mission.world === 'earth') this.engine.setWorld(0);
    else if (mission.world === 'orbit') this.engine.setWorld(1);
    else if (mission.world === 'moon') this.engine.setWorld(2);
    else if (mission.world === 'mars') this.engine.setWorld(3);

    window.spaceAudio.playRadioSquelch();
    return mission;
  }

  completeCurrentMission() {
    const mission = this.getCurrentMission();
    if (!mission) return null;

    this.completedMissions.add(mission.id);
    this.engine.badgesEarned.add(mission.badge);
    window.spaceAudio.playFanfare();

    // Check unlocks
    if (mission.id === 1) {
      this.engine.rooms[1].built = true; // Solar arm
    } else if (mission.id === 2) {
      this.engine.rooms[2].built = true; // Gym
      this.engine.rooms[3].built = true; // Water shelter
    } else if (mission.id === 5) {
      this.engine.rooms[4].built = true; // Greenhouse
    } else if (mission.id === 6) {
      this.engine.rooms[6].built = true; // Fuel depot
    } else if (mission.id === 8) {
      this.engine.rooms[5].built = true; // MOXIE factory
    }

    const nextId = mission.id + 1;
    if (nextId <= 10) {
      this.currentMissionId = nextId;
      this.startMission(nextId);
      return { completed: mission, next: this.getCurrentMission(), allDone: false };
    } else {
      return { completed: mission, next: null, allDone: true };
    }
  }

  // ==========================================
  // 2-PLAYER CO-OP MODE (HOUSTON + COMMANDER)
  // ==========================================
  initCoopMode() {
    this.coopModeActive = true;
    this.radioLog = [
      { sender: "Houston", text: "Project Starbridge Co-Op Uplink established. Radio delay synced to current orbit.", time: "T+00:00" }
    ];
  }

  sendHoustonSupplyDrop(supplyType, onDelivered) {
    const delay = this.engine.radioDelay; // seconds
    window.spaceAudio.playBeep(880, 0.1);

    const logEntry = {
      sender: "Houston",
      text: `📦 Launching ${supplyType} supply payload. ETA: ${delay.toFixed(1)}s (Speed of Light Delay)...`,
      time: `T+${this.engine.sol}`
    };
    this.radioLog.unshift(logEntry);

    setTimeout(() => {
      // Apply payload to base
      if (supplyType === 'oxygen') {
        this.engine.resources.oxygen = Math.min(this.engine.resources.maxOxygen, this.engine.resources.oxygen + 40);
      } else if (supplyType === 'water') {
        this.engine.resources.water = Math.min(this.engine.resources.maxWater, this.engine.resources.water + 40);
      } else if (supplyType === 'parts') {
        this.engine.resources.parts += 4;
      } else if (supplyType === 'food') {
        this.engine.resources.food = Math.min(this.engine.resources.maxFood, this.engine.resources.food + 30);
      }
      window.spaceAudio.playChime();
      this.radioLog.unshift({
        sender: "Base",
        text: `✅ ${supplyType.toUpperCase()} payload received and integrated into base grid!`,
        time: `T+${this.engine.sol}`
      });
      if (onDelivered) onDelivered(supplyType);
    }, delay * 1000);
  }

  sendHoustonGuidance(adviceText) {
    const delay = this.engine.radioDelay;
    window.spaceAudio.playRadioSquelch();

    this.radioLog.unshift({
      sender: "Houston",
      text: `📡 Transmission sent: "${adviceText}" (Radio in flight: ${delay.toFixed(1)}s)`,
      time: `T+${this.engine.sol}`
    });

    setTimeout(() => {
      window.spaceAudio.playBeep(1200, 0.08);
      this.radioLog.unshift({
        sender: "Houston [AUDIO]",
        text: `🔊 MESSAGE ARRIVED: "${adviceText}"`,
        time: `T+${this.engine.sol}`
      });
    }, delay * 1000);
  }
}

window.CampaignManager = CampaignManager;

