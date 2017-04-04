/*jshint esversion: 6 */

import store from '../store';

export default class Item {
  constructor(game, x, y, name, spriteKey, player) {
    this.game = game;
    this.name = name;
    this.player = player;

    const spawnX = x || 0;
    const spawnY = y || 0;

    this.sprite = this.game.add.sprite(spawnX, spawnY, spriteKey);
    this.sprite.anchor.set(0.5, 0.5);
    this.game.physics.arcade.enable(this.sprite);
  }

  update() {
    // Overlap with player
    this.game.physics.arcade.overlap(this.player, this.sprite, this.onOverlap, null, this);
  }

  onOverlap(player, sprite) {
    // When overlapped, add this item to their inventory
    if (this.sprite.alive) store.inventory.push(this.name);

    // And delete this item
    this.sprite.kill();
  }
}
