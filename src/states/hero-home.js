/*jshint esversion: 6 */

class HeroHome extends Phaser.State {
  constructor() {
    // exception thrown here when not called
    super();

    // Tile Map
    this.map = null;

    // Tile Map Layers
    this.floor = null;
    this.walls = null;
    this.underFurnitre = null;
    this.furniture = null;
    this.items = null;
    this.aboveFurniture = null;
    this.ceiling = null;
  }

  preload() {
    // Load Tilemap
    this.game.load.tilemap('heroHome', 'assets/maps/HeroHome.json', null, Phaser.Tilemap.TILED_JSON);

    // Load Tilesets
    this.game.load.image('tiles_inside', 'assets/images/tiles/inside.png');
    this.game.load.image('tiles_inside_ceiling', 'assets/images/tiles/inside_changed.png');
  }

  create() {
    // Create the Map
    this.map = this.game.add.tilemap('heroHome');
    this.map.addTilesetImage('inside', 'tiles_inside');
    this.map.addTilesetImage('inside_changed', 'tiles_inside_ceiling');

    // Create layers
    this.floor = this.map.createLayer('Floor');
    this.walls = this.map.createLayer('Walls');
    this.underFurnitre = this.map.createLayer('UnderFurniture');
    this.furniture = this.map.createLayer('Furniture');
    this.items = this.map.createLayer('Items');
    this.aboveFurniture = this.map.createLayer('AboveFurniture');
    this.ceiling = this.map.createLayer('Ceiling');

    // Resize game world to match the floor (DOESN'T SEEM TO WORK RIGHT NOW)
    this.floor.resizeWorld();
    // TODO: Add collision layer to map
    // TODO: Add collision detection
  }
}

export default HeroHome;
