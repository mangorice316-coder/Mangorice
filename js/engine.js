/**
 * Project Starbridge - Core Base & Resource Simulation Engine
 * Manages 7 Modular Rooms, Resource Balances, Crew Superpowers, and 10-Second Emergencies
 */

class StarbridgeEngine {
  constructor() {
    this.worldIndex = 0; // 0: Earth, 1: Orbit, 2: Moon, 3: Mars
    this.sol = 1;
    this.isNight = false;
    this.radioDelay = 0; // seconds

    // Resources
    this.resources = {
      power: 60,
      maxPower: 100,
      water: 80,
      maxWater: 150,
      oxygen: 90,
      maxOxygen: 150,
      food: 40,
      maxFood: 100,
      fuel: 10,
      maxFuel: 120,
      parts: 8,
      morale: 95
    };

    // 7 Modular Base Rooms
    this.rooms = [
      { id: "hab-airlock", name: "Starter Hab & Airlock", built: true, flooded: false, eco: false, x: 280, y: 170, w: 120, h: 80, icon: "🏠", assigned: "maya" },
      { id: "solar-arm", name: "Solar Wing & Robot Arm", built: false, flooded: false, eco: false, x: 120, y: 170, w: 110, h: 80, icon: "☀️🦾", assigned: "reach" },
      { id: "gym-medbay", name: "Low-G Gym & Med-Bay", built: false, flooded: false, eco: false, x: 280, y: 60, w: 120, h: 75, icon: "🏋️🩺", assigned: "leo" },
      { id: "water-shelter", name: "Water Storm Shelter", built: false, flooded: false, eco: false, x: 440, y: 170, w: 120, h: 80, icon: "🛡️💧", assigned: "sam" },
      { id: "greenhouse", name: "Hydroponic Greenhouse", built: false, flooded: false, eco: false, x: 280, y: 285, w: 120, h: 75, icon: "🌱🥗", assigned: "priya" },
      { id: "garage-moxie", name: "Rover Garage & MOXIE", built: false, flooded: false, eco: false, x: 440, y: 285, w: 120, h: 75, icon: "🚜🌬️", assigned: "scoop" },
      { id: "fuel-depot", name: "Fuel Depot & Launchpad", built: false, flooded: false, eco: false, x: 600, y: 170, w: 120, h: 80, icon: "🚀⚡", assigned: null }
    ];

    // Crew Status
    this.crew = NASA_DATA.CREW.map(c => ({
      ...c,
      hearts: 5,
      tired: false,
      assignedRoom: null
    }));

    // Emergency Reflex Timer
    this.activeEmergency = null;
    this.emergencyTimer = 0;
    this.emergencyInterval = null;

    // Badges Earned
    this.badgesEarned = new Set(["cadet-wings"]);
  }

  getCurrentWorld() {
    return NASA_DATA.WORLDS[this.worldIndex];
  }

  setWorld(idx) {
    this.worldIndex = Math.max(0, Math.min(NASA_DATA.WORLDS.length - 1, idx));
    const world = this.getCurrentWorld();
    this.radioDelay = world.radioDelaySec;

    // Adjust base conditions based on world
    if (this.worldIndex === 0) { // Earth
      this.rooms[0].built = true;
    } else if (this.worldIndex === 1) { // Orbit
      this.rooms[0].built = true;
      this.rooms[1].built = true;
    } else if (this.worldIndex === 2) { // Moon
      this.rooms[0].built = true;
      this.rooms[1].built = true;
      this.rooms[2].built = true;
      this.rooms[3].built = true;
    } else if (this.worldIndex === 3) { // Mars
      this.rooms.forEach((r, i) => { if (i < 6) r.built = true; });
    }
  }

  buildRoom(roomId) {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return { success: false, msg: "Room not found." };
    if (room.built) return { success: false, msg: "Room already constructed." };

    const def = NASA_DATA.ROOMS.find(r => r.id === roomId);
    let cost = def ? def.costParts : 3;

    // Leo Engineer Superpower: -1 Spare Part cost
    const hasLeo = this.crew.find(c => c.id === 'leo' && c.hearts > 1);
    if (hasLeo && cost > 1) cost -= 1;

    if (this.resources.parts < cost) {
      window.spaceAudio.playAlert();
      return { success: false, msg: `Need ${cost} Spare Parts to 3D-print ${room.name}! Scoop or print more regolith.` };
    }

    this.resources.parts -= cost;
    room.built = true;
    window.spaceAudio.playChime();
    return { success: true, msg: `Constructed ${room.name}!` };
  }

  toggleEcoMode(roomId) {
    const room = this.rooms.find(r => r.id === roomId);
    if (room && room.built) {
      room.eco = !room.eco;
      window.spaceAudio.playClick();
      return room.eco;
    }
    return false;
  }

