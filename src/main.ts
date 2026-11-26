// Celestial Haven MVP v0.1 — placeholder boot (M0 scaffold only).
//
// PLACEHOLDER: no game logic yet (M1+). This file exists so `npm run build`
// and `npm run preview` have a real entry point. All art here is generated
// in code (shapes/colors, no external assets). See docs/PLACEHOLDERS.md.
import Phaser from "phaser";

class BootScene extends Phaser.Scene {
  public constructor() {
    super({ key: "Boot" });
  }

  public create(): void {
    // Placeholder title screen: solid shapes only.
    this.add.rectangle(480, 270, 960, 540, 0x15141b);
    this.add.rectangle(480, 200, 560, 8, 0xffd166);
    this.add
      .text(480, 270, "CELESTIAL HAVEN", {
        fontSize: "48px",
        color: "#e7e9e8",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);
    this.add
      .text(480, 330, "MVP v0.1 - placeholder build (M0 scaffold)", {
        fontSize: "18px",
        color: "#ffd166",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#15141b",
  scene: [BootScene],
});

export default game;
