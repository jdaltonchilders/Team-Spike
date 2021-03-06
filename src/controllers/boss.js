/*jshint esversion: 6 */

import store from "../store";
import HealthBar from "../gui/healthbar";
import AudioManager from "../utilities/audio-manager";

export default class Boss {
  constructor(game, x, y, boulders) {
    this.game = game;
    this.boulders = boulders;

    const spawnX = x || 0;
    const spawnY = y || 0;

    // Phase 1: water, 2: fire
    this.phase = 1;

    // Create the first boss sprite
    this.sprite = this.game.add.sprite(spawnX, spawnY, "boss");
    this.sprite.anchor.set(0.5, 0.5);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.setSize(70, 70, 25, 55);

    // Create animations
    this.sprite.animations.add("2_up", [39, 40, 41, 40], 5, true);
    this.sprite.animations.add("2_right", [27, 28, 29, 28], 5, true);
    this.sprite.animations.add("2_left", [15, 16, 17, 16], 5, true);
    this.sprite.animations.add("2_down", [3, 4, 5, 4], 5, true);
    this.sprite.animations.add("1_up", [36, 37, 38, 36], 5, true);
    this.sprite.animations.add("1_right", [24, 25, 26, 25], 5, true);
    this.sprite.animations.add("1_left", [12, 13, 14, 13], 5, true);
    this.sprite.animations.add("1_down", [0, 1, 2, 1], 5, true);

    // Configure boss
    this.fireRate = 450;
    this.nextFire = this.game.time.now + this.fireRate;
    this.bulletSpeed = 400;
    this.movementSpeed = 150;
    this.idealDistance = 200;
    this.buffer = 50;
    this.maxHealth = 50;
    this.health = this.maxHealth;

    // Now create bullets groups
    this.waterBullets = this.game.add.group();
    this.waterBullets.enableBody = true;
    this.waterBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.waterBullets.createMultiple(30, "boss1bullet", 0, false);
    this.waterBullets.forEach(bullet => bullet.scale.set(0.5, 0.5));
    this.waterBullets.setAll("anchor.x", 0);
    this.waterBullets.setAll("anchor.y", 0.5);
    this.waterBullets.setAll("outOfBoundsKill", true);
    this.waterBullets.setAll("checkWorldBounds", true);
    this.waterBullets.setAll("damage", 2.5);
    this.waterBullets.callAll(
      "animations.add",
      "animations",
      "move",
      [0, 1, 2, 3],
      7,
      true
    );

    this.fireBullets = this.game.add.group();
    this.fireBullets.enableBody = true;
    this.fireBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.fireBullets.createMultiple(30, "boss2bullet", 0, false);
    this.fireBullets.forEach(bullet => bullet.scale.set(0.5, 0.5));
    this.fireBullets.setAll("anchor.x", 0);
    this.fireBullets.setAll("anchor.y", 0.5);
    this.fireBullets.setAll("outOfBoundsKill", true);
    this.fireBullets.setAll("checkWorldBounds", true);
    this.fireBullets.setAll("damage", 4);
    this.fireBullets.callAll(
      "animations.add",
      "animations",
      "move",
      [0, 1, 2, 3],
      7,
      true
    );

    // Now create health bar
    this.healthBar = new HealthBar(this.game, {
      x: game.width - 125,
      y: 20,
      isFixedToCamera: true
    });
    this.healthBar.setPercent(100 * this.health / this.maxHealth);

    // Audio
    this.audioManager = new AudioManager(this.game);
  }

  update() {
    const topRight = this.game.math.degToRad(315);
    const topLeft = this.game.math.degToRad(225);
    const bottomLeft = this.game.math.degToRad(135);
    const bottomRight = this.game.math.degToRad(45);

    // Ray casting to determine if we can see the player
    const ray = new Phaser.Line(
      this.sprite.x,
      this.sprite.y,
      this.target.x,
      this.target.y
    );
    var canReachPlayer = true;
    const coordinates = ray.coordinatesOnLine();
    this.boulders.forEach(boulder => {
      const sprite = boulder.sprite;
      const bounds = sprite.getBounds();

      coordinates.forEach(coord => {
        if (bounds.contains(coord[0], coord[1])) {
          canReachPlayer = false;
        }
      });
    });

    // Default direction
    var direction;

    if (!canReachPlayer) {
      this.ourRays = [
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x + 1000,
          this.sprite.y
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x + 1000,
          this.sprite.y + 1000
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x,
          this.sprite.y + 1000
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x - 1000,
          this.sprite.y + 1000
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x - 1000,
          this.sprite.y
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x - 1000,
          this.sprite.y - 1000
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x,
          this.sprite.y - 1000
        ),
        new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.sprite.x + 1000,
          this.sprite.y - 1000
        )
      ];

