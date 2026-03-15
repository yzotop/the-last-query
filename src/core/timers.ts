import Phaser from 'phaser'

export class CooldownTimer {
  private readyAt = 0
  private readonly cooldownMs: number

  constructor(cooldownMs: number) {
    this.cooldownMs = cooldownMs
  }

  canUse(now: number): boolean {
    return now >= this.readyAt
  }

  trigger(now: number): void {
    this.readyAt = now + this.cooldownMs
  }
}

export function createDurationTimer(
  scene: Phaser.Scene,
  delayMs: number,
  onComplete: () => void,
): Phaser.Time.TimerEvent {
  return scene.time.addEvent({
    delay: delayMs,
    callback: onComplete,
  })
}
