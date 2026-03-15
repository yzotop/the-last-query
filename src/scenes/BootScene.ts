import Phaser from 'phaser'
import { GAME_CONFIG } from '../core/config'
import { SCENE_KEYS } from '../core/constants'
import { createPixelTextures } from '../utils/pixelSprites'

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT)
  }

  create(): void {
    this.registry.set('gameTitle', GAME_CONFIG.title)
    createPixelTextures(this)
    this.scene.start(SCENE_KEYS.TITLE)
  }
}
