import {
  AmbientLight, DirectionalLight, Fog, Mesh, MeshBasicMaterial,
  PerspectiveCamera, RingGeometry, Scene, Vector3, WebGLRenderer,
} from 'three';
import { FollowCamera } from './FollowCamera';
import { InputManager } from './InputManager';
import { Mob } from '../entities/Mob';
import { Player } from '../entities/Player';
import type { NetworkAdapter, PlayerStatePacket } from '../network/NetworkAdapter';
import { performMeleeAttack } from '../systems/CombatSystem';
import { HudOverlay } from '../ui/HudOverlay';
import { WORLD_SIZE, WorldMap } from '../world/WorldMap';

const meleeRange = 2.5;
const attackDuration = 0.22;
const spawnPoints = [[0, -5], [-5, -8], [4, -10]] as const;

interface RemotePlayer {
  player: Player;
  target: Vector3;
  targetRotation: number;
}

export class Engine {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(55, 1, 0.1, 150);
  private readonly followCamera = new FollowCamera(this.camera);
  private readonly player = new Player();
  private readonly map = new WorldMap();
  private readonly remotePlayers = new Map<string, RemotePlayer>();
  private readonly attackRing = new Mesh(
    new RingGeometry(meleeRange - 0.09, meleeRange, 48),
    new MeshBasicMaterial({ color: 0xffcd83, transparent: true, depthWrite: false }),
  );
  private readonly input: InputManager;
  private readonly hud: HudOverlay;
  private mobs: Mob[] = [];
  private animationFrame: number | undefined;
  private previousTime: number | undefined;
  private attackTime = 0;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, private readonly network: NetworkAdapter) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(0x1a1a2e);
    this.scene.fog = new Fog(0x1a1a2e, 30, 85);
    const sun = new DirectionalLight(0xffe2bb, 2);
    sun.position.set(-12, 18, 7);
    this.scene.add(new AmbientLight(0xa8c3ff, 1.25), sun, this.map, this.player, this.attackRing);
    this.attackRing.rotation.x = -Math.PI / 2;
    this.attackRing.position.y = 0.025;
    this.attackRing.visible = false;

    this.input = new InputManager();
    this.hud = new HudOverlay(this.resetRound);
    this.resetRound();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  start(): void {
    if (this.disposed || this.animationFrame !== undefined) return;
    this.network.start(this.onPlayerState);
    this.animationFrame = requestAnimationFrame(this.frame);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.animationFrame !== undefined) cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    this.input.dispose();
    this.hud.dispose();
    this.network.stop();
    this.player.dispose();
    this.map.dispose();
    for (const mob of this.mobs) mob.dispose();
    for (const remote of this.remotePlayers.values()) remote.player.dispose();
    this.remotePlayers.clear();
    this.attackRing.geometry.dispose();
    this.attackRing.material.dispose();
    this.renderer.dispose();
  }

  private readonly resize = (): void => {
    const { clientWidth, clientHeight } = this.renderer.domElement;
    this.camera.aspect = clientWidth / Math.max(1, clientHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(clientWidth, clientHeight, false);
  };

  private readonly resetRound = (): void => {
    for (const mob of this.mobs) mob.dispose();
    this.mobs = spawnPoints.map(([x, z], index) => new Mob(`mob-${index + 1}`, x, z));
    this.scene.add(...this.mobs);
    this.input.clear();
    this.player.hp = this.player.maxHp;
    this.player.position.set(0, 0, 0);
    this.player.rotation.y = 0;
    this.followCamera.snap(this.player.position);
    this.attackTime = 0;
    this.attackRing.visible = false;
    this.hud.setRemaining(this.mobs.length, spawnPoints.length);
    this.hud.update(this.player.hp, this.player.maxHp, this.player.position);
  };

  private readonly onPlayerState = (packet: PlayerStatePacket): void => {
    let remote = this.remotePlayers.get(packet.id);
    if (!remote) {
      const player = new Player(0x58e3a3);
      player.position.set(packet.x, packet.y, packet.z);
      player.rotation.y = packet.rotY;
      this.scene.add(player);
      remote = { player, target: new Vector3(), targetRotation: packet.rotY };
      this.remotePlayers.set(packet.id, remote);
    }

    remote.target.set(packet.x, packet.y, packet.z);
    remote.targetRotation = packet.rotY;
    remote.player.hp = packet.hp;
  };

  private readonly frame = (time: number): void => {
    const delta = Math.min((time - (this.previousTime ?? time)) / 1_000, 0.1);
    this.previousTime = time;
    this.player.move(delta, this.input, WORLD_SIZE / 2);
    this.followCamera.update(delta, this.player.position);

    this.attackTime = Math.max(0, this.attackTime - delta);
    if (this.input.consumeAttack()) this.attack();
    this.attackRing.visible = this.attackTime > 0;
    this.attackRing.material.opacity = 0.8 * this.attackTime / attackDuration;
    for (const mob of this.mobs) mob.faceCamera(this.camera.quaternion);

    const blend = 1 - Math.exp(-14 * delta);
    for (const { player, target, targetRotation } of this.remotePlayers.values()) {
      player.position.lerp(target, blend);
      const angle = targetRotation - player.rotation.y;
      player.rotation.y += Math.atan2(Math.sin(angle), Math.cos(angle)) * blend;
    }

    this.hud.update(this.player.hp, this.player.maxHp, this.player.position);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.frame);
  };

  private attack(): void {
    this.attackTime = attackDuration;
    this.attackRing.position.x = this.player.position.x;
    this.attackRing.position.z = this.player.position.z;
    performMeleeAttack(this.player, this.mobs, meleeRange);
    const previousCount = this.mobs.length;
    this.mobs = this.mobs.filter((mob) => {
      if (!mob.isDead) return true;
      mob.dispose();
      return false;
    });
    if (previousCount !== this.mobs.length) this.hud.setRemaining(this.mobs.length, spawnPoints.length);
  }
}
