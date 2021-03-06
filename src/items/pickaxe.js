import Item from "../gui/item";
import AudioManager from "../utilities/audio-manager";
import Dialogue from "../utilities/dialogue";

export default (game, x, y, player) => {
  var item = new Item(
    game,
    x,
    y,
    "Pickaxe",
    "Pickaxe",
    player,
    new Dialogue([
      "You found a pickaxe!",
      "Press [SPACE] to break rocks with it.",
      ""
    ])
  );

  item.sprite.scale.set(0.75, 0.75);
  item.afterPickup = () => {
    // Call item pickup sound
    var audioManager = new AudioManager(game);
    audioManager.play("item_pickup", false, 0, 1);
  };
  // item.sprite.smoothed = false;
  return item;
};
