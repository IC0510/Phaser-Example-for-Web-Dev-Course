export default class StartScene extends Phaser.Scene{
    constructor(){
        super("StartScene")

        this.startGame = false;
    }

    preload(){
        this.load.audio('space', 'assets/soundEffects/spacebar.mp3')
    }

    create(){
        this.text = this.add.text(500, 300, "Dungeon Survivors", { fontFamily: "Roboto Condensed", fontSize: 'px'})
        this.text2 = this.add.text(400,400, "Click space to start the game", { fontFamily: "Roboto Condensed", fontSize: 'px'})
        this.text.setFontSize(60)
        this.text2.setFontSize(60)

        this.audioPlayed = false;
        
    }

    update(){

        if(this.input.keyboard.addKey("SPACE").isDown && !this.audioPlayed){
            this.startGame = true
            this.audioPlayed = true;
        }

        if(this.startGame == true){
            this.startGame = false
            this.sound.play('space');
            this.sound.play('space');
            this.cameras.main.fadeIn(800,255,255,255, ()=>{
                this.cameras.main.on('camerafadeincomplete',()=>{
                    this.scene.start('MainScene');
                }, this)
            })
        }
    }
}