// ASTROCADE – BEYOND THE HORIZON
// OFFICIAL COMMISSION DIPLOMA GENERATOR: "CERTIFIED JUNIOR SPACE EXPLORER"
const AstrocadeCertificate = (() => {

  function render(canvas, cadetName = 'Cadet Leo', profileData = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas: 1200 x 850
    canvas.width = 1200;
    canvas.height = 850;

    const gradeInfo = profileData.gradeInfo || { level: 'Level 1', name: 'Junior Cadet', label: 'Grades 3–5' };
    const rankInfo = profileData.rankInfo || { name: 'Legendary Space Explorer', badge: '👑' };
    const totalScore = profileData.totalScore || 0;
    const completedCount = profileData.completedCount || 0;
    const moonDone = profileData.moonDone || 0;
    const marsDone = profileData.marsDone || 0;

    // 1. Dark outer parchment background
    ctx.fillStyle = '#050816';
    ctx.fillRect(0, 0, 1200, 850);

    // 2. Deep space starry inner canvas
    const innerGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    innerGrad.addColorStop(0, '#0a1638');
    innerGrad.addColorStop(0.5, '#0c1026');
    innerGrad.addColorStop(1, '#1b0d2b');
    ctx.fillStyle = innerGrad;
    ctx.fillRect(28, 28, 1144, 794);

    // Subtle star field in background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const starCoords = [
      [80, 100], [150, 220], [300, 90], [450, 180], [750, 120], [920, 95], [1080, 150],
      [110, 500], [220, 680], [380, 750], [820, 720], [1020, 660], [1120, 520],
      [180, 380], [980, 390], [600, 70], [600, 790]
    ];
    starCoords.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, (sx % 3 === 0) ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Double Gold & Cyan Tech Borders
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1120, 770);

    ctx.strokeStyle = '#42e8ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, 1096, 746);

    // Corner Tech Brackets
    const corners = [
      [40, 40], [1160, 40], [40, 810], [1160, 810]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Top Header Emblem & Agency Title
    ctx.textAlign = 'center';

    // ASETC Medallion Icon
    ctx.save();
    ctx.translate(600, 110);
    ctx.shadowColor = 'rgba(66, 232, 255, 0.6)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#0b1f48';
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#42e8ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = '32px sans-serif';
    ctx.fillText('🌌', 0, 11);
    ctx.restore();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 14px "Space Mono", monospace';
    ctx.fillText("ADVANCED SPACE EXPLORATION TRAINING CENTRE (ASETC) · 2040", 600, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Chakra Petch", sans-serif';
    ctx.fillText("CERTIFIED JUNIOR SPACE EXPLORER", 600, 226);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 16px "Inter", sans-serif';
    ctx.fillText("This official commission of astronautical merit & scientific exploration is conferred upon:", 600, 268);

    // 5. Cadet Callsign Name
    ctx.fillStyle = '#42e8ff';
    ctx.font = 'bold 46px "Chakra Petch", sans-serif';
    ctx.fillText(cadetName.toUpperCase(), 600, 326);

    // Decorative Gold Line
    const goldGrad = ctx.createLinearGradient(350, 0, 850, 0);
    goldGrad.addColorStop(0, 'rgba(255, 209, 102, 0)');
    goldGrad.addColorStop(0.5, 'rgba(255, 209, 102, 1)');
    goldGrad.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(350, 342, 500, 3);

    // 6. Citation Details
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px "Inter", sans-serif';
    ctx.fillText(
      `For exemplary mastery of astronautics across ${gradeInfo.level}: ${gradeInfo.name} (${gradeInfo.label}), demonstrating exceptional skill in:`,
      600, 380
    );
    ctx.fillText(
      "Lunar Frontier Outpost construction, closed-loop ECLSS life support, rover geological core drilling,",
      600, 406
    );
    ctx.fillText(
      "interplanetary Hohmann transfers, hypersonic Martian EDL descent, and Jezero Delta astrobiology sampling.",
      600, 432
    );

    // 7. Stats & Badges Grid
    // Rank Box
    ctx.fillStyle = 'rgba(11, 21, 48, 0.8)';
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(140, 470, 280, 95, 8);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText("RANK CONFERRED", 160, 495);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 18px "Chakra Petch", sans-serif';
    ctx.fillText(`${rankInfo.badge} ${rankInfo.name}`, 160, 526);
    ctx.fillStyle = '#42e8ff';
    ctx.font = '12px "Space Mono", monospace';
    ctx.fillText(`TOTAL SCORE: ${totalScore} PTS`, 160, 550);

    // Missions Box
    ctx.fillStyle = 'rgba(11, 21, 48, 0.8)';
    ctx.strokeStyle = '#42e8ff';
    ctx.beginPath();
    ctx.roundRect(460, 470, 280, 95, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText("EXPEDITIONS VERIFIED", 480, 495);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Chakra Petch", sans-serif';
    ctx.fillText(`🌕 MOON: ${moonDone}/6 · 🔴 MARS: ${marsDone}/6`, 480, 526);
    ctx.fillStyle = '#38d996';
    ctx.font = '12px "Space Mono", monospace';
    ctx.fillText(`COMPLETED: ${completedCount} / 12 MISSIONS`, 480, 550);

    // Curriculum Box
    ctx.fillStyle = 'rgba(11, 21, 48, 0.8)';
    ctx.strokeStyle = '#38d996';
    ctx.beginPath();
    ctx.roundRect(780, 470, 280, 95, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText("CURRICULUM LEVEL", 800, 495);
    ctx.fillStyle = '#38d996';
    ctx.font = 'bold 18px "Chakra Petch", sans-serif';
    ctx.fillText(`${gradeInfo.name}`, 800, 526);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Space Mono", monospace';
    ctx.fillText(`${gradeInfo.label} CURRICULUM`, 800, 550);

    // 8. 4 Medal Crest Badges
    const badgeCrests = [
      { icon: '🚀', title: 'CADET WINGS' },
      { icon: '🌕', title: 'LUNAR PIONEER' },
      { icon: '🔴', title: 'RED PLANET' },
      { icon: '👑', title: 'COMMANDER' }
    ];

    badgeCrests.forEach((b, idx) => {
      const bx = 330 + idx * 180;
      const by = 625;

      ctx.fillStyle = '#0b1530';
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.fillText(b.icon, bx, by + 8);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 9px "Space Mono", monospace';
      ctx.fillText(b.title, bx, by + 45);
    });

    // 9. Signatures Section
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 16px serif';
    ctx.fillText("Dr. Elena Vance", 180, 735);
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText("Flight Director, ASETC Mission Control", 180, 755);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(180, 720, 200, 1);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 16px serif';
    ctx.fillText("Commander Scott Kelly (Hon.)", 1020, 735);
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText("Chief Astronaut, Space Exploration Initiative", 1020, 755);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(820, 720, 200, 1);

    // 10. Required Scientific & Educational Disclaimer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillText(
      "DISCLAIMER: This is an educational game achievement certificate awarded for completing ASTROCADE – BEYOND THE HORIZON astronaut simulation challenges. Not an official NASA qualification.",
      600, 792
    );
  }

  function downloadPNG(canvas, cadetName = 'Cadet') {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ASTROCADE_Certified_Junior_Space_Explorer_${cadetName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function printCertificate() {
    window.print();
  }

  function openCertificateModal() {
    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    const cadetName = PlayerProfile.profile.name || 'Cadet Leo';
    const gradeInfo = PlayerProfile.getGradeInfo();
    const rankInfo = PlayerProfile.getRank();
    const totalScore = PlayerProfile.profile.totalScore || 0;
    const completedCount = PlayerProfile.profile.completedMissions.length;
    const moonDone = PlayerProfile.getMoonMissionsCompleted();
    const marsDone = PlayerProfile.getMarsMissionsCompleted();

    content.innerHTML = `
      <div style="padding:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:14px;">
          <div>
            <div class="eyebrow" style="color:var(--accent);">ASTROCADE – BEYOND THE HORIZON</div>
            <h2 style="font-family:var(--font-display);margin:2px 0;">Official Graduation Diploma</h2>
            <span style="font-size:12px;color:var(--silver);">Certified Junior Space Explorer Commission</span>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        <!-- Certificate Canvas Container -->
        <div style="width:100%;max-width:100%;overflow-x:auto;border-radius:10px;background:#050816;box-shadow:0 8px 32px rgba(0,0,0,0.6);margin-bottom:16px;">
          <canvas id="diplomaCanvas" style="display:block;max-width:100%;height:auto;margin:0 auto;border-radius:10px;"></canvas>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="font-size:11px;color:var(--silver);font-family:var(--font-mono);max-width:550px;">
            * Educational game achievement certificate. High-resolution 1200x850 render suitable for saving or framing.
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn" onclick="AstrocadeCertificate.downloadPNG(document.getElementById('diplomaCanvas'), '${cadetName}')">
              ⬇ Download PNG
            </button>
            <button class="btn primary" onclick="window.print()">
              🖨️ Print Diploma
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('on');

    setTimeout(() => {
      const canvas = document.getElementById('diplomaCanvas');
      if (canvas) {
        render(canvas, cadetName, {
          gradeInfo,
          rankInfo,
          totalScore,
          completedCount,
          moonDone,
          marsDone
        });
      }
    }, 50);
  }

  return {
    render,
    downloadPNG,
    printCertificate,
    openCertificateModal
  };
})();

// Legacy compatibility wrapper for CertificateGenerator
class CertificateGenerator {
  constructor(canvasId) {
    this.canvasId = canvasId;
  }
  render(cadetName) {
    const c = document.getElementById(this.canvasId);
    if (c) AstrocadeCertificate.render(c, cadetName, {
      gradeInfo: PlayerProfile.getGradeInfo(),
      rankInfo: PlayerProfile.getRank(),
      totalScore: PlayerProfile.profile.totalScore,
      completedCount: PlayerProfile.profile.completedMissions.length,
      moonDone: PlayerProfile.getMoonMissionsCompleted(),
      marsDone: PlayerProfile.getMarsMissionsCompleted()
    });
  }
}
window.CertificateGenerator = CertificateGenerator;