  toggleWaterWallShield() {
    const shelter = this.rooms.find(r => r.id === 'water-shelter');
    if (!shelter || !shelter.built) {
      return { success: false, msg: "Build Room 4 (Water Storm Shelter) first!" };
    }

    if (shelter.flooded) {
      // Drain water back into tanks
      shelter.flooded = false;
      this.resources.water = Math.min(this.resources.maxWater, this.resources.water + 30);
      window.spaceAudio.playClick();
      return { success: true, msg: "Water drained from shelter walls back to drinking tanks." };
    } else {
      // Flood walls with water
      if (this.resources.water < 30) {
        window.spaceAudio.playAlert();
        return { success: false, msg: "Need at least 30L of water in tanks to flood the radiation walls!" };
      }
      this.resources.water -= 30;
      shelter.flooded = true;
      window.spaceAudio.playChime();
      return { success: true, msg: "WATER-PILLOW ACTIVE! Storm shelter flooded with water to block solar radiation!" };
    }
  }

  assignCrew(crewId, roomId) {
    const member = this.crew.find(c => c.id === crewId);
    if (!member) return;

    // Unassign previous room
    this.rooms.forEach(r => {
      if (r.assigned === crewId) r.assigned = null;
    });

    if (roomId) {
      const room = this.rooms.find(r => r.id === roomId);
      if (room) {
        room.assigned = crewId;
        member.assignedRoom = roomId;
      }
    } else {
      member.assignedRoom = null;
    }
    window.spaceAudio.playClick();
  }

  advanceSol() {
    this.sol++;
    window.spaceAudio.playClick();

    // Day / Night cycle
    this.isNight = (this.sol % 2 === 0);

    // Baseline human consumption
    const humanCount = this.crew.filter(c => c.type === 'human').length;
    this.resources.oxygen -= humanCount * 3;
    this.resources.water -= humanCount * 2;
    this.resources.food -= humanCount * 2;

    // Room generation and power drain
    let netPower = 0;

    this.rooms.forEach(r => {
      if (!r.built) return;
      const def = NASA_DATA.ROOMS.find(d => d.id === r.id);
      if (!def) return;

      const ecoMultiplier = r.eco ? 0.4 : 1.0;

      // Power calculation
      if (r.id === 'solar-arm') {
        if (!this.isNight) {
          netPower += 55; // Solar generates during daytime
        }
      } else {
        netPower -= Math.max(0, def.powerDemand) * ecoMultiplier;
      }

      // Room specific benefits
      if (r.id === 'hab-airlock') {
        this.resources.oxygen += 15 * ecoMultiplier;
        this.resources.water += 10 * ecoMultiplier;
      }

      if (r.id === 'greenhouse' && !r.eco) {
        // Dr. Priya Botanist Superpower: 2x crops
        const priyaInGreenhouse = (r.assigned === 'priya');
        const cropYield = priyaInGreenhouse ? 20 : 10;
        this.resources.food = Math.min(this.resources.maxFood, this.resources.food + cropYield);
        this.resources.oxygen += 8;
        this.resources.morale = Math.min(100, this.resources.morale + 10);
      }

      if (r.id === 'gym-medbay' && !r.eco) {
        // Keeps crew strong
        this.crew.forEach(c => {
          c.hearts = Math.min(5, c.hearts + 1);
        });
        this.resources.morale = Math.min(100, this.resources.morale + 5);
      }

      if (r.id === 'garage-moxie' && !r.eco) {
        if (this.worldIndex === 3) { // On Mars: MOXIE makes O2
          this.resources.oxygen = Math.min(this.resources.maxOxygen, this.resources.oxygen + 25);
        }
        // 3D Printing regolith into spare parts
        this.resources.parts = Math.min(20, this.resources.parts + 1);
      }

      if (r.id === 'fuel-depot' && !r.eco) {
        if (this.resources.water >= 15) {
          this.resources.water -= 15;
          this.resources.fuel = Math.min(this.resources.maxFuel, this.resources.fuel + 20);
        }
      }
    });

    this.resources.power = Math.max(0, Math.min(this.resources.maxPower, this.resources.power + netPower));

    // Clamp resources to minimum 0
    this.resources.oxygen = Math.max(0, this.resources.oxygen);
    this.resources.water = Math.max(0, this.resources.water);
    this.resources.food = Math.max(0, this.resources.food);

    // Health / Morale penalty if resources depleted
    if (this.resources.power === 0 || this.resources.oxygen === 0 || this.resources.food === 0) {
      this.resources.morale = Math.max(10, this.resources.morale - 25);
      this.crew.forEach(c => {
        if (c.type === 'human') c.hearts = Math.max(1, c.hearts - 1);
      });
      window.spaceAudio.playAlert();
    }

    return {
      sol: this.sol,
      isNight: this.isNight,
      netPower: netPower
    };
  }

