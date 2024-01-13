import DeathScene from "./DeathScene.js";
import MainScene from "./MainScene.js";
import StartScene from "./StartScene.js";

const config = {
    width: window.innerWidth,
    height:window.innerHeight,
    backgroundColor:"#00000",
    type: Phaser.AUTO,
    mode: Phaser.Scale.Fit,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'PhaserGame',
    scene:[StartScene,MainScene, DeathScene],
    scale:{
        zoom: 0.1,
    },
    physics:{
        default: 'arcade',
        arcade:{
            debug: false,
            gravity: {y:0}
        }
    }
}

new Phaser.Game(config);