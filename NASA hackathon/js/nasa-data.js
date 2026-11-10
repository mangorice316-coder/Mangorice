/**
 * Project Starbridge - NASA Science Data & Missions Engine
 * Based on authentic NASA Artemis, Moon to Mars, ISRU, and DONKI programs.
 */

const NASA_DATA = {
  // 10 Real NASA Secrets for Young Cadets
  CONCEPTS: [
    {
      id: "battery-blanket",
      title: "1. The 'Battery & Blanket' Problem",
      subtitle: "Solar Power vs. The 14-Day Lunar Freeze",
      icon: "☀️❄️",
      analogy: "Solar power is like your tablet battery AND winter coat combined! If you spend all electricity mining rocks during the day, the base freezes solid during the 14-day night.",
      science: "Lunar night lasts 14 Earth days with temperatures falling to -208°F (-130°C). Deep crater floors never see sunlight. Habitats require thermal survival loops and stored battery banks.",
      link: "https://www.nasa.gov/reference/moonbase-environment/"
    },
    {
      id: "fission-power",
      title: "2. The 'Suitcase Nuclear Battery'",
      subtitle: "NASA Kilopower & Fission Surface Power",
      icon: "⚡🔋",
      analogy: "What happens when a giant dust storm covers Mars for an entire month? You plug in NASA's 'Forever Battery'—a mini power plant the size of a trash can that glows with warm energy day and night!",
      science: "NASA's Kilopower project designs safe 10-40 kWe fission reactors that provide continuous electricity for at least 10 years regardless of weather, dust, or crater shadows.",
      link: "https://www.nasa.gov/exploration-systems-development-mission-directorate/fission-surface-power/"
    },
    {
      id: "water-pillow",
      title: "3. The 'Water Pillow' Radiation Shield",
      subtitle: "DONKI Solar Storms & Water Walls",
      icon: "🛡️💧",
      analogy: "Sometimes the Sun burps out invisible radiation zaps! Metal walls let those particles bounce around, but water acts like a thick pillow that catches them. When the alarm rings, pump your water tanks into the walls!",
      science: "Water is dense in hydrogen atoms, making it an extraordinary absorber of galactic cosmic rays (GCRs) and solar particle events (SPEs) monitored by NASA DONKI.",
      link: "https://api.nasa.gov/"
    },
    {
      id: "lazy-bones",
      title: "4. Why Bones Get 'Lazy' in Low Gravity",
      subtitle: "The 2-Hour Daily Gym Rule & ARED",
      icon: "🏋️🦴",
      analogy: "Floating feels effortless—so your bones and muscles say, 'Hey, we don't need all this muscle!' and start shrinking. If astronauts skip daily gym, their spacesuits feel heavy as lead tomorrow!",
      science: "In microgravity, astronauts lose 1% to 2% of bone density per month without rigorous resistive exercise. NASA uses the ARED machine to maintain bone and muscle mass on ISS and Gateway.",
      link: "https://www.nasa.gov/missions/station/iss-research/astronaut-exercise/"
    },
    {
      id: "crater-ice",
      title: "5. Mining Crater Ice to Make Rocket Fuel",
      subtitle: "In-Situ Resource Utilization (ISRU)",
      icon: "⛏️🚀",
      analogy: "Dark craters on the Moon are nature's deep-freezers! Send 'Scoop' the Rover to dig up frozen ice. Melt it to drink, or zap it with electricity to split it into fresh air AND rocket fuel for Mars!",
      science: "Permanently shadowed craters at the Lunar South Pole contain water ice. Splitting water (2 H2O -> 2 H2 + O2) produces liquid hydrogen and liquid oxygen: the most powerful chemical rocket propellant.",
      link: "https://www.nasa.gov/overview-in-situ-resource-utilization/"
    },
    {
      id: "moxie-tree",
      title: "6. The 'Mechanical Tree' on Mars",
      subtitle: "NASA's MOXIE Experiment",
      icon: "🌬️🌿",
      analogy: "Mars air is toxic carbon dioxide—stuff we breathe out! NASA invented a golden box called MOXIE that works like a mechanical tree. Feed it electricity, and it inhales Mars air and breathes out pure Oxygen!",
      science: "NASA's MOXIE experiment on the Perseverance rover successfully extracts oxygen from the 95% CO2 Martian atmosphere using high-temperature solid oxide electrolysis.",
      link: "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/"
    },
    {
      id: "regolith-printing",
      title: "7. Baking Space Dirt into 3D Tools",
      subtitle: "Regolith Sintering & Manufacturing",
      icon: "🧱🖨️",
      analogy: "Dropped your wrench into a crater? Don't wait 6 months for Earth to mail you a new one! Scoop up Moon dirt, melt it with a laser, and 3D-print shiny new tools and habitat roofs right on site!",
      science: "NASA develops technologies to sinter extraterrestrial regolith into construction materials, landing pads, and replacement parts, reducing launch payload mass from Earth.",
      link: "https://www.nasa.gov/technology/nasa-fosters-development-of-lunar-resource-seeking-technologies/"
    },
    {
      id: "space-salads",
      title: "8. Space Salads & Happy Astronauts",
      subtitle: "Bioregenerative Life Support (BLiSS)",
      icon: "🥗🍓",
      analogy: "Eating mushy freeze-dried pouches for 500 days makes anyone grumpy! Growing fresh lettuce, radishes, and strawberries in the greenhouse gives your crew a 'Happy Boost' and cleans the air!",
      science: "Fresh crops provide micronutrients that degrade in stored food. NASA BLiSS and Veggie experiments prove plant cultivation boosts crew psychology and recycling efficiency.",
      link: "https://techport.nasa.gov/projects/157839"
    },
    {
      id: "human-robot-team",
      title: "9. Humans + Robots Team Up",
      subtitle: "The Dangerous Chores Principle",
      icon: "👩‍🚀🦾",
      analogy: "Astronauts are super creative, but spacesuits take hours to put on and spacewalks are risky. Robot helpers don't breathe air or get tired! Smart Commanders send robots into danger first.",
      science: "NASA pairs EVAs with robotic arms like Canadarm2 and rovers. Robots perform exterior hazardous inspections and dust sweeping, preserving human endurance for high-level operations.",
      link: "https://www.nasa.gov/international-space-station/mobile-servicing-system/"
    },
    {
      id: "radio-delay",
      title: "10. The Speed of Light Radio Delay",
      subtitle: "Moon Calls vs. Mars Waiting Game",
      icon: "📡⏳",
      analogy: "Calling Earth from the Moon is like a normal phone call—answers arrive in 1 second! But on Mars, your radio message takes up to 20 minutes to reach Earth. When an emergency hits, YOU are the Commander!",
      science: "Radio travels at 300,000 km/s. Moon distance is ~384,400 km (1.3s delay). Mars distance varies from 55 million to 400 million km (4 to 24 minutes one way). Autonomous base control is essential.",
      link: "https://ntrs.nasa.gov/api/citations/20220013418/downloads/ASCEND-Communication%20Delays%2C%20Disruptions%2C%20and%20Blackouts%20for%20Crewed%20Mars%20Missions.pdf"
    }
  ],

  // 4 Worlds of Project Starbridge
  WORLDS: [
    {
      id: "earth",
      name: "World 1: Cadet Camp (Earth)",
      location: "NASA Johnson Space Center, Houston TX",
      radioDelay: "0 Seconds (Instant)",
      radioDelaySec: 0,
      gravity: "1.0 G (Earth)",
      description: "Master spacewalk mechanics in the Neutral Buoyancy Lab pool, fly T-38 reflex jets, and test water recycling systems.",
      badge: "cadet-wings",
      badgeName: "Junior Cadet Wings",
      bannerColor: "#3b82f6"
    },
    {
      id: "orbit",
      name: "World 2: Space Station & Lunar Gateway",
      location: "Low Earth Orbit & Lunar Orbit",
      radioDelay: "1.0 Second",
      radioDelaySec: 1,
      gravity: "0.0 G (Microgravity)",
      description: "Operate Canadarm2 to catch supply rockets, complete the 2-hour daily gym workout, and prepare the lunar lander.",
      badge: "orbital-crest",
      badgeName: "Orbital Navigator Crest",
      bannerColor: "#8b5cf6"
    },
    {
      id: "moon",
      name: "World 3: Shackleton Crater Moon Base",
      location: "Lunar South Pole (89.9°S)",
      radioDelay: "1.3 Seconds",
      radioDelaySec: 1.3,
      gravity: "0.166 G (1/6th Earth)",
      description: "Build your base on the rim of Shackleton Crater, survive 14-day freezing nights, flood shelter walls during solar storms, and drill crater ice for rocket fuel!",
      badge: "artemis-explorer",
      badgeName: "Artemis Lunar Base Builder",
      bannerColor: "#06d6a0"
    },
    {
      id: "mars",
      name: "World 4: Jezero Mars Settlement",
      location: "Jezero Crater, Mars (18.38°N 77.58°E)",
      radioDelay: "4 to 24 Minutes (Autonomy Required)",
      radioDelaySec: 15, // simulated gameplay delay
      gravity: "0.38 G (3/8th Earth)",
      description: "Survive Sol 214 dust storms, run the MOXIE mechanical tree to produce oxygen, grow food in the BLiSS Greenhouse, and unite both worlds into an interplanetary space network!",
      badge: "mars-commander",
      badgeName: "Interplanetary Base Commander",
      bannerColor: "#ef476f"
    }
  ],

  // 7 Modular Base Rooms
  ROOMS: [
    {
      id: "hab-airlock",
      name: "Starter Hab & Airlock",
      icon: "🏠",
      unlockedWorld: "earth",
      costParts: 0,
      powerDemand: 10,
      description: "Life support core with crew sleeping bunks, water recycling loop, and spacesuit pressure closet.",
      outputs: "+20 O2, +20 Water per Sol",
      color: "#3b82f6"
    },
    {
      id: "solar-arm",
      name: "Solar Wing & Robot Arm",
      icon: "☀️🦾",
      unlockedWorld: "orbit",
      costParts: 2,
      powerDemand: -50, // Generates 50 kW
      description: "High-efficiency solar array with a Canadarm2-style robot arm to clear dust and unload cargo.",
      outputs: "+50 kW Daytime Power, Dust Protection",
      color: "#ffd166"
    },
    {
      id: "gym-medbay",
      name: "Low-Gravity Gym & Med-Bay",
      icon: "🏋️🩺",
      unlockedWorld: "orbit",
      costParts: 3,
      powerDemand: 15,
      description: "Houses the ARED space workout machine and medical suite to prevent bone density and muscle loss.",
      outputs: "Restores Astronaut Energy, Prevents Bone Shrinkage",
      color: "#8338ec"
    },
    {
      id: "water-shelter",
      name: "Water-Wall Storm Shelter",
      icon: "🛡️💧",
      unlockedWorld: "moon",
      costParts: 4,
      powerDemand: 10,
      description: "Double-walled bunker that floods with base water to absorb lethal solar storm radiation particles.",
      outputs: "100% Radiation Protection during Solar Flares",
      color: "#0077b6"
    },
    {
      id: "greenhouse",
      name: "Hydroponic Space Greenhouse",
      icon: "🌱🥗",
      unlockedWorld: "moon",
      costParts: 5,
      powerDemand: 25,
      description: "LED-illuminated plant chambers that convert crew breath and water into fresh salads and morale boosts.",
      outputs: "+15 Food Salads, +10 O2, +25% Morale",
      color: "#2ec4b6"
    },
    {
      id: "garage-moxie",
      name: "Rover Garage & MOXIE Factory",
      icon: "🚜🌬️",
      unlockedWorld: "mars",
      costParts: 6,
      powerDemand: 30,
      description: "Houses Scoop the Rover, the 3D Regolith Dirt-Printer, and the MOXIE CO2-to-Oxygen mechanical tree.",
      outputs: "+2 Spare Parts, +35 O2 on Mars",
      color: "#ff7b00"
    },
    {
      id: "fuel-depot",
      name: "Crater Fuel Depot & Launchpad",
      icon: "🚀⚡",
      unlockedWorld: "moon",
      costParts: 8,
      powerDemand: 40,
      description: "Cryogenic water-splitting electrolysis plant that fills rocket tanks with liquid hydrogen and liquid oxygen.",
      outputs: "+25 Rocket Fuel per Sol (Enables Mars Flight)",
      color: "#e63946"
    }
  ],

  // 4 Human Astronauts + 3 Robot Helpers
  CREW: [
    {
      id: "maya",
      name: "Commander Maya",
      title: "Jet Pilot & Mission Lead",
      avatar: "👩‍🚀",
      type: "human",
      bonus: "+5 Seconds on Emergency Reflex Timers; Boosts Crew Morale during storms",
      description: "Trained in supersonic NASA T-38 jets. Her calm focus under pressure gives you crucial extra seconds during alarms."
    },
    {
      id: "leo",
      name: "Engineer Leo",
      title: "EVA & Robotics Specialist",
      avatar: "🧑‍🔧",
      type: "human",
      bonus: "Uses 1 Less Spare Part for Repairs; Runs Robot Arm at Half Power",
      description: "Veteran of the Neutral Buoyancy Lab. Can fix any machine blindfolded and masterfully directs the Canadarm2."
    },
    {
      id: "priya",
      name: "Dr. Priya",
      title: "Botanist & Flight Surgeon",
      avatar: "👩‍🔬",
      type: "human",
      bonus: "2x Greenhouse Crop Yield; Accelerates Daily Gym Energy Recovery",
      description: "Expert in space agriculture and microgravity physiology. Keeps both the plants and astronauts thriving."
    },
    {
      id: "sam",
      name: "Scientist Sam",
      title: "Geologist & Weather Watcher",
      avatar: "🧑‍🚀",
      type: "human",
      bonus: "2x Science Stars; Gives 1-Sol Early Warning on DONKI Solar Flares",
      description: "Obsessed with lunar crater ice cores and space weather radars. Knows when the Sun is about to burp radiation."
    },
    {
      id: "reach",
      name: "Reach the Giant Robot Arm",
      title: "Canadarm2 Roof Servicer",
      avatar: "🦾",
      type: "robot",
      bonus: "Cleans solar panel dust & catches cargo pods without risking human EVAs",
      description: "Mounted on the habitat roof. Consumes 5 kW of electricity instead of food and oxygen."
    },
    {
      id: "scoop",
      name: "Scoop the Ice Rover",
      title: "Autonomous Dark Crater Miner",
      avatar: "🛞",
      type: "robot",
      bonus: "Drives into freezing -400°F dark craters to extract water ice & regolith",
      description: "Equipped with heated tank treads and a diamond core drill. Never fears the cold."
    },
    {
      id: "buzz",
      name: "Buzz the Scout Drone",
      title: "Mars Atmospheric Helicopter",
      avatar: "🚁",
      type: "robot",
      bonus: "Flies ahead in thin Mars air to detect incoming Sol dust storms",
      description: "Twin-rotor scout inspired by NASA's Ingenuity helicopter. Eyes in the Martian sky."
    }
  ],

  // 10-Mission Campaign Sequence
  MISSIONS: [
    {
      id: 1,
      title: "Mission 1: Houston Pool & Jet Bootcamp",
      world: "earth",
      briefing: "Welcome Cadet! Before launching to the stars, you must earn your wings in Houston. Complete the Neutral Buoyancy Lab spacewalk and test your 10-second emergency reflexes in the T-38 Jet!",
      objective: "Complete Neutral Buoyancy Pool EVA Mini-Game and pass the T-38 Reflex Drill.",
      miniGame: "pool-eva",
      reward: "Earn Cadet Wings & Unlock Room 2 (Solar Wing & Robot Arm)",
      badge: "cadet-wings"
    },
    {
      id: 2,
      title: "Mission 2: Space Station Gym & Robot Catch",
      world: "orbit",
      briefing: "You've reached Low Earth Orbit on the ISS! A Cygnus resupply rocket is tumbling toward the station. Use Canadarm2 to grapple it, and make sure your crew completes their 2-hour workout!",
      objective: "Catch the cargo ship using Canadarm2 and maintain 100% crew physical strength.",
      miniGame: "canadarm-catch",
      reward: "Unlock Room 3 (Low-Gravity Gym) & Room 4 (Water Shelter)",
      badge: "orbital-crest"
    },
    {
      id: 3,
      title: "Mission 3: Touchdown at Shackleton Crater",
      world: "moon",
      briefing: "Touchdown at the Moon's South Pole! The Artemis lander has delivered your Starter Habitat. Deploy your solar panels on the crater rim and establish your water recycling loop.",
      objective: "Build Starter Hab & Solar Wing on the Moon grid, and survive 2 Sols with positive oxygen.",
      reward: "Artemis Pioneer Badge & 5 Spare Parts",
      badge: "artemis-explorer"
    },
    {
      id: 4,
      title: "Mission 4: The 14-Day Lunar Freeze",
      world: "moon",
      briefing: "The Sun has dipped below the crater rim. You have entered the 14-day freezing lunar night (-208°F)! Power generation drops to zero unless you manage battery reserves or start the Fission Battery.",
      objective: "Survive the Lunar Night emergency by balancing battery heat without losing oxygen.",
      reward: "Unlock the Kilopower Nuclear Battery & 40 kW base power",
      badge: "night-survivor"
    },
    {
      id: 5,
      title: "Mission 5: The Water-Wall Sun Storm",
      world: "moon",
      briefing: "🚨 NASA's DONKI satellite detects an X-Class Solar Flare erupting right toward the Moon! High-energy radiation will arrive in minutes. You must flood your shelter walls with water!",
      objective: "Make the 10-second reflex choice to flood the shelter walls and protect the crew.",
      reward: "Solar Shield Master Badge & Unlock Room 5 (Greenhouse)",
      badge: "sun-shield"
    },
    {
      id: 6,
      title: "Mission 6: Ice Miners of the Dark Crater",
      world: "moon",
      briefing: "Base water tanks are running low! Take manual control of Scoop the Rover and drive deep into the pitch-black shadows of Shackleton Crater to drill pure water ice.",
      objective: "Complete the Crater Ice Rover Mini-Game and extract at least 50L of water ice.",
      miniGame: "rover-mining",
      reward: "Unlock Room 7 (Crater Fuel Depot & Launchpad)",
      badge: "ice-miner"
    },
    {
      id: 7,
      title: "Mission 7: Fuel the Mars Rocket!",
      world: "moon",
      briefing: "To reach Mars, we need 100 units of liquid rocket fuel. Use your electrolysis fuel plant to split melted crater ice into liquid hydrogen and oxygen propellant!",
      objective: "Produce 100 units of Rocket Fuel and complete pre-flight checks for the Mars Starship.",
      reward: "Mars Transit Authorization & Launch to Jezero Crater",
      badge: "rocket-fueler"
    },
    {
      id: 8,
      title: "Mission 8: Welcome to Mars & The Mechanical Tree",
      world: "mars",
      briefing: "Touchdown on Mars! The air is 95% carbon dioxide. You cannot breathe outside. Activate MOXIE—the Mechanical Tree—to inhale Martian air and breathe out pure oxygen!",
      objective: "Complete the MOXIE CO2 Electrolysis Mini-Game to produce breathable oxygen.",
      miniGame: "moxie-squeeze",
      reward: "Unlock Room 6 (Rover Garage & MOXIE Factory on Mars)",
      badge: "moxie-master"
    },
    {
      id: 9,
      title: "Mission 9: Sol 214 — The Giant Red Dust Storm",
      world: "mars",
      briefing: "🚨 Buzz the Drone spots a towering red dust wall rolling over the horizon! Earth is 18 minutes away—Mission Control cannot help in time! You have 10 seconds to make the commander's call!",
      objective: "Resolve the Sol 214 Dust Storm reflex emergency without causing a fatal blackout.",
      reward: "Mars Weather Hero Badge & +20 Regolith Bricks",
      badge: "dust-hero"
    },
    {
      id: 10,
      title: "Mission 10: Interplanetary Commander Finale",
      world: "mars",
      briefing: "The ultimate test! Coordinate your Moon Fuel Depot and your Mars City concurrently. Balance rocket fuel exports, greenhouse food production, and crew health across both worlds!",
      objective: "Sustain both bases for 3 Sols with 100% crew health, >50 Fuel, and >50 Food.",
      reward: "Official NASA Junior Astronaut & Base Commander Gold Diploma!",
      badge: "mars-commander"
    }
  ],

  // Real NASA DONKI Simulated Events
  DONKI_EVENTS: [
    {
      type: "CME",
      title: "Coronal Mass Ejection (CME)",
      severity: "High",
      speed: "1,200 km/s",
      warning: "Plasma shockwave heading toward the Moon. Recommend flooding water shelter walls immediately!"
    },
    {
      type: "FLARE_M",
      title: "M5.4 Class Solar Flare",
      severity: "Moderate",
      speed: "Speed of Light",
      warning: "Radio blackouts across high frequencies. Temporary 5-minute telemetry disruption."
    },
    {
      type: "SPE",
      title: "Solar Energetic Particle Event",
      severity: "Extreme",
      speed: "Relativistic Protons",
      warning: "High radiation flux detected. Recall all EVA astronauts and rovers to habitat bulkheads."
    },
    {
      type: "QUIET",
      title: "Solar Quiet Baseline",
      severity: "Low",
      speed: "Normal solar wind (400 km/s)",
      warning: "Space weather is optimal. Ideal conditions for extended rover mining and outdoor spacewalks."
    }
  ]
};

window.NASA_DATA = NASA_DATA;

