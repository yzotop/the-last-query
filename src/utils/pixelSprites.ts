import Phaser from 'phaser'

function drawPixelRect(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
): void {
  graphics.fillStyle(color, 1)
  graphics.fillRect(x, y, width, height)
}

function buildTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (graphics: Phaser.GameObjects.Graphics) => void,
): void {
  const graphics = scene.add.graphics({ x: 0, y: 0 })
  draw(graphics)
  graphics.generateTexture(key, width, height)
  graphics.destroy()
}

export function createPixelTextures(scene: Phaser.Scene): void {
  buildTexture(scene, 'player', 16, 16, (g) => {
    drawPixelRect(g, 4, 3, 8, 8, 0xf4d3bd)
    drawPixelRect(g, 3, 10, 10, 5, 0x3a76ff)
    drawPixelRect(g, 4, 5, 2, 1, 0x111111)
    drawPixelRect(g, 10, 5, 2, 1, 0x111111)
    drawPixelRect(g, 12, 7, 3, 2, 0x2cd8ff)
  })

  buildTexture(scene, 'enemy-cicd', 16, 16, (g) => {
    drawPixelRect(g, 2, 2, 12, 12, 0xff5b5b)
    drawPixelRect(g, 4, 4, 2, 2, 0x1d0d0d)
    drawPixelRect(g, 10, 4, 2, 2, 0x1d0d0d)
  })

  buildTexture(scene, 'enemy-orchestrator', 18, 18, (g) => {
    drawPixelRect(g, 1, 1, 16, 16, 0x9268ff)
    drawPixelRect(g, 4, 4, 10, 4, 0x281f41)
  })

  buildTexture(scene, 'enemy-swarm', 12, 12, (g) => {
    drawPixelRect(g, 1, 1, 10, 10, 0xf7c84a)
    drawPixelRect(g, 4, 4, 2, 2, 0x4a3500)
  })

  buildTexture(scene, 'enemy-meeting', 20, 20, (g) => {
    drawPixelRect(g, 1, 1, 18, 18, 0x6af2a2)
    drawPixelRect(g, 4, 4, 12, 3, 0x103a22)
  })

  buildTexture(scene, 'enemy-burnout', 14, 14, (g) => {
    drawPixelRect(g, 1, 1, 12, 12, 0x89a1b8)
    drawPixelRect(g, 4, 4, 6, 2, 0x23303b)
  })

  buildTexture(scene, 'enemy-therapist', 22, 22, (g) => {
    drawPixelRect(g, 1, 1, 20, 20, 0xff7bd4)
    drawPixelRect(g, 5, 6, 12, 4, 0x4d173b)
  })

  buildTexture(scene, 'enemy-excel-zombie', 18, 18, (g) => {
    drawPixelRect(g, 1, 1, 16, 16, 0x7acb6a)
    drawPixelRect(g, 3, 3, 12, 12, 0x99e08e)
    drawPixelRect(g, 4, 4, 2, 2, 0x2a4f28)
    drawPixelRect(g, 10, 4, 2, 2, 0x2a4f28)
    drawPixelRect(g, 4, 9, 8, 1, 0x4f7a3a)
  })

  buildTexture(scene, 'enemy-slack-notifier', 14, 14, (g) => {
    drawPixelRect(g, 1, 1, 12, 12, 0x7b8cff)
    drawPixelRect(g, 3, 3, 8, 2, 0xe1e6ff)
    drawPixelRect(g, 3, 6, 8, 2, 0xe1e6ff)
    drawPixelRect(g, 6, 9, 2, 2, 0xe1e6ff)
  })

  buildTexture(scene, 'enemy-legacy-monolith', 22, 22, (g) => {
    drawPixelRect(g, 2, 1, 18, 20, 0x454a57)
    drawPixelRect(g, 4, 3, 14, 2, 0x777f93)
    drawPixelRect(g, 5, 7, 12, 2, 0x2d3342)
    drawPixelRect(g, 6, 11, 10, 2, 0x2d3342)
  })

  buildTexture(scene, 'pickup-pumpkin-latte', 14, 14, (g) => {
    drawPixelRect(g, 3, 2, 8, 10, 0xffa64d)
    drawPixelRect(g, 4, 1, 6, 2, 0xfff1cc)
  })

  buildTexture(scene, 'pickup-new-macbook', 14, 14, (g) => {
    drawPixelRect(g, 2, 3, 10, 6, 0xa7c3ff)
    drawPixelRect(g, 1, 9, 12, 2, 0x6e83b8)
  })

  buildTexture(scene, 'pickup-therapy-session', 14, 14, (g) => {
    drawPixelRect(g, 5, 2, 4, 10, 0x8ef0b4)
    drawPixelRect(g, 2, 5, 10, 4, 0x8ef0b4)
  })

  buildTexture(scene, 'pickup-stackoverflow-scroll', 14, 14, (g) => {
    drawPixelRect(g, 3, 2, 8, 10, 0xf5e7bb)
    drawPixelRect(g, 4, 3, 6, 2, 0xc47d2d)
    drawPixelRect(g, 4, 7, 6, 1, 0xc47d2d)
  })

  buildTexture(scene, 'pickup-vacation-ticket', 14, 14, (g) => {
    drawPixelRect(g, 2, 4, 10, 6, 0x77e9ff)
    drawPixelRect(g, 10, 5, 2, 4, 0x1dbad6)
  })

  buildTexture(scene, 'pickup-noise-cancelling-airpods', 14, 14, (g) => {
    drawPixelRect(g, 2, 3, 4, 8, 0xffffff)
    drawPixelRect(g, 8, 3, 4, 8, 0xffffff)
    drawPixelRect(g, 3, 4, 2, 2, 0x9ad2ff)
    drawPixelRect(g, 9, 4, 2, 2, 0x9ad2ff)
  })

  buildTexture(scene, 'pickup-second-monitor', 14, 14, (g) => {
    drawPixelRect(g, 1, 3, 5, 6, 0xaad0ff)
    drawPixelRect(g, 8, 3, 5, 6, 0xaad0ff)
    drawPixelRect(g, 2, 10, 10, 2, 0x4f6fa0)
  })

  buildTexture(scene, 'pickup-python-script', 14, 14, (g) => {
    drawPixelRect(g, 2, 2, 10, 10, 0x8fffa8)
    drawPixelRect(g, 4, 4, 2, 6, 0x1d4f2d)
    drawPixelRect(g, 8, 4, 2, 6, 0x1d4f2d)
  })

  buildTexture(scene, 'pickup-excel-macro', 14, 14, (g) => {
    drawPixelRect(g, 2, 2, 10, 10, 0x9fd88a)
    drawPixelRect(g, 3, 5, 8, 1, 0x3f6e38)
    drawPixelRect(g, 3, 8, 8, 1, 0x3f6e38)
  })

  buildTexture(scene, 'pickup-jupyter-notebook', 14, 14, (g) => {
    drawPixelRect(g, 2, 2, 10, 10, 0xcfa6ff)
    drawPixelRect(g, 3, 3, 2, 8, 0x6f4da1)
    drawPixelRect(g, 6, 4, 5, 1, 0xf4e7ff)
  })

  buildTexture(scene, 'pickup-chatgpt-prompt', 14, 14, (g) => {
    drawPixelRect(g, 1, 1, 12, 12, 0xffd36d)
    drawPixelRect(g, 4, 4, 6, 6, 0x7a5a1f)
  })

  buildTexture(scene, 'pickup-git-blame', 14, 14, (g) => {
    drawPixelRect(g, 2, 2, 10, 10, 0xbac6ff)
    drawPixelRect(g, 4, 4, 6, 1, 0x46538e)
    drawPixelRect(g, 4, 7, 6, 1, 0x46538e)
  })

  buildTexture(scene, 'pickup-duckduckgo-query', 14, 14, (g) => {
    drawPixelRect(g, 2, 2, 10, 10, 0xffbf66)
    drawPixelRect(g, 5, 4, 3, 3, 0x8a4f12)
    drawPixelRect(g, 8, 8, 2, 2, 0x8a4f12)
  })

  buildTexture(scene, 'pickup-powerpoint-deck', 14, 14, (g) => {
    drawPixelRect(g, 2, 2, 10, 10, 0xff96b6)
    drawPixelRect(g, 4, 4, 6, 4, 0x8f3b56)
    drawPixelRect(g, 4, 9, 6, 1, 0x8f3b56)
  })
}