      this.targetRays = [
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x + 1000,
          this.target.y
        ),
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x + 1000,
          this.target.y + 1000
        ),
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x,
          this.target.y + 1000
        ),
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x - 1000,
          this.target.y + 1000
        ),
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x - 1000,
          this.target.y
        ),
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x - 1000,
          this.target.y - 1000
        ),
        new Phaser.Line(
          this.target.x,
          this.target.y,
          this.target.x,
          this.target.y - 1000
        ),
        new Phaser.Line(
          this.target.x,
          this.sprite.y,
          this.sprite.x + 1000,
          this.sprite.y - 1000
        )
      ];

      var intersections = [];

      // Intersect rays
      this.ourRays.forEach(ray => {
        this.targetRays.forEach(theirRay => {
          const intersection = ray.intersects(theirRay);
          if (intersection) intersections.push(intersection);
        });
      });

      // if our rays intersected, go there
      if (intersections.length > 0) {
        // Determine closest target
        var closest = intersections[0];
        var closestDistance = this.game.math.distance(
          this.target.x,
          this.target.y,
          closest[0],
          closest[1]
        );
        intersections.forEach(point => {
          const distance = this.game.math.distance(
            this.target.x,
            this.target.y,
            point[0],
            point[1]
          );
          if (distance < closestDistance) {
            closest = point;
            closestDistance = distance;
          }
        });

        const target = closest;
        // Get angle and distance between target and boss
        var distance = this.game.math.distance(
          this.sprite.x,
          this.sprite.y,
          target.x,
          target.y
        );
        var targetAngle = this.game.math.angleBetween(
          this.sprite.x,
          this.sprite.y,
          target.x,
          target.y
        );
        if (targetAngle < 0) targetAngle += this.game.math.degToRad(360);

        // Determine the direction to target
        if (targetAngle > bottomRight && targetAngle < bottomLeft)
          direction = "down";
        else if (targetAngle > bottomLeft && targetAngle < topLeft)
          direction = "left";
        else if (targetAngle > topLeft && targetAngle < topRight)
          direction = "up";
        else direction = "right";
      }
    } else {
      // Get angle and distance between target and boss
      var distance = this.game.math.distance(
        this.sprite.x,
        this.sprite.y,
        this.target.x,
        this.target.y
      );
      var targetAngle = this.game.math.angleBetween(
        this.sprite.x,
        this.sprite.y,
        this.target.x,
        this.target.y
      );
      if (targetAngle < 0) targetAngle += this.game.math.degToRad(360);

      // Determine the direction to target
      if (targetAngle > bottomRight && targetAngle < bottomLeft)
        direction = "down";
      else if (targetAngle > bottomLeft && targetAngle < topLeft)
        direction = "left";
      else if (targetAngle > topLeft && targetAngle < topRight)
        direction = "up";
    }

    // Move toward player if we need to
    if (distance > this.idealDistance) {
      if (direction === "right") this.moveRight();
      else if (direction === "down") this.moveDown();
      else if (direction === "left") this.moveLeft();
      else if (direction === "up") this.moveUp();
    } else if (distance < this.idealDistance - this.buffer) {
      // Or move away from player
      if (direction === "right") this.moveLeft(true);
      else if (direction === "down") this.moveUp(true);
      else if (direction === "left") this.moveRight(true);
      else if (direction === "up") this.moveDown(true);
    } else {
      // Stop moving if we're at the right distance
      this.stopMoving();

      var targetAngle = this.game.math.angleBetween(
        this.sprite.x,
        this.sprite.y,
        this.target.x,
        this.target.y
      );
      if (targetAngle < 0) targetAngle += this.game.math.degToRad(360);

      // Determine the direction to target
      direction = "right";
      if (targetAngle > bottomRight && targetAngle < bottomLeft)
        direction = "down";
      else if (targetAngle > bottomLeft && targetAngle < topLeft)
        direction = "left";
      else if (targetAngle > topLeft && targetAngle < topRight)
        direction = "up";

      // Face appropriately
      if (direction === "right") this.faceRight();
      else if (direction === "down") this.faceDown();
      else if (direction === "left") this.faceLeft();
      else if (direction === "up") this.faceUp();
    }

    // Collide with player bullets
    this.game.physics.arcade.overlap(
      this.sprite,
      this.playerBullets,
      this.onHit,
      null,
      this
    );

    // Kinda hairy but yolo
    this.game.physics.arcade.overlap(
      this.target,
      this.waterBullets,
      this.target.controller.onHit,
      null,
      this.target.controller
    );
    this.game.physics.arcade.overlap(
      this.target,
      this.fireBullets,
      this.target.controller.onHit,
      null,
      this.target.controller
    );

    // Always try to attack
    this.fire();
  }

  fire() {
    // If enough time has past since the last bullet firing
    if (
      this.game.time.now > this.nextFire &&
      this.sprite.alive &&
      this.target.alive
    ) {
      // Then create the bullet
      var bullet = undefined;
      if (this.phase === 1) bullet = this.waterBullets.getFirstExists(false);
      else bullet = this.fireBullets.getFirstExists(false);

      if (bullet) {
        const ray = new Phaser.Line(
          this.sprite.x,
          this.sprite.y,
          this.target.x,
          this.target.y
        );
        const point = ray.coordinatesOnLine(10)[1];
        bullet.reset(point[0], point[1]);
        // bullet.reset(this.sprite.x, this.sprite.y + 20);
        bullet.anchor.set(0.5, 0.5);

        if (this.phase === 1)
          this.audioManager.play("boss_waterstrike", false, 0, 0.3, false);
        else this.audioManager.play("boss_firestrike", false, 0, 0.3, false);

        // Move bullet toward target
        this.game.physics.arcade.moveToObject(
          bullet,
          this.target,
          this.bulletSpeed
        );
        bullet.animations.play("move");

        // Delay next bullet fire opportunity
        this.nextFire = this.game.time.now + this.fireRate;
      }
    }
  }

  setPlayerBullets(bullets) {
    this.playerBullets = bullets;
  }

  setTarget(sprite) {
    this.target = sprite;
  }

  moveDown(inverted) {
    if (!inverted)
      this.sprite.animations.play(`${this.phase}_down`, null, true);
    else this.sprite.animations.play(`${this.phase}_up`, null, true);
    this.sprite.body.velocity.y = this.movementSpeed;
    this.sprite.body.velocity.x = 0;
  }

  moveLeft(inverted) {
    if (!inverted)
      this.sprite.animations.play(`${this.phase}_left`, null, true);
    else this.sprite.animations.play(`${this.phase}_right`, null, true);
    this.sprite.body.velocity.x = -this.movementSpeed;
    this.sprite.body.velocity.y = 0;
  }

  moveRight(inverted) {
    if (!inverted)
      this.sprite.animations.play(`${this.phase}_right`, null, true);
    else this.sprite.animations.play(`${this.phase}_left`, null, true);
    this.sprite.body.velocity.x = this.movementSpeed;
    this.sprite.body.velocity.y = 0;
  }

  moveUp(inverted) {
    if (!inverted) this.sprite.animations.play(`${this.phase}_up`, null, true);
    else this.sprite.animations.play(`${this.phase}_down`, null, true);
    this.sprite.body.velocity.y = -this.movementSpeed;
    this.sprite.body.velocity.x = 0;
  }

  stopMoving() {
    // TODO: Should we use drag instead here?
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
  }

  faceDown() {
    if (this.phase === 1) this.sprite.frame = 1;
    else this.sprite.frame = 4;
    this.sprite.animations.stop();
  }

  faceLeft() {
    if (this.phase === 1) this.sprite.frame = 13;
    else this.sprite.frame = 16;
    this.sprite.animations.stop();
  }

  faceRight() {
    if (this.phase === 1) this.sprite.frame = 25;
    else this.sprite.frame = 28;
    this.sprite.animations.stop();
  }

  faceUp() {
    if (this.phase === 1) this.sprite.frame = 37;
    else this.sprite.frame = 40;
    this.sprite.animations.stop();
  }

  onHit(sprite, bullet) {
    this.health -= store.damage;
    this.healthBar.setPercent(100 * this.health / this.maxHealth);

    if (this.health <= this.maxHealth / 2) {
      this.phase = 2;
    }

    if (this.health <= 0) {
      this.health = 0;
      sprite.kill();
      this.healthBar.kill();
      // Death Sound
      this.audioManager.play("boss_death", false, 0, 1, false);

      // Update State Information
      store.previousState = store.currentState;
      store.currentState = store.nextState = "VictoryScreen";

      setTimeout(() => this.game.state.start("VictoryScreen"), 5000);
    }

    bullet.kill();
  }
}
