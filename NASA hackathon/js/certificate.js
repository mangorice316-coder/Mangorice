/**
 * Project Starbridge - Official NASA Junior Astronaut Diploma Generator
 * Renders high-resolution printable / downloadable graduation certificate
 */

class CertificateGenerator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  render(cadetName = "Alex Starbridge", badges = ["cadet-wings", "orbital-crest", "artemis-explorer", "mars-commander"]) {
    if (!this.canvas) return;
    const ctx = this.ctx;

    // High resolution: 1200 x 850
    this.canvas.width = 1200;
    this.canvas.height = 850;

    // Background parchment tone
    ctx.fillStyle = '#060d1f';
    ctx.fillRect(0, 0, 1200, 850);

    // Deep starry inner canvas
    const innerGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    innerGrad.addColorStop(0, '#0a1638');
    innerGrad.addColorStop(0.5, '#0c1026');
    innerGrad.addColorStop(1, '#1a0b1e');
    ctx.fillStyle = innerGrad;
    ctx.fillRect(24, 24, 1152, 802);

    // Decorative Gold & NASA Blue Borders
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, 1128, 778);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, 1108, 758);

    // Corner Accents
    const corners = [
      [36, 36], [1164, 36], [36, 814], [1164, 814]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top NASA Meatball Emblem
    ctx.save();
    ctx.translate(600, 120);
    // Outer glow
    ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
    ctx.shadowBlur = 20;
    // Blue sphere
    ctx.fillStyle = '#0b3d91';
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.fill();
    // Red Artemis Vector
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-50, 20);
    ctx.lineTo(20, -35);
    ctx.lineTo(50, 20);
    ctx.stroke();
    // NASA text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("NASA", 0, 8);
    ctx.restore();

    // Certificate Titles
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 16px "Space Mono", monospace';
    ctx.fillText("NATIONAL AERONAUTICS AND SPACE ADMINISTRATION", 600, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Chakra Petch", sans-serif';
    ctx.fillText("OFFICIAL COMMISSION OF ASTRONAUTICAL MERIT", 600, 255);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText("This official certificate of graduation is proudly presented to:", 600, 305);

    // Cadet Name
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 44px "Chakra Petch", sans-serif';
    ctx.fillText(cadetName.toUpperCase(), 600, 365);

    // Underline gold bar
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(400, 385, 400, 4);

    // Citation Text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText("For exceptional mastery of orbital flight dynamics, Neutral Buoyancy Lab EVA repairs,", 600, 430);
    ctx.fillText("Lunar South Pole crater ice harvesting (ISRU), MOXIE atmospheric oxygen extraction,", 600, 460);
    ctx.fillText("and successfully founding a self-sustaining human outpost network between Earth, Moon, and Mars.", 600, 490);

    // Rank conferred
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px "Space Mono", monospace';
    ctx.fillText("RANK CONFERRED: JUNIOR ASTRONAUT & BASE COMMANDER", 600, 545);

    // Badges Display
    const badgeNames = [
      { id: "cadet-wings", label: "CADET WINGS", icon: "🚀" },
      { id: "orbital-crest", label: "ISS NAVIGATOR", icon: "🛰️" },
      { id: "artemis-explorer", label: "ARTEMIS BUILDER", icon: "🌕" },
      { id: "mars-commander", label: "MARS PIONEER", icon: "🪐" }
    ];

    badgeNames.forEach((b, idx) => {
      const bx = 330 + idx * 180;
      const by = 630;
      
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '26px sans-serif';
      ctx.fillText(b.icon, bx, by + 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px "Space Mono", monospace';
      ctx.fillText(b.label, bx, by + 50);
    });

    // Official Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 16px serif';
    ctx.fillText("Maya Lin", 240, 755);
    ctx.font = '12px "Space Mono", monospace';
    ctx.fillText("Commander Maya, Project Starbridge", 240, 775);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(240, 740, 200, 1);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 16px serif';
    ctx.fillText("Dr. Robert Sterling", 960, 755);
    ctx.font = '12px "Space Mono", monospace';
    ctx.fillText("Flight Director, NASA Mission Control", 960, 775);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(760, 740, 200, 1);
  }

  downloadPNG(cadetName = "Cadet") {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = `NASA_Junior_Astronaut_Certificate_${cadetName.replace(/\s+/g, '_')}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

window.CertificateGenerator = CertificateGenerator;

