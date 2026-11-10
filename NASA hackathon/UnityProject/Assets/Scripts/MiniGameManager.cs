using System;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    public enum MiniGameType
    {
        PoolEVA,
        CanadarmCatch,
        RoverMining,
        MoxieSqueezer
    }

    /// <summary>
    /// Coordinates the 4 junior astronaut mini-games across Earth, Orbit, Moon, and Mars.
    /// </summary>
    public class MiniGameManager : MonoBehaviour
    {
        public static MiniGameManager Instance { get; private set; }

        public event Action<MiniGameType> OnMiniGameStarted;
        public event Action<MiniGameType, bool> OnMiniGameEnded;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void StartMiniGame(MiniGameType type)
        {
            OnMiniGameStarted?.Invoke(type);
        }

        public void FinishMiniGame(MiniGameType type, bool success)
        {
            if (success)
            {
                var res = ResourceManager.Instance;
                switch (type)
                {
                    case MiniGameType.PoolEVA:
                        res.ModifyMorale(15f);
                        break;
                    case MiniGameType.CanadarmCatch:
                        res.AddSpareParts(2);
                        break;
                    case MiniGameType.RoverMining:
                        res.ModifyWater(50f);
                        break;
                    case MiniGameType.MoxieSqueezer:
                        res.ModifyOxygen(40f);
                        break;
                }
            }

            OnMiniGameEnded?.Invoke(type, success);
        }
    }
}