  // 10-SECOND REFLEX EMERGENCY TRIGGERS
  triggerEmergency(emergencyData, onTimeout, onChoice) {
    if (this.emergencyInterval) {
      clearInterval(this.emergencyInterval);
    }

    // Commander Maya bonus: +5 extra seconds on reflex timers!
    const hasMaya = this.crew.find(c => c.id === 'maya' && c.hearts > 1);
    const duration = hasMaya ? emergencyData.baseSeconds + 5 : emergencyData.baseSeconds;

    this.activeEmergency = emergencyData;
    this.emergencyTimer = duration;
    window.spaceAudio.playAlert();

    this.emergencyInterval = setInterval(() => {
      this.emergencyTimer--;
      if (this.emergencyTimer <= 0) {
        clearInterval(this.emergencyInterval);
        this.emergencyInterval = null;
        this.activeEmergency = null;
        if (onTimeout) onTimeout();
      }
    }, 1000);
  }

  resolveEmergencyChoice(choiceIndex, callback) {
    if (this.emergencyInterval) {
      clearInterval(this.emergencyInterval);
      this.emergencyInterval = null;
    }
    const emergency = this.activeEmergency;
    this.activeEmergency = null;

    if (emergency && emergency.choices && emergency.choices[choiceIndex]) {
      const choice = emergency.choices[choiceIndex];
      // Apply consequences
      if (choice.apply) {
        choice.apply(this);
      }
      window.spaceAudio.playClick();
      if (callback) callback(choice);
    }
  }

  // Visual Base Schematic Renderer on Canvas
  renderBaseCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 760;
    canvas.height = 380;

    // Background terrain based on world
    if (this.worldIndex === 0) { // Earth NBL Pool
      ctx.fillStyle = '#0369a1';
    } else if (this.worldIndex === 1) { // Orbit
      ctx.fillStyle = '#020617';
    } else if (this.worldIndex === 2) { // Moon
      ctx.fillStyle = '#0f172a';
    } else { // Mars
      ctx.fillStyle = '#2a110a';
    }
    ctx.fillRect(0, 0, 760, 380);

    // Draw connecting umbilical tunnels between rooms
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 10;
    ctx.beginPath();
    // Central hub tunnels
    ctx.moveTo(180, 210); ctx.lineTo(340, 210);
    ctx.moveTo(340, 210); ctx.lineTo(500, 210);
    ctx.moveTo(500, 210); ctx.lineTo(660, 210);
    ctx.moveTo(340, 100); ctx.lineTo(340, 210);
    ctx.moveTo(340, 210); ctx.lineTo(340, 320);
    ctx.moveTo(500, 210); ctx.lineTo(500, 320);
    ctx.stroke();

    // Render each 7-room module
    this.rooms.forEach(r => {
      ctx.save();
      if (r.built) {
        // Room Body
        ctx.fillStyle = r.flooded ? '#0284c7' : '#1e293b';
        ctx.strokeStyle = r.flooded ? '#38bdf8' : '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y, r.w, r.h, 12);
        ctx.fill();
        ctx.stroke();

        // Water wall indicator
        if (r.flooded) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.beginPath();
          ctx.roundRect(r.x + 4, r.y + 4, r.w - 8, r.h - 8, 8);
          ctx.fill();
        }

        // Room Icon & Name
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.fillText(r.icon, r.x + 10, r.y + 32);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(r.name, r.x + 10, r.y + 54);

        // Assigned Crew Avatar
        if (r.assigned) {
          const crewMember = this.crew.find(c => c.id === r.assigned);
          if (crewMember) {
            ctx.fillStyle = '#ffd166';
            ctx.font = '16px sans-serif';
            ctx.fillText(crewMember.avatar, r.x + r.w - 24, r.y + 24);
          }
        }

        // Eco-mode indicator
        if (r.eco) {
          ctx.fillStyle = '#f59e0b';
          ctx.font = '9px Space Mono';
          ctx.fillText("ECO-MODE", r.x + 10, r.y + 70);
        }
      } else {
        // Unbuilt slot
        ctx.strokeStyle = '#334155';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y, r.w, r.h, 12);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '11px Space Mono';
        ctx.fillText(`+ BUILD`, r.x + 30, r.y + 40);
        ctx.fillText(r.name.slice(0, 14), r.x + 10, r.y + 60);
      }
      ctx.restore();
    });
  }
}

window.StarbridgeEngine = StarbridgeEngine;

