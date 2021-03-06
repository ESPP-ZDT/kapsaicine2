import weapon from "./weapon"
import kaboom from "kaboom"
import loadAssets from "./assets"
import {addDialog} from './adddialog.js'
import characters from './npcs'


kaboom({
  background: [255, 250, 205],
  width: 800,
  height: 600,
  scale: 1.3
});

loadAssets()
play('wuja theme')
let level_id = 0
const HERO_SPEED = 300 //hero movement speed variable
const JUMP_SPEED = 600 //hero movement speed variable

scene("game", ({level_id}) => {
  gravity(1600)
  
  
  const hero = add([
    sprite('hero'),
    pos(width()/2,height()/2),
    area({width: 300 , height: 632}),
    scale(0.07),
    health(120),
    solid(),
    body(),
    origin('center'),
    'stupid',
    z(16),
    health(100)
    //body()
  ])
  const projector = add([
  	pos(),
  	sprite("projector"),
  	origin("center"),
    //color(105,105,105),
    scale(0.01),
    //health(1000),
  	follow(hero, vec2(0, -17)),
    z(21),
    opacity(1)
  ])
  projector.opacity = 0
  //HERO CAMERA AND DEATH
  hero.onUpdate(() =>{
    camPos(hero.pos)
    if (hero.health <= 0){
      go('lose')
    }
  })
  
  const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
    
	}

	for (const dir in dirs) {
		onKeyPress(dir.LEFT, () => {
			dialog.dismiss()
		})
    onKeyPress(dir.RIGHT, () => {
			dialog.dismiss()
      
		})
    onKeyPress(dir.UP, () => {
			dialog.dismiss()
		})
    onKeyPress(dir.DOWN, () => {
			dialog.dismiss()
      
		})
    
		onKeyDown(dir, () => {
			hero.move(dirs[dir].scale(HERO_SPEED))
		})
	}

  onKeyPress("space", () => {
		// these 2 functions are provided by body() component
        if (hero.isClimbing) {
            hero.use(body())
        }
		if (hero.isClimbing || hero.isGrounded()) {
			hero.jump(JUMP_SPEED)
		}
        if (hero.isClimbing) {
            hero.weight = 1
            hero.isClimbing = false
            // return
        }
    //burp()

	})
  
  onKeyDown('right', () => {
    projector.angle = 90
    hero.flipX(true)
      if (hero.isClimbing) {
              hero.use(body())
              hero.weight = 1
              hero.isClimbing = false
          }
        
  });
  onKeyDown('left', () => {
    projector.angle = 270
    hero.flipX(false)
      if (hero.isClimbing) {
                hero.use(body())
                hero.weight = 1
                hero.isClimbing = false
            }
  });

  onKeyPress('down', () => {
    hero.move(0, HERO_SPEED)
    hero.weight = 3
    projector.angle = 180

  
    
  });
  onKeyRelease('down', () => {
    hero.weight = 1
    
  });
  
  onKeyDown('up', () => {
      projector.angle = 0
        if (hero.touchingLadder) {
                hero.isClimbing = true
                hero.unuse("body")
                hero.move(0, -HERO_SPEED)
                // player.weight = 0
            }
        })


  onKeyPress("t", ()=>{
    play('bullet shoot')

    let laser = add([
  	// list of components
  	  sprite("bullet"),
  	  pos(projector.pos.x, projector.pos.y),
      origin("center"),
  	  area({
        width:30,
        height: 30
      }),
      move(projector.angle-90, 500),
      cleanup(),
      'laser'
    ])
  
    laser.angle = projector.angle

})
  
  //LADDER ON UPDATE
  hero.onUpdate(() => {
        // debug.log(player.weight)
        const ladders = get("ladder")
        hero.touchingLadder = false
        for (const ladder of ladders) {
            if (hero.isColliding(ladder)) {
                hero.touchingLadder = true
                break
            }
        }
        // if (!player.touchingLadder && player.isClimbing) {
        //     // player.weight = 1
        //     // player.isClimbing = false
        // }
    })


  hero.onCollide("portal", (portal) => {
    level_id++
    if (level_id < maps.length){
      go('game',{level_id})
    }else{
      go('win')
    }
    
  })

  
  
  maps = [
      [
      "ffffffffffffffffffff",
      "m      H  mm       m",
      "m      H  mm       m",
      "m      H  mm       m",
      "m      H  mm       m",
      "ma     H  mm      mm",
      "mffffffH  mm      mm",
      "m      H           m",
      "m      H           m",
      "m      H  mm       m",
      "m      H  mm       m",
      "m      H  mm       m",
      "m a    H  mm     o m",
      "mffffffH  m      mmm",
      "m      H  m      mmm",
      "m      H  mm       m",
      "m      H  mm       m",
      "m      H        p  m",
      "m a    H           m",
      "fffffffffffffffffffff"
      ],
      [
      "fffffffffffffffffffff",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "mfffff   fH       fm",
      "m         H        m",
      "m                  m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "mwwwwo          fffm",
      "mfffffffff         m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H       pm",
      "ffffffffffffffffffff"
      ],
    ]
  
  current_map = maps[level_id]

  const levelcfg = {
    width:64,//width of all of the sprites on map  
    height:64,
    pos:vec2(0,0),
    'm': () =>[
      sprite('clovewall'),//wall sprite
        'wall',
        area(),
        solid(),
        scale(0.07)
      ],
    'f': () =>[
      sprite('clovefloor'),//floor sprite
        'floor',
        area(scale(1,0.5)),
        solid(),
        z(2),
        scale(0.07),
        origin('center')
      
      ],
    'p': () =>[
      sprite('descending'),
        'portal',
        z(17),
        scale(0.07),
        area(),
      ],
    "H": () => [
  		sprite("ladder"),
  		area(),
  		origin("bot"),
  		"ladder",
      scale(0.07),
  	  ],
    "w": () => [
  		sprite("paprikawraith"),
  		area(),
  		origin("center"),
  		"enemy",'paprika',
      scale(0.07),
  	  ],
    "o": () => [
  		sprite("monk"),
  		area(),
  		origin("center"),
  		'monk','halapeno',
      scale(0.07),
  	  ],
    
    any(ch) {
			const char = characters[ch]
			if (char) {
				return [
					sprite(char.sprite),
					area(),
					solid(),
          scale(char.scale),
					// here
					//scale(char.scale),
					"character",
					{ msg: char.msg, },
				]
			}
		},
    
  }
  
  const dialog = addDialog()

  
  hero.onCollide("character", (ch) => {
		dialog.say(ch.msg)
    console.log('colliding')
	})
  hero.onCollide("monk", () => {
		hero.heal(100)
    
    debug.log('hero health' +hero.hp())
    burp()
    
	})
  onCollide("laser","enemy", (laser, enemy) =>{
  enemy.destroy()
  play('monster death 1')
  laser.destroy()
})

  const level_label = add([
    text('level ' + level_id),
    pos(0,0),
    scale(0.3),
    fixed(),
    z(17),
  ])
  const health_label = add([
    text('health ' + hero.hp()),
    pos(400,0),
    scale(0.3),
    fixed(),
    z(190)
  ])
  const game_level = addLevel(current_map, levelcfg)

})

go('game', {level_id})

scene('lose', () =>{
  add([
    text('it ends'),
    color(0,0,0),
    origin('center'),
    pos(width()/2, height() /2)
    
  ])
  onKeyPress(() => {
    go('game',{level_id:0})
  })
})

scene('win', () =>{
  add([
    text('you won'),
    color(0,0,0),
    origin('center'),
    pos(width()/2, height() /2)
    
  ])
  onKeyPress(() => {
    go('game',{level_id:0})
  })
})