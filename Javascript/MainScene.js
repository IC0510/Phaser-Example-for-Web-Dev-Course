export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene");
    }


    preload(){
        this.load.atlas('playerAnims','assets/images/playerRogue.png', 'assets/images/playerRogue.json');
        this.load.atlas('weaponAnims','assets/weapons/weapons.png', 'assets/weapons/weapons.json');
        this.load.atlas('bulletAnims','assets/bullets/All_Fire_Bullet_Pixel_16x16.png', 'assets/bullets/bullets.json');
        this.load.image('tiles', 'assets/tiles/TilesExtruded.png');
        this.load.atlas('skullAnims', 'assets/enemy/fire-skull-no-fire.png','assets/enemy/skull.json')
        this.load.atlas('healthpool', 'assets/health/healthpool.png', 'assets/health/healthpool.json')

        this.load.audio("shotgun", ['assets/soundEffects/shotgun.mp3']);
        this.load.audio('dash', ['assets/soundEffects/dash.mp3'])
        this.load.audio('pistol', ['assets/soundEffects/pistol.mp3'])
        this.load.audio('ak47', ['assets/soundEffects/ak47.mp3'])
        this.load.audio('bulletHit', ['assets/soundEffects/bulletHit.mp3'])
        this.load.audio('mainMusic', ['assets/soundEffects/mainMusic.mp3'])

        this.load.audio('death', ['assets/soundEffects/death.mp3'])
        this.load.audio('gameOver', ['assets/soundEffects/game-over.mp3'])
        this.load.audio('1up', ['assets/soundEffects/1up.mp3']);
        this.load.audio('playerHit', ['assets/soundEffects/playerHit.mp3'])

        this.load.image('particleEffect', ['assets/Icon/Particle.png'])

        this.load.tilemapTiledJSON('map', 'assets/tiles/dungeon.json')

        this.sound.pauseAll();
    }

    create(){
        this.cameras.main.setZoom(2,2)
        const map = this.make.tilemap({key: 'map'})
        const tileset = map.addTilesetImage('dungeon','tiles', 16, 16, 1, 2)
        this.layer2 = map.createLayer("Ground", tileset,0,0)
        this.layer1 = map.createLayer("Wall", tileset);
        this.layer3 = map.createLayer("spawnLayer", tileset);
        this.emptyTiles = this.layer2.getTilesWithin(this.layer2.worldToTileX(26.2),this.layer2.worldToTileY(76.75),1551.85, 1494.875);
        this.physics.world.setBounds(34.7, 80,1540.4,1487)
        this.cameras.main.centerOn(872.8226270070728, 762.142766953);
        this.layer1.setCollisionByProperty({collides: true})
        this.layer3.setVisible(false)

        this.text = this.add.text(this.cameras.main.worldView.width-200,this.cameras.main.worldView.height+100, "Score: \n" + this.score, { fontFamily: "Roboto Condensed", fontSize: 'px'})
        this.text.setScrollFactor(0)
        this.text.setFontSize(40)

        this.player = this.physics.add.sprite(872.8226270070728,762.142766953, 'playerAnims', 'idle1')
        this.weapon = this.physics.add.sprite(872.8226270070728, 762.142766953, 'weaponAnims', 'weapon1');
        this.healthpool = this.add.sprite(this.cameras.main.worldView.left, this.cameras.main.worldView.bottom, 'healthpool', 'health8');
        this.healthpool.setScale(2,2)
        this.bulletShot = this.physics.add.group()

        this.skullEnemy = this.physics.add.group();
        this.player.body.checkCollision.none = false;
        this.input.keyboard.enabled = true;
        this.player.body.enable = true;
        this.weapon.visible = true;
        this.capableofShooting = true;

        this.fadeTriggered = false;
        this.capableofShooting = true;
        this.cooking = true;
        this.ReqenemiesOnScreen = 3;
        this.spawnedEnemies = 0;
        this.collided = false;
        this.dashTimer = 0;
        this.score = 0;
        this.realScore = 0; 

        this.shotgun = this.sound.add('shotgun', {volume: 0.5, detune: 0.2});
        this.dash = this.sound.add('dash', {volume: 0.8});
        this.pistol = this.sound.add('pistol', {volume: 0.2, detune: 0.8});
        this.ak47 = this.sound.add('ak47', {volume: 0.8, detune: 0.2});
        this.bulletHit = this.sound.add('bulletHit', {volume: 0.5});

        this.mainMusic = this.sound.add('mainMusic', {volume: 0.6});
        this.mainMusic.setLoop(true);
        this.mainMusic.play();

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('playerAnims', { prefix: 'idle',start: 1, end: 4, zeroPad: 0}),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('playerAnims', { prefix: 'run',start:1, end: 6, zeroPad: 0}),
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: 'died',
            frames: this.anims.generateFrameNames('playerAnims', {prefix: 'died', start:1, end: 6, zeroPad: 0}),
            frameRate: 10,
            repeat: 1
        })

        this.anims.create({
            key:'bullet1Animation',
            frames: this.anims.generateFrameNames('bulletAnims', {prefix: 'bullet',start:1, end:4, zeropad: 0}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'skullMoving',
            frames: this.anims.generateFrameNames('skullAnims', {prefix: 'skull',start: 1, end:4}),
            frameRate: 6,
            repeat: -1
        })

        this.player.health = 8;
        this.player.dead = false;


        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT
        })

        this.physics.add.collider(this.player, this.layer1)
        this.physics.add.collider(this.player, this.skullEnemy)
        this.physics.add.collider(this.skullEnemy, this.layer1)
        this.physics.add.collider(this.skullEnemy, this.skullEnemy)

        this.player.setDepth(1);
        this.player.setScale(0.85);

        this.weapon.inputKeys = this.input.keyboard.addKeys({
            pistol: Phaser.Input.Keyboard.KeyCodes.ONE,
            AK47: Phaser.Input.Keyboard.KeyCodes.TWO,
            Shotgun: Phaser.Input.Keyboard.KeyCodes.THREE,
        })

        this.weapon.setDepth(2);
        this.healthpool.setDepth(10);

        this.physics.add.collider(this.skullEnemy, this.layer1)
        this.player.body.setCircle(20,-10,-5)
    }

    firingBullet(type, angle, bulletSpeed, bulletType, bulletAnimation, fireRate, bulletFrame, typeofGun, bulletsRequired){
        const bulletVector = new Phaser.Math.Vector2();
        this.capableofShooting = false;

        if (typeofGun === 'regular') {
            const newBullets = this.bulletShot.create(this.weapon.x, this.weapon.y, bulletType, bulletFrame);
            newBullets.setInteractive();

            const angleOffset = Math.random() * 0.1 - Math.random() * 0.1;
            const modifiedAngle = angle - angleOffset;
            
            bulletVector.x = bulletSpeed * Math.cos(modifiedAngle);
            bulletVector.y = bulletSpeed * Math.sin(modifiedAngle);
            
            if(type === 'pistol'){
                this.pistol.play();
            } else if (type === 'ak47'){
                this.ak47.play();
            }
            bulletVector.normalize().scale(bulletSpeed);
            newBullets.setRotation(angle);
            newBullets.setVelocity(bulletVector.x, bulletVector.y);

            setTimeout(this.shootAgain.bind(this), fireRate);
        } else if (typeofGun === 'shotgun') {
            for (let i = 0; i < bulletsRequired; i++) {
                const newBullets = this.bulletShot.create(this.weapon.x, this.weapon.y, bulletType, bulletFrame);
                newBullets.setRotation(angle);
                newBullets.setInteractive();

                const angleOffset = Math.random() * 0.1 - Math.random() * 0.1;
                const modifiedAngle = angle + angleOffset;

                bulletVector.x = bulletSpeed * Math.cos(modifiedAngle);
                bulletVector.y = bulletSpeed * Math.sin(modifiedAngle);

                bulletVector.normalize().scale(bulletSpeed);
                this.shotgun.play();
                newBullets.setVelocity(bulletVector.x, bulletVector.y);

                angle += 0.13;
            }

            setTimeout(this.shootAgain.bind(this), fireRate);
        }
    }

    spawnMethod(){
        if (this.spawnedEnemies < this.ReqenemiesOnScreen) {
            const shuffledTiles = Phaser.Utils.Array.Shuffle(this.emptyTiles).slice(0, this.ReqenemiesOnScreen - this.spawnedEnemies);
            const playerX = this.player.x;
            const playerY = this.player.y;
          
            for (const randomTile of shuffledTiles) {
                const enemySpawn = Phaser.Math.Distance.Between(playerX, playerY, randomTile.pixelX, randomTile.pixelY);
          
                if (enemySpawn > 100) {
                    const newEnemy = this.skullEnemy.create(randomTile.pixelX, randomTile.pixelY);
                    newEnemy.setScale(0.5);
                    newEnemy.health = 5;
                    newEnemy.anims.play('skullMoving');
                    this.spawnedEnemies++;
                }
            }
        }
    }

    playerMovement(){
        let speed = 100;
        let dashed = false;
        let playerVelocity = new Phaser.Math.Vector2();

        const isCollided = this.collided;
        const isPlayerDead = this.player.dead;

        if (Math.abs(this.player.body.velocity.x) < 1 && Math.abs(this.player.body.velocity.y) < 1) {
            if (!isPlayerDead) {
                this.player.anims.play('idle', true);
            } else {
                this.player.anims.play('died', true);
            }
        }

        if (!isCollided) {
            if (this.player.inputKeys.up.isDown) {
                playerVelocity.y = -70;
                this.player.anims.play('run', true);
            } else if (this.player.inputKeys.down.isDown) {
                playerVelocity.y = 70;
                this.player.anims.play('run', true);
            }

            if (this.player.inputKeys.left.isDown) {
                playerVelocity.x = -70;
                this.player.flipX = true;
                this.player.anims.play('run', true);
            } else if (this.player.inputKeys.right.isDown) {
                playerVelocity.x = 70;
                this.player.flipX = false;
                this.player.anims.play('run', true);
            }

            if (this.player.inputKeys.dash.isDown && this.dashTimer <= 0) {
                this.player.body.checkCollision.none = true;
                dashed = true;
                this.dash.play();
                playerVelocity.normalize();
                playerVelocity.scale(speed * 12);
            } else {
                playerVelocity.normalize();
                playerVelocity.scale(speed);
            }

            this.dashTimer -= this.game.loop.delta;

            if (!isPlayerDead) {
                if (!dashed) {
                    this.player.setVelocity(playerVelocity.x, playerVelocity.y);
                }

                if (dashed) {
                    this.player.setAcceleration(playerVelocity.x, playerVelocity.y);
                    setTimeout(() => {
                        this.dashTimer = 1000;
                        this.player.body.checkCollision.none = false;
                        this.player.setAcceleration(0, 0);
                    }, 300);
                }
            } else {
                this.player.setVelocity(0, 0);
            }
        }
        // let speed = 100
        // let dashed = false;
        // let playerVelocity = new Phaser.Math.Vector2;
        // if (Math.abs(this.player.body.velocity.x) < 1 && Math.abs(this.player.body.velocity.y) < 1) {
        //     if(this.player.dead == false){
        //         this.player.anims.play('idle', true);
        //     } else if (this.player.dead == true){
        //         this.player.anims.play('died', true);
        //     }
        // }
        // if((this.player.inputKeys.up.isDown) && (this.collided == false)){
        //     playerVelocity.y = -70
        //     this.player.anims.play('run', true)
       
        // } else if ((this.player.inputKeys.down.isDown) && (this.collided == false)){
        //     playerVelocity.y = 70
        //     this.player.anims.play('run', true)
        // }
       
        // if((this.player.inputKeys.left.isDown) && (this.collided == false)){
        //     playerVelocity.x = -70
        //     this.player.flipX = true
        //     this.player.anims.play('run', true)
       
        // } else if ((this.player.inputKeys.right.isDown) && (this.collided == false)){
        //     playerVelocity.x = 70
        //     this.player.flipX = false;
        //     this.player.anims.play('run', true)
        // }

        // if((this.player.inputKeys.dash.isDown) && (this.collided == false) && (this.dashTimer <= 0)){
        //     this.player.body.checkCollision.none = true;
        //     dashed = true;
        //     this.dash.play();
        //     playerVelocity.normalize()
        //     playerVelocity.scale(speed * 12)
        // } else {
        //     playerVelocity.normalize()
        //     playerVelocity.scale(speed)
        // }

        // this.dashTimer -= this.game.loop.delta
        // if(!this.player.dead){
        //     if(!dashed){
        //         this.player.setVelocity(playerVelocity.x,playerVelocity.y)
        //     }
        //     if(dashed){
        //         this.player.setAcceleration(playerVelocity.x,playerVelocity.y)
        //         setTimeout(()=>{
        //             this.dashTimer = 1000;
        //             this.player.body.checkCollision.none = false;
        //             this.player.setAcceleration(0,0);
        //         }, 300)
        //     }
        // }
        // else if (this.player.dead == true){
        //     this.player.setVelocity(0,0)
        // }
    }


    update(){
        this.healthpool.setScrollFactor(0)
        this.healthpool.setPosition(this.cameras.main.worldView.width-290,this.cameras.main.worldView.height+170)
        this.text.setPosition(this.cameras.main.worldView.width+220,this.cameras.main.worldView.height-185)

        let healthFrame = "health"+String(this.player.health)
        this.healthpool.setFrame(healthFrame)

        if(this.score === 100){
            if(this.player.health < 8){
                this.player.health = 8;
            }
            this.sound.play('1up')
            this.score -= 100
        }

        this.text.setText("Score:" + this.score)

        this.DeadChecker();

        if (this.player.dead == true) {
            this.player.anims.play('died', true);
        }
        if(this.collided == false){
            this.player.body.checkCollision.none = false;
        }

        if(this.player.x < 32.15){
            this.collided = true;
            this.player.body.checkCollision.none = true;
            this.player.x += (30 - this.player.x)
            this.player.body.velocity.y = -this.player.body.velocity.y
            this.player.body.velocity.x = -this.player.body.velocity.x
            setTimeout(()=>{
                this.collided = false;
            }, 500)
        } else if (this.player.x > 1568.7){
            this.collided = true;
            this.player.body.checkCollision.none = true;
            this.player.x += (1568.7 - this.player.x)
            this.player.body.velocity.y = -this.player.body.velocity.y
            this.player.body.velocity.x = -this.player.body.velocity.x
            setTimeout(()=>{
                this.collided = false;
            }, 500)
        }

        if(this.player.x > 788.17 && this.player.x < 954 && this.player.y > 1519){
            this.collided = true;
            this.player.body.checkCollision.none = true;
            this.player.y += (1519- this.player.y)
            this.player.body.velocity.y = -this.player.body.velocity.y
            setTimeout(()=>{
                this.collided = false;
            }, 500)
        }

        if(this.player.y > 1567.5){
            this.player.y -= (this.player.y-1567.5)
            this.player.body.velocity.x = -this.player.body.velocity.x
            this.player.body.velocity.y = -this.player.body.velocity.y
            setTimeout(()=>{
                this.collided = false;
            }, 500)
        } else if (this.player.y < 65){
            this.player.y += (65 - this.player.y)
            this.player.body.velocity.x = -this.player.body.velocity.x
            this.player.body.velocity.y = -this.player.body.velocity.y
            setTimeout(()=>{
                this.collided = false;
            }, 500)
        }

        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.x + this.cameras.main.scrollX, this.input.activePointer.y + this.cameras.main.scrollY);
        this.spawnMethod();

        const playerX = this.player.x;
        const playerY = this.player.y;
        const playerState = this.player.dead;

        this.skullEnemy.getChildren().forEach(function(child) {
            const enemyVector = new Phaser.Math.Vector2();

            if (!playerState) {
                enemyVector.x = -Math.cos(Phaser.Math.Angle.Between(playerX, playerY, child.x, child.y));
                enemyVector.y = -Math.sin(Phaser.Math.Angle.Between(playerX, playerY, child.x, child.y));
            } else {
                enemyVector.x = Math.cos(Phaser.Math.Angle.Between(playerX, playerY, child.x, child.y));
                enemyVector.y = Math.sin(Phaser.Math.Angle.Between(playerX, playerY, child.x, child.y));
            }

            enemyVector.normalize();
            enemyVector.scale(95);
            child.setVelocity(enemyVector.x, enemyVector.y);

            child.flipX = enemyVector.x > 0;

            child.body.setSize(50, 50);
        });

        this.physics.add.collider(this.bulletShot, this.layer1, null, this.destroyBullet, this)
        this.physics.add.collider(this.skullEnemy, this.bulletShot, null, this.destroyEnemy, this)
        this.physics.add.collider(this.player, this.skullEnemy, null ,this.playerHit, this)
        this.playerMovement();

        const worldView = this.cameras.main.worldView;
        const inputKeys = this.weapon.inputKeys;

        this.bulletShot.getChildren().forEach((child) => {
            if (child.x > worldView.right || child.x < worldView.left || child.y > worldView.bottom || child.y < worldView.top) {
                child.destroy();
            }
        });

        this.weapon.setRotation(angle);
        this.weapon.x = this.player.x;
        this.weapon.y = this.player.y + 2;

        if (Math.abs(this.weapon.angle) > 90) {
            this.player.flipX = true;
            this.weapon.flipY = true;
        } else {
            this.player.flipX = false;
            this.weapon.flipX = false;
            this.weapon.flipY = false;
        }

        if (inputKeys.pistol.isDown) {
            this.weapon.setFrame('weapon1');
        } else if (inputKeys.AK47.isDown) {
            this.weapon.setFrame('weapon2');
        } else if (inputKeys.Shotgun.isDown) {
            this.weapon.setFrame('weapon3');
        }

        if(this.input.activePointer.isDown && this.capableofShooting == true){
            if(this.weapon.frame.name == "weapon1"){
                this.firingBullet('pistol', angle, 500, 'bulletAnims', 'bullet1Animation', 500, 'bullet1', 'regular', null)
            } else if (this.weapon.frame.name == "weapon2"){
                this.firingBullet('ak47', angle, 700, 'bulletAnims', 'bullet1Animation', 120, 'bullet1', 'regular', null)
            } else if (this.weapon.frame.name == 'weapon3'){
                this.firingBullet('shotgun',angle, 700,'bulletAnims', 'bullet1Animation', 1000, 'bullet1', 'shotgun', 5)
            }
        }
        this.cameras.main.startFollow(this.player, true);
    }
    
    shootAgain(){
        this.capableofShooting = true;
        return this.capableofShooting
    }

    destroyBullet(bullet, layer){
        bullet.destroy();
    }

    destroyEnemy(enemy, bullet){
        enemy.health --
        this.add.particles(enemy.x, enemy.y, 'particleEffect',{speed: 1000,scale: 0.01, maxParticles:3, lifespan: {min: 100, max: 150}})
        bullet.destroy();
        if(enemy.health == 0){
            enemy.destroy();
            this.score ++;
            this.realScore ++;
            this.spawnedEnemies--
            if(this.ReqenemiesOnScreen < 10){
                this.ReqenemiesOnScreen ++
            }
        }
    }

    playerHit = (player,enemy)=>{
        player.body.checkCollision.none = true;
        this.player.health --
        this.collided = true;

        let vectoral = new Phaser.Math.Vector2;

        vectoral.x = (player.x - enemy.x)
        vectoral.y = (player.y - enemy.y)

        vectoral.normalize();
        vectoral.scale(200);

        this.sound.play('playerHit');
        player.setVelocity(vectoral.x, vectoral.y);

        setTimeout(()=>{
            this.collided = false;
            player.setAcceleration(0, 0)
        }, 800)
    }

    DeadChecker(){
        if(this.player.health <= 0){
            this.sound.pauseAll()
            this.sound.play('death');
            this.gameOver = this.sound.play('gameOver');

            this.player.dead = true;
            this.player.body.checkCollision.none = true;
            this.input.keyboard.enabled = false;
            this.player.body.enable = false;
            this.weapon.visible = false;
            this.capableofShooting = false;
            if(!this.fadeTriggered){
                this.fadeTriggered = true;
                this.cameras.main.fadeOut(800,255,255,255, ()=>{
                    this.cameras.main.on('camerafadeoutcomplete',()=>{
                        this.scene.start('DeathScene', {score: this.realScore});
                    }, this)
                })
            }
        }
    }

}