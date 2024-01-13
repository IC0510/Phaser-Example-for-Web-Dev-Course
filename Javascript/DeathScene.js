export default class DeathScene extends Phaser.Scene{
    constructor(){
        super('DeathScene');

        this.startTransition = false
    }

    init (data){
        this.finalScore = data.score
    }

    preload(){
        this.load.audio('space', 'assets/soundEffects/spacebar.mp3')
    }

    create(){
        this.cameras.main.fadeIn(1200,255,255,255)
        this.text1 = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2,this.cameras.main.worldView.y + this.cameras.main.height / 2, "You Died!\n" + "Final Score: " + this.finalScore, { fontFamily: "Roboto Condensed", fontSize: 'px'}).setOrigin(0.5)
        this.text2 = this.add.text(this.cameras.main.worldView.x + this.cameras.main.width / 2,this.cameras.main.worldView.y + this.cameras.main.height/ 2 + 100, "Click space to respawn", { fontFamily: "Roboto Condensed", fontSize: 'px'}).setOrigin(0.5)

        this.startButton = this.sound.add('space')
        this.text1.setFontSize(60)
        this.text2.setFontSize(40)

        this.audioPlayed = false
        this.deathSound = true
    }

    update(){
        if(this.deathSound){
            if(this.input.keyboard.addKey("SPACE").isDown && !this.audioPlayed){
                this.startTransition = true
                this.audioPlayed = true;
            }
    
            if(this.startTransition == true){
                this.startTransition = false
                this.startButton.play()
                this.sound.play('space');
                this.cameras.main.fadeIn(800,255,255,255, ()=>{
                    this.cameras.main.on('camerafadeincomplete',()=>{
                        this.scene.start("MainScene");
                    }, this)
                })
            }
        }

    }
}