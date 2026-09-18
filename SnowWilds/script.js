"use strict";
(() => {

    const CONFIG = {
        world: { width: 5000, height: 5000, waterCount: 2, treeCount: 20, grassCount: 220, edgeMargin: 100 },
        canvas: { width: 960, height: 540, background: "#a9c39c", pixelPerfect: true },
        time: { dayDuration: 120000, nightDuration: 120000, cycleDuration: 240000, startHour: 6, gameMinutesPerRealSecond: 12 },
        needs: {
            max: 100,
            startingFood: 70,
            startingWater: 70,
            startingEnergy: 100,
            hungerLossPerSecond: .035,
            thirstLossPerSecond: .055,
            energyLossPerSecond: .025,
            movementEnergyLoss: .045,
            starvationDamage: 1.7,
            dehydrationDamage: 2.3,
            energyRegeneration: 3
        },
        night: {
            coldDamagePerSecond: 4,
            minimumTemperature: -18,
            maximumTemperature: 5,
            shelterDistance: 180,
            animalShelterDistance: 115,
            transitionDuration: 15000,
            maxDarkness: .68,
            polarBearImmune: true
        },
        movement: {
            diagonalCorrection: .70710678,
            collisionPadding: 4,
            stopDistance: 5,
            playerAcceleration: 900,
            playerFriction: .82,
            aiChangeDirectionMin: 1.5,
            aiChangeDirectionMax: 5,
            fleeDistance: 240,
            chaseDistance: 430
        },
        combat: {
            attackDistance: 34,
            wolfDamage: 15,
            bearDamage: 30,
            attackCooldown: 900,
            playerAttackCooldown: 700,
            corpseDuration: 900,
            smokeDuration: 750
        },
        food: {
            grassFood: 28,
            rabbitFood: 22,
            deerFood: 35,
            grassEatDistance: 30,
            animalEatDistance: 35,
            eatCooldown: 1200
        },
        water: { drinkDistance: 45, drinkAmount: 45, drinkCooldown: 1500 },
        reproduction: {
            searchDistance: 280,
            matingDistance: 28,
            pregnancyDuration: 18000,
            birthCooldown: 22000,
            matingCooldown: 4000,
            minimumEnergy: 35,
            minimumFood: 25,
            minimumWater: 25,
            maxPopulation: 80,
            childFood: 55,
            childWater: 55,
            childEnergy: 100,
            childGrowthTime: 45000
        },
        ai: {
            decisionInterval: 800,
            waterPriority: .85,
            foodPriority: .75,
            fleeHealthPercent: .28,
            wanderChance: .25,
            targetMemory: 3500
        },
        animation: {
            frameDuration: 180,
            idleFrameDuration: 500,
            smokeFrameDuration: 180,
            footprintDuration: 900,
            footprintDistance: 25
        },
        audio: {
            masterVolume: .9,
            musicVolume: .28,
            effectsVolume: .45,
            ambientVolume: .22
        },
        performance: {
            maxDelta: .05,
            maxParticles: 180,
            maxFootprints: 160,
            maxGrass: 220,
            spatialCellSize: 250
        }
    };

    const ANIMALS = {
        rabbit: {
            name: "Conejo",
            folder: "conejo",
            alturavertical: 3,
            anchovertical: 3,
            alturahorizontal: 3,
            anchohorizontal: 3,
            vida: 5,
            velocidad: 115,
            maxVida: 100,
            comida: 70,
            agua: 70,
            energia: 100,
            sexoInicial: { female: 8, male: 8 },
            herbivore: true,
            carnivore: false,
            predator: false,
            polarBear: false,
            canWalkSound: false,
            attackDamage: 0,
            fleeFrom: ["wolf", "bear"],
            hunts: [],
            eatsGrass: true,
            breedingWeight: 1,
            childSize: .65
        },
        wolf: {
            name: "Lobo",
            folder: "lobo",
            alturavertical: 5,
            anchovertical: 3,
            alturahorizontal: 5,
            anchohorizontal: 8,
            vida: 50,
            velocidad: 95,
            maxVida: 100,
            comida: 75,
            agua: 75,
            energia: 100,
            sexoInicial: { female: 4, male: 6 },
            herbivore: false,
            carnivore: true,
            predator: true,
            polarBear: false,
            canWalkSound: true,
            attackDamage: CONFIG.combat.wolfDamage,
            fleeFrom: ["bear"],
            hunts: ["rabbit", "deer"],
            eatsGrass: false,
            breedingWeight: .8,
            childSize: .65
        },
        deer: {
            name: "Venado",
            folder: "venado",
            alturavertical: 7,
            anchovertical: 5,
            alturahorizontal: 7,
            anchohorizontal: 8,
            vida: 50,
            velocidad: 105,
            maxVida: 100,
            comida: 75,
            agua: 75,
            energia: 100,
            sexoInicial: { female: 3, male: 4 },
            herbivore: true,
            carnivore: false,
            predator: false,
            polarBear: false,
            canWalkSound: true,
            attackDamage: 0,
            fleeFrom: ["wolf", "bear"],
            hunts: [],
            eatsGrass: true,
            breedingWeight: 1,
            childSize: .70
        },
        bear: {
            name: "Oso",
            folder: "oso",
            alturavertical: 6,
            anchovertical: 4,
            alturahorizontal: 6,
            anchohorizontal: 9,
            vida: 90,
            velocidad: 62,
            maxVida: 100,
            comida: 85,
            agua: 85,
            energia: 100,
            sexoInicial: { female: 4, male: 2 },
            herbivore: false,
            carnivore: true,
            predator: true,
            polarBear: true,
            canWalkSound: true,
            attackDamage: CONFIG.combat.bearDamage,
            fleeFrom: [],
            hunts: ["rabbit", "deer"],
            eatsGrass: false,
            breedingWeight: .45,
            childSize: .60
        }
    };

    const PATHS = {
        general: {
            menu: "img/general/menu.png",
            mapa: "img/general/mapa.png",
            arbol: "img/general/arbol.png",
            huella: "img/general/huella.png",
            pasto: "img/general/pasto.png",
            agua: "img/general/agua.png",
            humo1: "img/general/humo1.png",
            humo2: "img/general/humo2.png"
        },
        music: {
            menu: "music/general/menu.mp3",
            caminar: "music/general/caminar.mp3",
            dano: "music/general/daño.mp3",
            agua: "music/general/agua.mp3",
            fondo: "music/general/fondo.mp3",
            pasos: "music/general/pasos.mp3",
            puntos: "music/general/puntos.mp3",
            viento: "music/general/viento.mp3"
        }
    };

    const canvas = document.getElementById("game");
    if (!canvas) { console.error("Snowwild: no se encontró #game."); return }
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) { console.error("Snowwild: Canvas 2D no disponible."); return }
    ctx.imageSmoothingEnabled = false;

    const menu = document.getElementById("menu"),
        hud = document.getElementById("hud"),
        startButton = document.getElementById("start"),
        serversButton = document.getElementById("servers"),
        exitButton = document.getElementById("exit"),
        hpBar = document.getElementById("hpBar"),
        hpText = document.getElementById("hpText"),
        foodBar = document.getElementById("foodBar"),
        foodText = document.getElementById("foodText"),
        waterBar = document.getElementById("waterBar"),
        waterText = document.getElementById("waterText"),
        energyBar = document.getElementById("energyBar"),
        energyText = document.getElementById("energyText"),
        speciesName = document.getElementById("speciesName"),
        weatherText = document.getElementById("weather"),
        clockText = document.getElementById("clock"),
        dayText = document.getElementById("day"),
        objectiveText = document.getElementById("objectiveText"),
        notice = document.getElementById("notice"),
        recordText = document.getElementById("record");

    const Utils = {
        random: (min, max) => Math.random() * (max - min) + min,
        randomInt: (min, max) => Math.floor(Utils.random(min, max + 1)),
        clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
        lerp: (a, b, t) => a + (b - a) * t,

        distance(a, b) {
            const dx = a.x - b.x,
                dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        },

        distanceSquared(a, b) {
            const dx = a.x - b.x,
                dy = a.y - b.y;
            return dx * dx + dy * dy;
        },

        normalize(x, y) {
            const length = Math.sqrt(x * x + y * y);
            return length <= .00001 ? { x: 0, y: 0 } : { x: x / length, y: y / length };
        },

        chance: probability => Math.random() < probability,

        randomChoice(array) {
            return !array || !array.length ? null : array[Math.floor(Math.random() * array.length)];
        },

        formatTime(totalMinutes) {
            const minutes = Math.floor(totalMinutes) % 60,
                hours = Math.floor(totalMinutes / 60) % 24;
            return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
        },

        safeNumber: (value, fallback = 0) => Number.isFinite(value) ? value : fallback,

        chooseWeighted(items) {
            if (!items.length) return null;
            let total = 0;
            for (const item of items) total += Math.max(0, item.weight || 0);
            if (total <= 0) return Utils.randomChoice(items).value;
            let r = Math.random() * total;
            for (const item of items) {
                r -= Math.max(0, item.weight || 0);
                if (r <= 0) return item.value;
            }
            return items[items.length - 1].value;
        }
    };

    const ImageManager = {
        images: new Map(),

        load(path) {
            if (this.images.has(path)) return this.images.get(path);
            const image = new Image();
            image.decoding = "async";
            image.onload = () => image.__snowwildLoaded = true;
            image.onerror = () => {
                image.__snowwildFailed = true;
                console.warn("Snowwild: no se pudo cargar:", path);
            };
            image.src = path;
            this.images.set(path, image);
            return image;
        },

        draw(image, x, y, width, height, alpha = 1) {
            if (!image || !image.complete || image.naturalWidth <= 0) return false;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
            ctx.restore();
            return true;
        }
    };

    const AudioManager = {
        sounds: new Map(),
        currentMusic: null,
        windPlaying: false,
        initialized: false,

        get(path, loop = false) {
            if (!path) return null;
            const key = `${path}|${loop}`;
            if (this.sounds.has(key)) return this.sounds.get(key);

            const audio = new Audio();
            audio.preload = "auto";
            audio.loop = loop;
            audio.volume = CONFIG.audio.effectsVolume * CONFIG.audio.masterVolume;
            audio.addEventListener("error", () => {
                console.warn("Snowwild: audio no disponible:", path);
            }, { once: true });
            audio.src = path;
            this.sounds.set(key, audio);
            return audio;
        },

        play(path, { volume = CONFIG.audio.effectsVolume, loop = false, restart = true } = {}) {
            if (!path) return null;
            const audio = this.get(path, loop);
            if (!audio) return null;

            try {
                audio.volume = Utils.clamp(volume * CONFIG.audio.masterVolume, 0, 1);
                audio.loop = loop;
                if (restart) audio.currentTime = 0;
                const promise = audio.play();
                if (promise && typeof promise.catch === "function") promise.catch(() => {});
            } catch (error) {}

            return audio;
        },

        stop(path) {
            if (!path) return;
            for (const [key, audio] of this.sounds) {
                if (key.startsWith(`${path}|`)) {
                    try {
                        audio.pause();
                        audio.currentTime = 0;
                    } catch (_) {}
                }
            }
        },

        stopAll() {
            for (const audio of this.sounds.values()) {
                try {
                    audio.pause();
                    audio.currentTime = 0;
                } catch (_) {}
            }
            this.currentMusic = null;
            this.windPlaying = false;
        },

        startMenuMusic() {
            const audio = this.play(PATHS.music.menu, {
                volume: CONFIG.audio.musicVolume,
                loop: true
            });
            this.currentMusic = audio;
        },

        startGameMusic() {
            this.stop(PATHS.music.menu);
            const audio = this.play(PATHS.music.fondo, {
                volume: CONFIG.audio.musicVolume,
                loop: true
            });
            this.currentMusic = audio;
        },

        startWind() {
            if (this.windPlaying) return;
            this.windPlaying = true;
            this.play(PATHS.music.viento, {
                volume: CONFIG.audio.ambientVolume,
                loop: true
            });
        },

        stopWind() {
            if (!this.windPlaying) return;
            this.windPlaying = false;
            this.stop(PATHS.music.viento);
        },

        unlock() {
            if (this.initialized) return;
            this.initialized = true;
            for (const audio of this.sounds.values()) {
                try { audio.load() } catch (_) {}
            }
        }
    };

    function preloadImages() {
        for (const path of Object.values(PATHS.general)) ImageManager.load(path);
        for (const config of Object.values(ANIMALS)) {
            for (const direction of["arriba", "abajo", "derecha", "izquierda"])
                for (let frame = 1; frame <= 2; frame++)
                    ImageManager.load(`img/${config.folder}/${direction}${frame}.png`);
        }
    }
    preloadImages();

    const Game = {
        running: false,
        gameOver: false,
        lastTime: 0,
        elapsed: 0,
        worldTime: 0,
        day: 1,
        dayProgress: 0,
        currentWeather: "DÍA",
        temperature: 5,
        player: null,
        animals: [],
        trees: [],
        waters: [],
        grasses: [],
        footprints: [],
        particles: [],
        smokes: [],
        notifications: [],
        camera: { x: 0, y: 0 },
        keys: new Set(),
        mouse: { x: 0, y: 0 },
        stats: { children: 0, food: 0, water: 0, days: 0 },
        record: 0,
        nextAnimalId: 1,
        spatialGrid: new Map(),
        sounds: { walkTimer: 0, footstepTimer: 0 }
    };

    function loadRecord() {
        try {
            const value = Number.parseInt(localStorage.getItem("snowwild-record"), 10);
            Game.record = Number.isFinite(value) ? Math.max(0, value) : 0;
        } catch (_) {
            Game.record = 0;
        }
        if (recordText) recordText.textContent = String(Game.record);
    }

    function saveRecord() {
        try {
            localStorage.setItem("snowwild-record", String(Game.record));
        } catch (_) {}
    }

    loadRecord();

    function randomWorldPosition(radius = 20) {
        return {
            x: Utils.random(CONFIG.world.edgeMargin + radius, CONFIG.world.width - CONFIG.world.edgeMargin - radius),
            y: Utils.random(CONFIG.world.edgeMargin + radius, CONFIG.world.height - CONFIG.world.edgeMargin - radius)
        };
    }

    function createTree() {
        let position = null;

        for (let attempt = 0; attempt < 100; attempt++) {
            const candidate = randomWorldPosition(40);
            if (Game.trees.every(tree => Utils.distance(candidate, tree) > 100)) {
                position = candidate;
                break;
            }
        }

        if (!position) position = randomWorldPosition(40);

        Game.trees.push({
            id: `tree-${Game.trees.length+1}`,
            x: position.x,
            y: position.y,
            width: 90,
            height: 162,
            radius: 40
        });
    }

    function createWater() {
        let position = null;

        for (let attempt = 0; attempt < 100; attempt++) {
            const candidate = randomWorldPosition(100);
            if (Game.waters.every(water => Utils.distance(candidate, water) > 650)) {
                position = candidate;
                break;
            }
        }

        if (!position) position = randomWorldPosition(100);

        Game.waters.push({
            id: `water-${Game.waters.length+1}`,
            x: position.x,
            y: position.y,
            radius: 30,
            width: 50,
            height: 50
        });
    }

    function createGrass() {
        const position = randomWorldPosition(15);

        Game.grasses.push({
            id: `grass-${Game.grasses.length+1}`,
            x: position.x,
            y: position.y,
            alive: true,
            respawn: 0
        });
    }

    class Animal {
        constructor(species, sex, x, y, isPlayer = false) {
            const config = ANIMALS[species];
            this.id = Game.nextAnimalId++;
            this.species = species;
            this.config = config;
            this.sex = sex;
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.speed = config.velocidad;
            this.maxHealth = config.maxVida;
            this.health = config.vida;
            this.food = config.comida * CONFIG.needs.startingFood;
            this.water = config.agua * CONFIG.needs.startingWater;
            this.energy = config.energia * CONFIG.needs.startingEnergy;
            this.isPlayer = isPlayer;
            this.alive = true;
            this.age = 0;
            this.growth = 1;
            this.target = null;
            this.targetType = null;
            this.aiTimer = Utils.random(0, CONFIG.ai.decisionInterval);
            this.direction = "abajo";
            this.animationTime = 0;
            this.frame = 0;
            this.lastDrawnImage = null;
            this.moving = false;
            this.lastFootprintX = x;
            this.lastFootprintY = y;
            this.attackTimer = 0;
            this.eatTimer = 0;
            this.drinkTimer = 0;
            this.mateTimer = 0;
            this.pregnant = false;
            this.pregnancyTimer = 0;
            this.birthCooldown = 0;
            this.children = 0;
            this.mateTarget = null;
            this.fleeTimer = 0;
            this.deathTimer = 0;
            this.deathReason = "";
            this.spawnTime = Game.worldTime;
            this.isChild = false;
        }

        get radius() {
            if (this.species === "rabbit") return 10;
            if (this.species === "wolf") return 18;
            if (this.species === "deer") return 19;
            return 24;
        }

        get displayScale() {
            return this.isChild ? this.growth : 1;
        }

        get canReproduce() {
            return this.alive && !this.pregnant && this.birthCooldown <= 0 && this.mateTimer <= 0 && this.age > 8 && this.energy >= CONFIG.reproduction.minimumEnergy && this.food >= CONFIG.reproduction.minimumFood && this.water >= CONFIG.reproduction.minimumWater;
        }

        get isPredator() {
            return !!this.config.predator;
        }

        takeDamage(amount, reason = "daño") {
            if (!this.alive) return;
            const damage = Utils.safeNumber(amount, 0);
            if (damage <= 0) return;

            this.health = Utils.clamp(this.health - damage, 0, this.maxHealth);

            if (this.isPlayer) {
                AudioManager.play(PATHS.music.dano, { volume: CONFIG.audio.effectsVolume });
                showNotice(`-${Math.ceil(damage)} VIDA`);
            }

            if (this.health <= 0) this.die(reason);
        }

        heal(amount) {
            this.health = Utils.clamp(this.health + amount, 0, this.maxHealth);
        }

        die(reason = "muerte") {
            if (!this.alive) return;

            this.alive = false;
            this.deathReason = reason;
            this.vx = 0;
            this.vy = 0;
            this.deathTimer = CONFIG.combat.corpseDuration;

            createSmoke(this.x, this.y);
            playAnimalDeathSound(this.species);

            if (this.isPlayer) endGame(reason);
        }

        update(dt) {
            if (!this.alive) {
                this.deathTimer -= dt * 1000;
                return;
            }

            this.age += dt;
            this.attackTimer -= dt * 1000;
            this.eatTimer -= dt * 1000;
            this.drinkTimer -= dt * 1000;
            this.mateTimer -= dt * 1000;
            this.birthCooldown -= dt * 1000;

            if (this.birthCooldown < 0) this.birthCooldown = 0;

            this.updateNeeds(dt);
            this.updatePregnancy(dt);

            if (this.isPlayer) updatePlayer(this, dt);
            else updateAnimalAI(this, dt);

            this.applyMovement(dt);
            this.updateAnimation(dt);
            this.checkNightShelter();
            this.keepInsideWorld();
        }

        updateNeeds(dt) {
            const moving = Math.abs(this.vx) + Math.abs(this.vy) > 0.5;

            this.food -= CONFIG.needs.hungerLossPerSecond * dt;
            this.water -= CONFIG.needs.thirstLossPerSecond * dt;
            this.energy -= CONFIG.needs.energyLossPerSecond * dt;

            if (moving) this.energy -= CONFIG.needs.movementEnergyLoss * dt;

            this.food = Utils.clamp(this.food, 0, CONFIG.needs.max);
            this.water = Utils.clamp(this.water, 0, CONFIG.needs.max);
            this.energy = Utils.clamp(this.energy, 0, CONFIG.needs.max);

            if (this.food <= 0) this.takeDamage(CONFIG.needs.starvationDamage * dt, "hambre");
            if (this.water <= 0) this.takeDamage(CONFIG.needs.dehydrationDamage * dt, "sed");

            if (!moving && this.food > 20 && this.water > 20) {
                this.energy = Utils.clamp(this.energy + CONFIG.needs.energyRegeneration * dt, 0, 100);
            }
        }

        updatePregnancy(dt) {
            if (!this.pregnant) return;

            this.pregnancyTimer -= dt * 1000;

            if (this.pregnancyTimer <= 0) this.giveBirth();
        }

        giveBirth() {
            if (!this.pregnant) return;

            this.pregnant = false;
            this.pregnancyTimer = 0;
            this.birthCooldown = CONFIG.reproduction.birthCooldown;
            this.children++;

            if (this.isPlayer) {
                Game.stats.children++;
                showNotice("¡HA NACIDO UN HIJO!");
            }

            if (Game.animals.filter(animal => animal.alive).length < CONFIG.reproduction.maxPopulation) {
                const childSex = Utils.chance(0.5) ? "female" : "male";
                const offset = Utils.random(-20, 20);

                const child = new Animal(
                    this.species,
                    childSex,
                    Utils.clamp(this.x + offset, 30, CONFIG.world.width - 30),
                    Utils.clamp(this.y + offset, 30, CONFIG.world.height - 30),
                    false
                );

                child.isChild = true;
                child.growth = this.config.childSize;
                child.food = CONFIG.reproduction.childFood;
                child.water = CONFIG.reproduction.childWater;
                child.energy = CONFIG.reproduction.childEnergy;
                child.age = 0;

                Game.animals.push(child);
            }
        }

        applyMovement(dt) {
            if (!this.alive) return;

            const oldX = this.x,
                oldY = this.y;
            const maxSpeed = this.speed * this.displayScale;
            const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

            if (velocity > maxSpeed) {
                const ratio = maxSpeed / velocity;
                this.vx *= ratio;
                this.vy *= ratio;
            }

            this.x += this.vx * dt;
            this.resolveTreeCollisions();
            this.y += this.vy * dt;
            this.resolveTreeCollisions();

            const moved = Utils.distance({ x: oldX, y: oldY }, this) > 0.1;
            this.moving = moved;

            if (!moved) {
                this.vx *= Math.pow(CONFIG.movement.playerFriction, dt * 60);
                this.vy *= Math.pow(CONFIG.movement.playerFriction, dt * 60);
            }
        }

        resolveTreeCollisions() {
            for (const tree of Game.trees) {
                const dx = this.x - tree.x,
                    dy = this.y - tree.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = this.radius + tree.radius + CONFIG.movement.collisionPadding;

                if (distance > 0 && distance < minDistance) {
                    const nx = dx / distance,
                        ny = dy / distance;
                    const overlap = minDistance - distance;

                    this.x += nx * overlap;
                    this.y += ny * overlap;
                    this.vx *= 0.3;
                    this.vy *= 0.3;
                }
            }
        }

        keepInsideWorld() {
            const margin = this.radius + 2;
            this.x = Utils.clamp(this.x, margin, CONFIG.world.width - margin);
            this.y = Utils.clamp(this.y, margin, CONFIG.world.height - margin);
        }

        updateAnimation(dt) {
            this.animationTime += dt * 1000;

            const duration = this.moving ? CONFIG.animation.frameDuration : CONFIG.animation.idleFrameDuration;

            if (this.animationTime >= duration) {
                this.animationTime = 0;
                this.frame = this.frame === 0 ? 1 : 0;
            }

            if (Math.abs(this.vx) > Math.abs(this.vy)) {
                if (this.vx > 0) this.direction = "derecha";
                else if (this.vx < 0) this.direction = "izquierda";
            } else if (Math.abs(this.vy) > 0.1) {
                if (this.vy > 0) this.direction = "abajo";
                else this.direction = "arriba";
            }
        }

        checkNightShelter() {
            if (!Game.isNight || this.config.polarBear) return;

            const nearTree = Game.trees.some(tree => Utils.distance(this, tree) <= CONFIG.night.shelterDistance);
            const nearAnimal = Game.animals.some(other => other !== this && other.alive && Utils.distance(this, other) <= CONFIG.night.animalShelterDistance);

            if (!nearTree && !nearAnimal) {
                this.takeDamage(CONFIG.night.coldDamagePerSecond * Game.nightIntensity * 0.12, "frío");
            }
        }
    }

    function createAnimal(species, sex, isPlayer = false) {
        const position = randomWorldPosition(30);
        return new Animal(species, sex, position.x, position.y, isPlayer);
    }

    function createInitialPopulation() {
        const order = ["rabbit", "deer", "wolf", "bear"];

        for (const species of order) {
            const config = ANIMALS[species];

            for (let i = 0; i < config.sexoInicial.female; i++)
                Game.animals.push(createAnimal(species, "female"));

            for (let i = 0; i < config.sexoInicial.male; i++)
                Game.animals.push(createAnimal(species, "male"));
        }
    }

    function selectRandomPlayer() {
        const available = Game.animals.filter(animal => animal.alive);
        if (!available.length) return null;
        const player = Utils.randomChoice(available);
        player.isPlayer = true;
        Game.player = player;
        return player;
    }

    function resetWorld() {
        Game.animals = [];
        Game.trees = [];
        Game.waters = [];
        Game.grasses = [];
        Game.footprints = [];
        Game.particles = [];
        Game.smokes = [];
        Game.notifications = [];
        Game.spatialGrid.clear();
        Game.nextAnimalId = 1;
        Game.day = 1;
        Game.worldTime = 0;
        Game.elapsed = 0;
        Game.player = null;
        Game.gameOver = false;
        Game.running = true;
        Game.stats.children = 0;
        Game.stats.food = 0;
        Game.stats.water = 0;
        Game.stats.days = 0;

        for (let i = 0; i < CONFIG.world.treeCount; i++) createTree();
        for (let i = 0; i < CONFIG.world.waterCount; i++) createWater();
        for (let i = 0; i < CONFIG.world.grassCount; i++) createGrass();

        createInitialPopulation();
        selectRandomPlayer();
        updateCamera(true);
        updateHUD();
        updateObjective();
        showNotice(`Eres un ${ANIMALS[Game.player.species].name}. Sobrevive.`);
    }

    Object.defineProperty(Game, "isNight", {
        get() {
            const cycle = Game.worldTime % CONFIG.time.cycleDuration;
            return cycle >= CONFIG.time.dayDuration;
        }
    });

    Object.defineProperty(Game, "nightIntensity", {
        get() {
            const cycle = Game.worldTime % CONFIG.time.cycleDuration;
            if (cycle < CONFIG.time.dayDuration) return 0;

            const nightTime = cycle - CONFIG.time.dayDuration;
            const transition = CONFIG.night.transitionDuration;

            if (nightTime < transition)
                return Utils.clamp(nightTime / transition, 0, 1) * CONFIG.night.maxDarkness;

            const remaining = CONFIG.time.nightDuration - nightTime;

            if (remaining < transition)
                return Utils.clamp(remaining / transition, 0, 1) * CONFIG.night.maxDarkness;

            return CONFIG.night.maxDarkness;
        }
    });

    function updateWorldTime(dt) {
        const previousNight = Game.isNight;

        Game.worldTime += dt * 1000;

        const cycle = Game.worldTime % CONFIG.time.cycleDuration;

        Game.day = Math.floor(Game.worldTime / CONFIG.time.cycleDuration) + 1;
        Game.dayProgress = cycle / CONFIG.time.cycleDuration;

        const nowNight = Game.isNight;

        if (!previousNight && nowNight) {
            AudioManager.startWind();
            showNotice("CAYÓ LA NOCHE — BUSCA REFUGIO");
        }

        if (previousNight && !nowNight) {
            AudioManager.stopWind();
            AudioManager.play(PATHS.music.puntos, { volume: CONFIG.audio.effectsVolume });
            showNotice(`AMANECIÓ — DÍA ${Game.day}`);
        }

        if (Game.isNight) {
            Game.currentWeather = "NOCHE FRÍA";
            Game.temperature = Utils.lerp(
                CONFIG.night.maximumTemperature,
                CONFIG.night.minimumTemperature,
                Game.nightIntensity / CONFIG.night.maxDarkness
            );
        } else {
            Game.currentWeather = "DÍA";
            Game.temperature = CONFIG.night.maximumTemperature;
        }

        Game.stats.days = Math.max(0, Game.day - 1);
    }

    function updatePlayer(player, dt) {
        let dx = 0,
            dy = 0;

        if (Game.keys.has("w") || Game.keys.has("arrowup")) dy -= 1;
        if (Game.keys.has("s") || Game.keys.has("arrowdown")) dy += 1;
        if (Game.keys.has("a") || Game.keys.has("arrowleft")) dx -= 1;
        if (Game.keys.has("d") || Game.keys.has("arrowright")) dx += 1;

        const direction = Utils.normalize(dx, dy);
        const acceleration = CONFIG.movement.playerAcceleration;

        if (direction.x !== 0 || direction.y !== 0) {
            player.vx += direction.x * acceleration * dt;
            player.vy += direction.y * acceleration * dt;

            const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
            const max = player.speed;

            if (speed > max) {
                player.vx = player.vx / speed * max;
                player.vy = player.vy / speed * max;
            }
        } else {
            const friction = Math.pow(CONFIG.movement.playerFriction, dt * 60);

            player.vx *= friction;
            player.vy *= friction;

            if (Math.abs(player.vx) < 0.5) player.vx = 0;
            if (Math.abs(player.vy) < 0.5) player.vy = 0;
        }

        if (player.moving && player.config.canWalkSound) {
            Game.sounds.walkTimer -= dt * 1000;
            Game.sounds.footstepTimer -= dt * 1000;

            if (Game.sounds.walkTimer <= 0) {
                AudioManager.play(PATHS.music.caminar, { volume: 0.18, restart: true });
                Game.sounds.walkTimer = 700;
            }

            if (Game.sounds.footstepTimer <= 0) {
                AudioManager.play(PATHS.music.pasos, { volume: 0.12, restart: true });
                Game.sounds.footstepTimer = 500;
            }
        }
    }

    function updateAnimalAI(animal, dt) {
        animal.aiTimer -= dt * 1000;
        if (animal.fleeTimer > 0) animal.fleeTimer -= dt * 1000;

        const threat = findThreat(animal);
        if (threat) {
            fleeFrom(animal, threat);
            return;
        }

        if (animal.aiTimer <= 0) {
            animal.aiTimer = Utils.random(
                CONFIG.ai.decisionInterval * .6,
                CONFIG.ai.decisionInterval * 1.6
            );
            chooseAnimalAction(animal);
        }

        executeAnimalTarget(animal);
    }

    function chooseAnimalAction(animal) {
        animal.target = null;
        animal.targetType = null;

        if (animal.water < 38) {
            const water = findNearestWater(animal);
            if (water) {
                animal.target = water;
                animal.targetType = "water";
                return;
            }
        }

        if (animal.food < 38) {
            if (animal.config.eatsGrass) {
                const grass = findNearestGrass(animal);
                if (grass) {
                    animal.target = grass;
                    animal.targetType = "grass";
                    return;
                }
            } else if (animal.config.hunts.length) {
                const prey = findNearestPrey(animal);
                if (prey) {
                    animal.target = prey;
                    animal.targetType = "prey";
                    return;
                }
            }
        }

        if (animal.canReproduce && Utils.chance(.22)) {
            const mate = findMate(animal);
            if (mate) {
                animal.target = mate;
                animal.targetType = "mate";
                return;
            }
        }

        if (animal.isPredator && animal.food < 75 && Utils.chance(.45)) {
            const prey = findNearestPrey(animal);
            if (prey) {
                animal.target = prey;
                animal.targetType = "prey";
                return;
            }
        }

        if (Utils.chance(CONFIG.ai.wanderChance)) {
            animal.target = {
                x: Utils.clamp(
                    animal.x + Utils.random(-400, 400),
                    50,
                    CONFIG.world.width - 50
                ),
                y: Utils.clamp(
                    animal.y + Utils.random(-400, 400),
                    50,
                    CONFIG.world.height - 50
                )
            };
            animal.targetType = "wander";
        }
    }

    function executeAnimalTarget(animal) {
        if (!animal.target) {
            animal.vx *= .96;
            animal.vy *= .96;
            return;
        }

        if (animal.targetType === "prey") {
            if (!animal.target.alive) {
                animal.target = null;
                return;
            }

            const distance = Utils.distance(animal, animal.target);

            if (distance <= CONFIG.food.animalEatDistance) {
                eatAnimal(animal, animal.target);
                return;
            }

            moveToward(animal, animal.target);
            return;
        }

        if (animal.targetType === "water") {
            const distance = Utils.distance(animal, animal.target);

            if (distance <= animal.target.radius + CONFIG.water.drinkDistance) {
                drinkWater(animal);
                return;
            }

            moveToward(animal, animal.target);
            return;
        }

        if (animal.targetType === "grass") {
            if (!animal.target.alive) {
                animal.target = null;
                return;
            }

            const distance = Utils.distance(animal, animal.target);

            if (distance <= CONFIG.food.grassEatDistance) {
                eatGrass(animal, animal.target);
                return;
            }

            moveToward(animal, animal.target);
            return;
        }

        if (animal.targetType === "mate") {
            if (!animal.target.alive) {
                animal.target = null;
                return;
            }

            const distance = Utils.distance(animal, animal.target);

            if (distance <= CONFIG.reproduction.matingDistance) {
                tryMate(animal, animal.target);
                return;
            }

            moveToward(animal, animal.target);
            return;
        }

        if (animal.targetType === "wander") {
            const distance = Utils.distance(animal, animal.target);

            if (distance < CONFIG.movement.stopDistance) {
                animal.target = null;
                return;
            }

            moveToward(animal, animal.target);
        }
    }

    function moveToward(animal, target) {
        const direction = Utils.normalize(
            target.x - animal.x,
            target.y - animal.y
        );

        const desiredSpeed = animal.speed * animal.displayScale;

        animal.vx = Utils.lerp(
            animal.vx,
            direction.x * desiredSpeed,
            .09
        );

        animal.vy = Utils.lerp(
            animal.vy,
            direction.y * desiredSpeed,
            .09
        );
    }

    function fleeFrom(animal, threat) {
        const direction = Utils.normalize(
            animal.x - threat.x,
            animal.y - threat.y
        );

        animal.vx = direction.x * animal.speed;
        animal.vy = direction.y * animal.speed;
        animal.fleeTimer = 700;
    }

    function findThreat(animal) {
        const threats = animal.config.fleeFrom;

        if (!threats || !threats.length) return null;

        let closest = null;
        let closestDistance = CONFIG.movement.fleeDistance;

        for (const other of Game.animals) {
            if (other === animal || !other.alive) continue;
            if (!threats.includes(other.species)) continue;

            const distance = Utils.distance(animal, other);

            if (distance < closestDistance) {
                closest = other;
                closestDistance = distance;
            }
        }

        return closest;
    }

    function findNearestWater(animal) {
        let best = null,
            bestDistance = Infinity;
        for (const water of Game.waters) {
            const d = Utils.distance(animal, water);
            if (d < bestDistance) best = water, bestDistance = d;
        }
        return best;
    }

    function findNearestGrass(animal) {
        let best = null,
            bestDistance = Infinity;
        for (const grass of Game.grasses) {
            if (!grass.alive) continue;
            const d = Utils.distance(animal, grass);
            if (d < bestDistance) best = grass, bestDistance = d;
        }
        return best;
    }

    function findNearestPrey(predator) {
        let best = null,
            bestDistance = CONFIG.movement.chaseDistance;
        for (const animal of Game.animals) {
            if (animal === predator || !animal.alive || !predator.config.hunts.includes(animal.species)) continue;
            const d = Utils.distance(predator, animal);
            if (d < bestDistance) best = animal, bestDistance = d;
        }
        return best;
    }

    function findMate(animal) {
        let best = null,
            bestDistance = CONFIG.reproduction.searchDistance;
        for (const other of Game.animals) {
            if (other === animal || !other.alive || other.species !== animal.species || other.sex === animal.sex || !other.canReproduce) continue;
            const d = Utils.distance(animal, other);
            if (d < bestDistance) best = other, bestDistance = d;
        }
        return best;
    }

    function eatGrass(animal, grass) {
        if (!animal.alive || !grass || !grass.alive || animal.eatTimer > 0 || !animal.config.eatsGrass) return;
        grass.alive = false;
        grass.respawn = Utils.random(18000, 35000);
        animal.food = Utils.clamp(animal.food + CONFIG.food.grassFood, 0, 100);
        animal.energy = Utils.clamp(animal.energy + 7, 0, 100);
        animal.eatTimer = CONFIG.food.eatCooldown;
        if (animal.isPlayer) showNotice("Comiste pasto.");
    }

    function eatAnimal(predator, prey) {
        if (!predator.alive || !prey || !prey.alive || predator.eatTimer > 0 || !predator.config.hunts.includes(prey.species)) return;
        if (Utils.distance(predator, prey) > CONFIG.food.animalEatDistance) return;

        prey.takeDamage(predator.config.attackDamage, "depredación");
        predator.eatTimer = CONFIG.food.eatCooldown;
        predator.energy = Utils.clamp(predator.energy + 4, 0, 100);

        if (prey.health <= 0 || !prey.alive) {
            predator.food = Utils.clamp(
                predator.food + (prey.species === "rabbit" ? CONFIG.food.rabbitFood : CONFIG.food.deerFood),
                0, 100
            );
            AudioManager.play(PATHS.music.dano, { volume: CONFIG.audio.effectsVolume });
        }
    }

    function drinkWater(animal) {
        if (!animal.alive || animal.drinkTimer > 0) return;

        const water = findNearestWater(animal);
        if (!water || Utils.distance(animal, water) > water.radius + CONFIG.water.drinkDistance) return;

        animal.water = Utils.clamp(animal.water + CONFIG.water.drinkAmount, 0, 100);
        animal.drinkTimer = CONFIG.water.drinkCooldown;

        AudioManager.play(PATHS.music.agua, { volume: .3 });

        if (animal.isPlayer) showNotice("Bebiste agua.");
    }

    function tryMate(animalA, animalB) {
        if (!animalA.alive || !animalB.alive || animalA.species !== animalB.species || animalA.sex === animalB.sex || !animalA.canReproduce || !animalB.canReproduce) return false;
        if (Utils.distance(animalA, animalB) > CONFIG.reproduction.matingDistance) return false;

        const female = animalA.sex === "female" ? animalA : animalB;
        const male = animalA.sex === "male" ? animalA : animalB;

        female.pregnant = true;
        female.pregnancyTimer = CONFIG.reproduction.pregnancyDuration;
        female.mateTimer = CONFIG.reproduction.matingCooldown;
        male.mateTimer = CONFIG.reproduction.matingCooldown;
        female.energy -= 10;
        male.energy -= 6;
        female.food -= 5;
        male.food -= 3;
        female.mateTarget = male;
        male.mateTarget = female;

        if (animalA.isPlayer || animalB.isPlayer)
            showNotice("Se aparearon. La cría nacerá pronto.");

        return true;
    }

    function createFootprint(animal) {
        if (!animal.config.canWalkSound) return;

        const distance = Utils.distance({ x: animal.lastFootprintX, y: animal.lastFootprintY },
            animal
        );

        if (distance < CONFIG.animation.footprintDistance) return;

        Game.footprints.push({
            x: animal.x,
            y: animal.y,
            rotation: Math.atan2(animal.vy, animal.vx),
            life: CONFIG.animation.footprintDuration
        });

        animal.lastFootprintX = animal.x;
        animal.lastFootprintY = animal.y;

        if (Game.footprints.length > CONFIG.performance.maxFootprints)
            Game.footprints.shift();
    }

    function updateFootprints(dt) {
        for (let i = Game.footprints.length - 1; i >= 0; i--) {
            const footprint = Game.footprints[i];
            footprint.life -= dt * 1000;

            if (footprint.life <= 0)
                Game.footprints.splice(i, 1);
        }

        for (const animal of Game.animals) {
            if (animal.alive && animal.moving && animal.config.canWalkSound)
                createFootprint(animal);
        }
    }

    function createSmoke(x, y) {
        Game.smokes.push({
            x,
            y,
            life: CONFIG.combat.smokeDuration,
            frame: 0,
            animation: 0
        });
    }

    function updateSmoke(dt) {
        for (let i = Game.smokes.length - 1; i >= 0; i--) {
            const smoke = Game.smokes[i];

            smoke.life -= dt * 1000;
            smoke.animation += dt * 1000;

            if (smoke.animation >= CONFIG.animation.smokeFrameDuration) {
                smoke.animation = 0;
                smoke.frame = smoke.frame === 0 ? 1 : 0;
            }

            smoke.y -= 7 * dt;

            if (smoke.life <= 0)
                Game.smokes.splice(i, 1);
        }
    }

    function playAnimalDeathSound(species) {
        const config = ANIMALS[species];
        if (!config) return;

        const path = `music/${config.folder}/${config.folder}.mp3`;
        AudioManager.play(path, { volume: .42 });
    }

    function updateGrass(dt) {
        for (const grass of Game.grasses) {
            if (grass.alive) continue;

            grass.respawn -= dt * 1000;

            if (grass.respawn <= 0) {
                const position = randomWorldPosition(15);
                grass.x = position.x;
                grass.y = position.y;
                grass.alive = true;
            }
        }
    }

    function cleanupAnimals() {
        Game.animals = Game.animals.filter(
            animal => animal.alive || animal.deathTimer > 0
        );
    }

    function updateCamera(immediate = false) {
        if (!Game.player) return;

        const targetX = Game.player.x - CONFIG.canvas.width / 2;
        const targetY = Game.player.y - CONFIG.canvas.height / 2;
        const maxX = CONFIG.world.width - CONFIG.canvas.width;
        const maxY = CONFIG.world.height - CONFIG.canvas.height;

        const clampedX = Utils.clamp(targetX, 0, Math.max(0, maxX));
        const clampedY = Utils.clamp(targetY, 0, Math.max(0, maxY));

        if (immediate) {
            Game.camera.x = clampedX;
            Game.camera.y = clampedY;
            return;
        }

        Game.camera.x = Utils.lerp(Game.camera.x, clampedX, .12);
        Game.camera.y = Utils.lerp(Game.camera.y, clampedY, .12);
    }

    function worldToScreen(x, y) {
        return {
            x: x - Game.camera.x,
            y: y - Game.camera.y
        };
    }

    function drawWorld() {
        ctx.fillStyle = CONFIG.canvas.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawWater();
        drawGrass();
        drawFootprints();
        drawTrees();
        drawAnimals();
        drawSmoke();
        drawNightOverlay();
    }

    function drawGround() {
        const map = ImageManager.load(PATHS.general.mapa);

        if (map && map.complete && map.naturalWidth > 0) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                map, -Game.camera.x, -Game.camera.y,
                CONFIG.world.width,
                CONFIG.world.height
            );
            ctx.restore();
            return;
        }

        ctx.fillStyle = "#b9d2ad";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawWater() {
        const image = ImageManager.load(PATHS.general.agua);

        for (const water of Game.waters) {
            const screen = worldToScreen(water.x, water.y);
            const { width, height } = water;

            if (
                screen.x + width < 0 ||
                screen.y + height < 0 ||
                screen.x - width > canvas.width ||
                screen.y - height > canvas.height
            ) continue;

            if (!ImageManager.draw(
                    image,
                    screen.x - width / 2,
                    screen.y - height / 2,
                    width,
                    height
                )) {
                ctx.save();
                ctx.fillStyle = "#66aeca";
                ctx.beginPath();
                ctx.ellipse(
                    screen.x,
                    screen.y,
                    width / 2,
                    height / 2,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.restore();
            }
        }
    }

    function drawGrass() {
        const image = ImageManager.load(PATHS.general.pasto);

        for (const grass of Game.grasses) {
            if (!grass.alive) continue;

            const screen = worldToScreen(grass.x, grass.y);

            if (
                screen.x < -20 ||
                screen.x > canvas.width + 20 ||
                screen.y < -20 ||
                screen.y > canvas.height + 20
            ) continue;

            if (!ImageManager.draw(
                    image,
                    screen.x - 7,
                    screen.y - 7,
                    14,
                    14
                )) {
                ctx.fillStyle = "#78a85e";
                ctx.fillRect(
                    Math.round(screen.x - 3),
                    Math.round(screen.y - 3),
                    6,
                    6
                );
            }
        }
    }

    function drawFootprints() {
        const image = ImageManager.load(PATHS.general.huella);

        for (const footprint of Game.footprints) {
            const screen = worldToScreen(
                footprint.x,
                footprint.y
            );

            if (
                screen.x < -20 ||
                screen.x > canvas.width + 20 ||
                screen.y < -20 ||
                screen.y > canvas.height + 20
            ) continue;

            const alpha = Utils.clamp(
                footprint.life / CONFIG.animation.footprintDuration,
                0,
                1
            ) * .48;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(screen.x, screen.y);
            ctx.rotate(footprint.rotation);

            if (image && image.complete && image.naturalWidth > 0) {
                ctx.drawImage(image, -6, -6, 12, 12);
            } else {
                ctx.fillStyle = "#dce7d7";
                ctx.fillRect(-3, -3, 6, 6);
            }

            ctx.restore();
        }
    }

    function drawTrees() {
        const image = ImageManager.load(PATHS.general.arbol);

        for (const tree of Game.trees) {
            const screen = worldToScreen(tree.x, tree.y);
            const { width, height } = tree;

            if (
                screen.x + width < 0 ||
                screen.x - width > canvas.width ||
                screen.y + height < 0 ||
                screen.y - height > canvas.height
            ) continue;

            if (!ImageManager.draw(
                    image,
                    screen.x - width / 2,
                    screen.y - height + 12,
                    width,
                    height
                )) {
                ctx.fillStyle = "#294b32";
                ctx.fillRect(
                    screen.x - 12,
                    screen.y - 45,
                    24,
                    45
                );

                ctx.fillStyle = "#38633e";
                ctx.beginPath();
                ctx.arc(
                    screen.x,
                    screen.y - 42,
                    27,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    function getAnimalImage(animal) {
        const path =
            `img/${animal.config.folder}/${animal.direction}${animal.frame + 1}.png`;

        const image = ImageManager.load(path);

        if (
            image &&
            image.complete &&
            image.naturalWidth > 0
        ) {
            animal.lastDrawnImage = image;
            return image;
        }

        // Si la nueva dirección/frame todavía no cargó,
        // usamos la última imagen válida.
        return animal.lastDrawnImage;
    }


    function drawAnimals() {
        const visible = Game.animals
            .filter(animal => animal.alive || animal.deathTimer > 0)
            .slice()
            .sort((a, b) => a.y - b.y);

        for (const animal of visible) {
            const screen = worldToScreen(animal.x, animal.y);
            const scale = animal.displayScale;

            let width, height;

            if (
                animal.direction === "derecha" ||
                animal.direction === "izquierda"
            ) {
                width = animal.config.anchohorizontal * 8 * scale;
                height = animal.config.alturahorizontal * 8 * scale;
            } else {
                width = animal.config.anchovertical * 8 * scale;
                height = animal.config.alturavertical * 8 * scale;
            }

            if (
                screen.x + width < 0 ||
                screen.x - width > canvas.width ||
                screen.y + height < 0 ||
                screen.y - height > canvas.height
            ) continue;

            if (!animal.alive) {
                ctx.save();
                ctx.globalAlpha = Utils.clamp(
                    animal.deathTimer / CONFIG.combat.corpseDuration,
                    0,
                    1
                );
                ctx.translate(screen.x, screen.y);
                ctx.scale(1, .45);

                const deadImage = getAnimalImage(animal);

                if (
                    deadImage &&
                    deadImage.complete &&
                    deadImage.naturalWidth > 0
                ) {
                    ctx.drawImage(
                        deadImage, -width / 2, -height / 2,
                        width,
                        height
                    );
                } else {
                    ctx.fillStyle = "#555";
                    ctx.fillRect(-animal.radius, -animal.radius / 2,
                        animal.radius * 2,
                        animal.radius
                    );
                }

                ctx.restore();
                continue;
            }

            const image = getAnimalImage(animal);

            if (image) {
                ImageManager.draw(
                    image,
                    screen.x - width / 2,
                    screen.y - height + 10,
                    width,
                    height
                );
            }


            drawAnimalHealth(animal, screen, width);

            if (animal.isPlayer)
                drawPlayerIndicator(screen);
        }
    }

    function drawAnimalHealth(animal, screen, width) {
        const barWidth = Math.max(18, Math.min(48, width));
        const x = screen.x - barWidth / 2;
        const y = screen.y - Math.max(30, width * .55);

        ctx.fillStyle = "rgba(0,0,0,.55)";
        ctx.fillRect(x, y, barWidth, 3);

        ctx.fillStyle = animal.sex === "female" ? "#f09ab6" : "#6ccce7";
        ctx.fillRect(
            x,
            y,
            barWidth * Utils.clamp(
                animal.health / animal.maxHealth,
                0,
                1
            ),
            3
        );
    }

    function drawPlayerIndicator(screen) {
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = .75;
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y - 36);
        ctx.lineTo(screen.x - 5, screen.y - 44);
        ctx.lineTo(screen.x + 5, screen.y - 44);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawSmoke() {
        const images = [
            ImageManager.load(PATHS.general.humo1),
            ImageManager.load(PATHS.general.humo2)
        ];

        for (const smoke of Game.smokes) {
            const screen = worldToScreen(smoke.x, smoke.y);
            const image = images[smoke.frame];
            const alpha = Utils.clamp(
                smoke.life / CONFIG.combat.smokeDuration,
                0,
                1
            );

            if (!ImageManager.draw(
                    image,
                    screen.x - 16,
                    screen.y - 38,
                    32,
                    40,
                    alpha
                )) {
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = "#e8eee9";
                ctx.beginPath();
                ctx.arc(screen.x, screen.y - 20, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    function drawNightOverlay() {
        const intensity = Game.nightIntensity;
        if (intensity <= 0) return;

        ctx.save();
        ctx.fillStyle = `rgba(7,15,31,${intensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            100,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * .75
        );

        gradient.addColorStop(0, "rgba(50,75,100,0)");
        gradient.addColorStop(1, `rgba(5,10,25,${intensity*.35})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    function updateHUD() {
        if (!Game.player) return;

        const player = Game.player;
        const species = ANIMALS[player.species];

        if (hpBar) hpBar.style.width = `${Utils.clamp(player.health/player.maxHealth*100,0,100)}%`;
        if (hpText) hpText.textContent = `${Math.ceil(player.health)}/${player.maxHealth}`;

        if (foodBar) foodBar.style.width = `${player.food}%`;
        if (foodText) foodText.textContent = `${Math.ceil(player.food)}`;

        if (waterBar) waterBar.style.width = `${player.water}%`;
        if (waterText) waterText.textContent = `${Math.ceil(player.water)}`;

        if (energyBar) energyBar.style.width = `${player.energy}%`;
        if (energyText) energyText.textContent = `${Math.ceil(player.energy)}`;

        if (speciesName) speciesName.textContent = species.name;

        if (weatherText) {
            weatherText.textContent =
                `${Game.currentWeather} · ${Math.round(Game.temperature)}°C`;
        }

        if (clockText) {
            const cycle = Game.worldTime % CONFIG.time.cycleDuration;
            const daySeconds = cycle / 1000;
            const minutes =
                6 * 60 +
                daySeconds * CONFIG.time.gameMinutesPerRealSecond;

            clockText.textContent = Utils.formatTime(minutes);
        }

        if (dayText) dayText.textContent = String(Game.day);

        if (recordText) {
            recordText.textContent = String(
                Math.max(Game.record, Game.stats.days)
            );
        }
    }

    function updateObjective() {
        if (!objectiveText || !Game.player) return;

        const player = Game.player;

        if (Game.isNight && !isPlayerSheltered()) {
            objectiveText.textContent =
                "La noche es peligrosa. Acércate a un árbol o a otro animal.";
            return;
        }

        if (player.water < 30) {
            objectiveText.textContent =
                "Tienes poca agua. Busca uno de los lagos.";
            return;
        }

        if (player.food < 30) {
            objectiveText.textContent = player.config.eatsGrass ?
                "Tienes poca comida. Busca pasto." :
                "Tienes poca comida. Busca una presa.";
            return;
        }

        if (player.energy < 25) {
            objectiveText.textContent =
                "Tu energía está baja. Reduce el movimiento.";
            return;
        }

        objectiveText.textContent =
            "Sobrevive, encuentra comida, agua y una pareja.";
    }

    function isPlayerSheltered() {
        const player = Game.player;
        if (!player) return false;
        if (player.config.polarBear) return true;

        if (Game.trees.some(
                tree => Utils.distance(player, tree) <= CONFIG.night.shelterDistance
            )) return true;

        return Game.animals.some(
            animal =>
            animal !== player &&
            animal.alive &&
            Utils.distance(player, animal) <= CONFIG.night.animalShelterDistance
        );
    }

    function showNotice(message, duration = 2300) {
        if (!notice) return;

        notice.textContent = String(message);
        notice.hidden = false;

        clearTimeout(showNotice._timer);

        showNotice._timer = setTimeout(() => {
            if (notice) notice.hidden = true;
        }, duration);
    }

    function playerEat() {
        const player = Game.player;
        if (!player || !player.alive || player.eatTimer > 0) return;

        if (player.config.eatsGrass) {
            const grass = findNearestGrass(player);
            if (grass && Utils.distance(player, grass) <= CONFIG.food.grassEatDistance) {
                eatGrass(player, grass);
                return;
            }
        }

        if (player.config.hunts.length) {
            const prey = findNearestPrey(player);
            if (prey && Utils.distance(player, prey) <= CONFIG.food.animalEatDistance) {
                eatAnimal(player, prey);
                return;
            }
        }

        showNotice(
            player.config.eatsGrass ?
            "No hay pasto suficientemente cerca." :
            "No hay una presa suficientemente cerca."
        );
    }

    function playerDrink() {
        const player = Game.player;
        if (!player || !player.alive) return;

        const water = findNearestWater(player);

        if (
            water &&
            Utils.distance(player, water) <=
            water.radius + CONFIG.water.drinkDistance
        ) {
            drinkWater(player);
            return;
        }

        showNotice("No estás cerca del agua.");
    }

    function playerMate() {
        const player = Game.player;
        if (!player || !player.alive) return;

        if (!player.canReproduce) {
            if (player.pregnant) {
                showNotice("Ya estás esperando una cría.");
            } else if (player.birthCooldown > 0) {
                showNotice("Debes esperar antes de reproducirte otra vez.");
            } else {
                showNotice("Necesitas más energía, comida o agua.");
            }
            return;
        }

        const mate = findMate(player);

        if (!mate) {
            showNotice("No hay una pareja compatible cerca.");
            return;
        }

        if (
            Utils.distance(player, mate) >
            CONFIG.reproduction.matingDistance
        ) {
            showNotice("Acércate a tu pareja.");
            return;
        }

        tryMate(player, mate);
    }

    function normalizeKey(key) {
        return String(key).toLowerCase();
    }

    window.addEventListener("keydown", event => {
        const key = normalizeKey(event.key);
        const controlledKeys = [
            "w", "a", "s", "d",
            "arrowup", "arrowdown", "arrowleft", "arrowright",
            "f", "g", "r"
        ];

        if (controlledKeys.includes(key)) event.preventDefault();

        Game.keys.add(key);

        if (event.repeat || !Game.running) return;

        if (key === "f") playerEat();
        if (key === "g") playerDrink();
        if (key === "r") playerMate();
    }, { passive: false });

    window.addEventListener("keyup", event => {
        Game.keys.delete(normalizeKey(event.key));
    });

    window.addEventListener("blur", () => Game.keys.clear());

    function showGame() {
        if (menu) menu.hidden = true;
        if (hud) hud.hidden = false;
    }

    function showMenu() {
        if (menu) menu.hidden = false;
        if (hud) hud.hidden = true;
    }

    if (startButton) {
        startButton.addEventListener("click", () => {
            AudioManager.unlock();
            AudioManager.stopAll();
            resetWorld();
            showGame();
            AudioManager.startGameMusic();
        });
    }

    if (serversButton) {
        serversButton.addEventListener("click", () => {
            try { alert("No disponible aún"); } catch (_) {}
            showNotice("Modo servidores todavía no está conectado.");
        });
    }

    if (exitButton) {
        exitButton.addEventListener("click", () => {
            try { window.close(); } catch (_) {}
            showNotice("El navegador no permite cerrar esta pestaña automáticamente.");
        });
    }

    function endGame(reason) {
        if (Game.gameOver) return;

        Game.gameOver = true;
        Game.running = false;

        const survivedDays = Math.max(0, Game.day - 1);
        Game.stats.days = survivedDays;

        if (survivedDays > Game.record) {
            Game.record = survivedDays;
            saveRecord();
        }

        AudioManager.stopAll();

        let reasonText = "Has muerto.";

        if (reason === "frío") reasonText = "Moriste de frío.";
        else if (reason === "hambre") reasonText = "Moriste de hambre.";
        else if (reason === "sed") reasonText = "Moriste de sed.";
        else if (reason === "depredación") reasonText = "Fuiste cazado.";

        setTimeout(() => {
            resetPlayerStateForMenu();
            showMenu();
            showNotice(
                `${reasonText} Sobreviviste ${survivedDays} día(s).`
            );
            AudioManager.startMenuMusic();
        }, 900);
    }

    function resetPlayerStateForMenu() {
        Game.running = false;
        Game.gameOver = false;
        Game.player = null;
        Game.animals = [];
        Game.trees = [];
        Game.waters = [];
        Game.grasses = [];
        Game.footprints = [];
        Game.smokes = [];
    }

    function update(dt) {
        if (!Game.running || Game.gameOver) return;

        updateWorldTime(dt);

        for (const animal of Game.animals) animal.update(dt);

        updateFootprints(dt);
        updateSmoke(dt);
        updateGrass(dt);
        cleanupAnimals();
        updateCamera();
        updateHUD();
        updateObjective();
    }

    function gameLoop(timestamp) {
        if (!Number.isFinite(timestamp)) timestamp = performance.now();
        if (!Game.lastTime) Game.lastTime = timestamp;

        let dt = (timestamp - Game.lastTime) / 1000;
        Game.lastTime = timestamp;
        dt = Utils.clamp(dt, 0, CONFIG.performance.maxDelta);

        update(dt);
        drawWorld();
        requestAnimationFrame(gameLoop);
    }

    function resizeCanvas() {
        canvas.width = CONFIG.canvas.width;
        canvas.height = CONFIG.canvas.height;
        ctx.imageSmoothingEnabled = false;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function init() {
        showMenu();
        AudioManager.startMenuMusic();
        requestAnimationFrame(gameLoop);
    }

    init();

    window.Snowwild = {
        config: {
            animals: ANIMALS,
            general: CONFIG,
            paths: PATHS
        },

        game: Game,

        restart() {
            AudioManager.unlock();
            AudioManager.stopAll();
            resetWorld();
            showGame();
            AudioManager.startGameMusic();
        },

        menu() {
            AudioManager.stopAll();
            resetPlayerStateForMenu();
            showMenu();
            AudioManager.startMenuMusic();
        }
    };
})();