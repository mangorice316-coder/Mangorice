using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Sound and procedural synthesizer for Project Starbridge in Unity.
    /// Synthesizes telemetry beeps, sirens, drilling rumble, and fanfare chimes.
    /// </summary>
    [RequireComponent(typeof(AudioSource))]
    public class AudioController : MonoBehaviour
    {
        public static AudioController Instance { get; private set; }

        private AudioSource audioSource;
        private bool isMuted = false;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            audioSource = GetComponent<AudioSource>();
        }

        public void PlayBeep(float frequency = 880f, float duration = 0.1f)
        {
            if (isMuted) return;
            AudioClip clip = CreateToneClip(frequency, duration);
            audioSource.PlayOneShot(clip, 0.4f);
        }

        public void PlayAlert()
        {
            if (isMuted) return;
            AudioClip clip = CreateSirenClip();
            audioSource.PlayOneShot(clip, 0.6f);
        }

        public void PlayChime()
        {
            if (isMuted) return;
            AudioClip clip = CreateToneClip(1046.5f, 0.35f); // C6
            audioSource.PlayOneShot(clip, 0.5f);
        }

        public void ToggleMute()
        {
            isMuted = !isMuted;
            audioSource.mute = isMuted;
        }

        private AudioClip CreateToneClip(float freq, float duration)
        {
            int sampleRate = 44100;
            int samples = Mathf.CeilToInt(sampleRate * duration);
            float[] data = new float[samples];

            for (int i = 0; i < samples; i++)
            {
                float t = (float)i / sampleRate;
                float envelope = 1f - (t / duration); // Linear fadeout
                data[i] = Mathf.Sin(2 * Mathf.PI * freq * t) * envelope;
            }

            AudioClip clip = AudioClip.Create("Tone_" + freq, samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        private AudioClip CreateSirenClip()
        {
            int sampleRate = 44100;
            float duration = 0.45f;
            int samples = Mathf.CeilToInt(sampleRate * duration);
            float[] data = new float[samples];

            for (int i = 0; i < samples; i++)
            {
                float t = (float)i / sampleRate;
                float freq = Mathf.Lerp(520f, 900f, Mathf.PingPong(t * 5f, 1f));
                data[i] = (Mathf.Sin(2 * Mathf.PI * freq * t) > 0f ? 1f : -1f) * 0.3f;
            }

            AudioClip clip = AudioClip.Create("Siren", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }
    }
}

