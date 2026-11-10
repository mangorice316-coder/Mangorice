using System;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    public enum NPCRole
    {
        MayaCommander,  // Flight Deck Leader: Tactical decisions, T-38 reflex tips
        LeoEngineer,    // Machine Bay: Airlock, 3D regolith printer, rover repair
        PriyaBotanist,  // Greenhouse Dome: Space strawberries, ARED gym coach
        SamScientist    // Science Lab: Crater ice analysis, DONKI space weather
    }

    /// <summary>
    /// Interactive Coworker NPC AI.
    /// Walks, works, interacts with dialogue bubbles, reacts to player choices,
    /// and teaches what astronauts do far from Earth.
    /// </summary>
    public class CoworkerNPC : MonoBehaviour
    {
        [Header("Identity")]
        public NPCRole role = NPCRole.MayaCommander;
        public string npcName = "Commander Maya";
        public string jobTitle = "Mission Lead";
        public Color suitStripeColor = Color.red;

        [Header("Dialogue Content")]
        [TextArea(2, 4)] public string defaultGreeting;
        [TextArea(2, 4)] public string currentMissionTip;
        [TextArea(2, 4)] public string reactionAfterChoiceA;
        [TextArea(2, 4)] public string reactionAfterChoiceB;

        [Header("Interaction Proximity")]
        public float interactionRange = 3.5f;
        public bool isPlayerNearby = false;

        public event Action<CoworkerNPC> OnTalkedTo;

        private void Start()
        {
            SetupRoleDefaults();
        }

        private void SetupRoleDefaults()
        {
            switch (role)
            {
                case NPCRole.MayaCommander:
                    npcName = "Commander Maya";
                    jobTitle = "Flight Director & Pilot";
                    suitStripeColor = new Color(0.9f, 0.2f, 0.2f);
                    defaultGreeting = "Welcome to Starbridge Alpha, Cadet! Check your life support telemetry and meet the crew before we cycle the airlock.";
                    currentMissionTip = "Remember: Out here, 240,000 miles from home, radio signals take time to travel. When alarms sound, trust your training and act fast!";
                    reactionAfterChoiceA = "Great call saving the greenhouse crops, Cadet! Priya is thrilled. Now suit up—we need to spacewalk outside to repair that fried dish!";
                    reactionAfterChoiceB = "Station shielding held strong against the solar flare. Good job keeping us safe, Commander.";
                    break;

                case NPCRole.LeoEngineer:
                    npcName = "Engineer Leo";
                    jobTitle = "Robotics & EVA Specialist";
                    suitStripeColor = new Color(0.95f, 0.55f, 0.1f);
                    defaultGreeting = "Hey Cadet! Need a wrench? I'm calibrating the Canadarm2 gears and our 3D regolith dirt-printer.";
                    currentMissionTip = "Never wait for Earth to ship spare parts. Scoop up space dirt, melt it in the printer, and 3D-print your own tools!";
                    reactionAfterChoiceA = "Whoa, that rover run was intense! We got tons of rocket fuel, but the motor needs 2 spare parts to overhaul.";
                    reactionAfterChoiceB = "Good steady driving. Scoop's chassis is clean and ready for the next crater dive.";
                    break;

                case NPCRole.PriyaBotanist:
                    npcName = "Dr. Priya";
                    jobTitle = "Botanist & Flight Surgeon";
                    suitStripeColor = new Color(0.2f, 0.85f, 0.4f);
                    defaultGreeting = "Hello Cadet! Smell that? Fresh space strawberries and radishes! Plants do two jobs: they clean our $CO_2$ and keep our spirits high!";
                    currentMissionTip = "Don't forget your 2 hours of gym time on the ARED machine today! Without gravity, bones lose density fast.";
                    reactionAfterChoiceA = "Thank you so much for protecting my greenhouse! Look at those berries bloom. Have a fresh salad for lunch!";
                    reactionAfterChoiceB = "The crops withered from the cold, but we are safe. Help me re-seed the hydroponic trays with recycled water.";
                    break;

                case NPCRole.SamScientist:
                    npcName = "Scientist Sam";
                    jobTitle = "Geologist & Weather Watcher";
                    suitStripeColor = new Color(0.2f, 0.6f, 0.95f);
                    defaultGreeting = "Cadet, look at this spectrometer reading! The dark craters at Shackleton hold billions of tons of water ice!";
                    currentMissionTip = "When water is split with electricity ($2H_2O \\rightarrow 2H_2 + O_2$), we get fresh oxygen to breathe AND liquid rocket fuel to fly to Mars!";
                    reactionAfterChoiceA = "Our water reserves are topped off! That water pillow in the walls absorbs cosmic radiation better than lead.";
                    reactionAfterChoiceB = "Rocket tanks are 100% full! The Mars Starship has green lights across the board.";
                    break;
            }
        }

        public string GetDialogueText()
        {
            var choiceMgr = ChoiceConsequenceManager.Instance;
            if (choiceMgr != null)
            {
                if (role == NPCRole.MayaCommander || role == NPCRole.PriyaBotanist)
                {
                    if (choiceMgr.HasMadeChoice("solar_flare_power", "OPTION_A")) return reactionAfterChoiceA;
                    if (choiceMgr.HasMadeChoice("solar_flare_power", "OPTION_B")) return reactionAfterChoiceB;
                }
                else if (role == NPCRole.LeoEngineer)
                {
                    if (choiceMgr.HasMadeChoice("rover_battery_overclock", "OPTION_A")) return reactionAfterChoiceA;
                    if (choiceMgr.HasMadeChoice("rover_battery_overclock", "OPTION_B")) return reactionAfterChoiceB;
                }
                else if (role == NPCRole.SamScientist)
                {
                    if (choiceMgr.HasMadeChoice("crater_water_use", "OPTION_A")) return reactionAfterChoiceA;
                    if (choiceMgr.HasMadeChoice("crater_water_use", "OPTION_B")) return reactionAfterChoiceB;
                }
            }

            return defaultGreeting;
        }

        private void Update()
        {
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null)
            {
                float dist = Vector3.Distance(transform.position, player.transform.position);
                isPlayerNearby = (dist <= interactionRange);

                if (isPlayerNearby)
                {
                    // Look towards player
                    Vector3 lookDir = player.transform.position - transform.position;
                    lookDir.y = 0;
                    if (lookDir.sqrMagnitude > 0.01f)
                    {
                        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(lookDir), Time.deltaTime * 4f);
                    }

                    if (Input.GetKeyDown(KeyCode.E))
                    {
                        TalkToPlayer();
                    }
                }
            }
        }

        public void TalkToPlayer()
        {
            OnTalkedTo?.Invoke(this);
            Debug.Log($"[{npcName}]: {GetDialogueText()}");
        }
    }
}

