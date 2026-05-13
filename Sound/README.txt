Dungeon Audio Pack - JavaScript RPG

Fichiers inclus:
- inventory_click.wav : clic d'inventaire / interface
- sword_hit.wav : attaque au corps à corps
- magic_spell.wav : sort magique
- heavy_door_open.wav : porte lourde
- stone_footstep.wav : pas sur pierre
- monster_growl.wav : grognement de monstre
- player_hurt.wav : dommage reçu
- dungeon_ambient_loop.wav : ambiance courte de donjon

Exemple JavaScript:

const sounds = {
  click: new Audio("audio/inventory_click.wav"),
  sword: new Audio("audio/sword_hit.wav"),
  magic: new Audio("audio/magic_spell.wav"),
  door: new Audio("audio/heavy_door_open.wav"),
  step: new Audio("audio/stone_footstep.wav"),
  growl: new Audio("audio/monster_growl.wav"),
  hurt: new Audio("audio/player_hurt.wav"),
  ambient: new Audio("audio/dungeon_ambient_loop.wav")
};

sounds.ambient.loop = true;
sounds.ambient.volume = 0.35;

function playSound(name, volume = 1) {
  const src = sounds[name];
  if (!src) return;

  // Permet de rejouer le même son rapidement
  const s = src.cloneNode();
  s.volume = volume;
  s.play().catch(() => {});
}

// Exemple:
// playSound("click", 0.6);
// playSound("sword", 0.8);
// sounds.ambient.play();
