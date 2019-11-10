import UnitsO from '@config/constants/unito.json';
import { UnitData } from '@type/unit';
import { Component } from 'react';
const { spine } = require('@components/spine');

interface BattleAnimeState {
  isError: boolean,
}

interface BattleAnimeProps {
  cid: number,
  width?: number,
  show1x?: boolean,
}

interface UnitObject {
  [key: number]: UnitData
}
const Units: UnitObject = UnitsO;

const defaultWidth = 200;

class BattleAnime extends Component<BattleAnimeProps, BattleAnimeState> {
  public animeid: number | null;
  public canvas: HTMLCanvasElement | null;
  public lastFrameTime: number;
  public shader: any;
  public batcher: any;
  public gl: any;
  public mvp: any;
  public skeletonRenderer: any;
  public shapes: any;
  public skeleton: { [key: string]: any };
  public animationQueue: any[];
  public speedFactor: number;
  public bgColor: number[];
  public loading: boolean;
  public loadingSkeleton: any;
  public generalBattleSkeletonData: any;
  public currentTexture: any;
  public currentClassAnimData: { type: string; data: ArrayBuffer; };
  public currentCharaAnimData: { id: string; data: ArrayBuffer; };
  public currentClass: string;
  public activeSkeleton: string;
  constructor(props: any) {
    super(props);
    this.state = {
      isError: false,
    };
    // requestAnimationFrame id
    this.animeid = null;
    // canvas reference
    this.canvas = null;
    // spine
    this.lastFrameTime = Date.now() / 1000;
    this.mvp = new spine.webgl.Matrix4();
    this.skeleton = {};
    this.animationQueue = [];
    this.speedFactor = 1;
    this.bgColor = [.9, .9, .9, 1];
    this.loading = false;
    this.currentClassAnimData = {
      type: '0',
      data: new ArrayBuffer(0),
    };
    this.currentCharaAnimData = {
      id: '0',
      data: new ArrayBuffer(0),
    };
    this.currentClass = '1';
    this.activeSkeleton = "";
  }

  public async componentDidMount() {
    const { cid } = this.props;
    let mapValue = Units[cid];
    if (!mapValue) {
      mapValue = Units[100101];
    }

    try {
      await this.init(cid, Units[cid].type.toString());
    } catch(e) {
      console.log(e);
      this.setError();
    }
  }

  public componentWillUnmount() {
    if (this.animeid) {
      cancelAnimationFrame(this.animeid);
    }
  }


  public render() {
    const { width = defaultWidth } = this.props; 
    return (
      <div style={{ width: `${width}px`, height: `${width}px` }}>
        <canvas ref={e => this.canvas = e} width={`${width}`} />
      </div>
    );
  }

  private getClass = (i: string) => {
    return i.padStart(2, '0');
  }

  private loadData(url: string, loadType?: XMLHttpRequestResponseType) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      if (loadType) xhr.responseType = loadType;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

  private setError = () => {
    this.setState({
      isError: true,
    });
  }


  private init = async (unitId: number, classId: string) => {
    const config = {
      alpha: true
    };

    if (!this.canvas) {
      this.setError();
      return;
    }
    this.gl = this.canvas.getContext("webgl", config) || this.canvas.getContext("experimental-webgl", config);
    if (!this.gl) {
      this.setError();
      return;
    }
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
    this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl);
    this.batcher = new spine.webgl.PolygonBatcher(this.gl);
    this.mvp.ortho2d(0, 0, this.canvas.width - 1, this.canvas.height - 1);
    this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl);
    this.shapes = new spine.webgl.ShapeRenderer(this.gl);

    // find 3x or 1x
    const unitFileId = this.props.show1x ? unitId + 30 : unitId + 10;

    await this.load(unitId, unitFileId, classId);
  }

  private load = async(unitId: number, unitFileId: number, classId: string) => {
    if (this.loading) return;
    this.loading = true;
    this.currentClass = classId;
    // let baseUnitId = unitId;
    // baseUnitId -= baseUnitId % 100 - 1;
    this.loadingSkeleton = {
      id: unitFileId,
      info: Units[unitId],
      baseId: unitId,
    };

    if (!this.generalBattleSkeletonData) {
      console.log('加载共用骨架 (0/5)');
      this.generalBattleSkeletonData = await this.loadData('/static/spine/common/000000_CHARA_BASE.cysp', 'arraybuffer');
      await this.loadClassAnimation();
    }
    else await this.loadClassAnimation();
  }

  private loadClassAnimation = async() => {
    if (this.currentClassAnimData.type.toString() === this.currentClass) {
      await this.loadCharaSkillAnimation();
    }
    else {
      console.log('加载职介动画 (1/5)');
      const data = await this.loadData('/static/spine/common/' + this.getClass(this.currentClass) + '_COMMON_BATTLE.cysp', 'arraybuffer');
      this.currentClassAnimData = {
        type: this.currentClass,
        data: data as ArrayBuffer,
      };
      await this.loadCharaSkillAnimation();
    }
  }

  private loadCharaSkillAnimation = async() => {
    const baseUnitId = this.loadingSkeleton.baseId;
    // baseUnitId -= baseUnitId % 100 - 1;
    if (this.currentCharaAnimData.id === baseUnitId) {
      await this.loadTexture();
    }
    else {
      console.log('加载角色技能动画 (2/5)');
      const data = await this.loadData('/static/spine/unit/' + baseUnitId + '_BATTLE.cysp', 'arraybuffer');
      this.currentCharaAnimData = {
        id: baseUnitId,
        data: data as ArrayBuffer,
      };
      await this.loadTexture();
    }
  }

  private loadTexture = async() => {
    console.log('加载材质 (3/5)');
    const atlasText = await this.loadData('/static/spine/unit/' + this.loadingSkeleton.id + '.atlas');
    console.log('加载材质图片 (4/5)');
    const blob = await this.loadData('/static/spine/unit/' + this.loadingSkeleton.id + '.png', 'blob');
    const img = new Image();
    img.onload = () => {
      const created = !!this.skeleton.skeleton;
      if (created) {
        this.skeleton.state.clearTracks();
        this.skeleton.state.clearListeners();
        this.gl.deleteTexture(this.currentTexture.texture);
      }

      const imgTexture = new spine.webgl.GLTexture(this.gl, img);
      URL.revokeObjectURL(img.src);
      const atlas = new spine.TextureAtlas(atlasText, () => {
        return imgTexture;
      });
      this.currentTexture = imgTexture;
      const atlasLoader = new spine.AtlasAttachmentLoader(atlas);

      let animationCount = 0;
      const classAnimView = new DataView(this.currentClassAnimData.data);
      let classAnimCount = classAnimView.getInt32(12, true);
      animationCount += classAnimCount;
      const unitAnimView = new DataView(this.currentCharaAnimData.data);
      let unitAnimCount = unitAnimView.getInt32(12, true);
      animationCount += unitAnimCount;

      // assume always no more than 128 animations
      const newBuffSize = this.generalBattleSkeletonData.byteLength - 64 + 1 +
        this.currentClassAnimData.data.byteLength - (++classAnimCount) * 32 +
        this.currentCharaAnimData.data.byteLength - (++unitAnimCount) * 32;
      const newBuff = new Uint8Array(newBuffSize);
      let offset = 0;
      newBuff.set(new Uint8Array(this.generalBattleSkeletonData.slice(64)), 0);
      offset += this.generalBattleSkeletonData.byteLength - 64;
      newBuff[offset] = animationCount;
      offset++;
      newBuff.set(new Uint8Array(this.currentClassAnimData.data.slice(classAnimCount * 32)), offset);
      offset += this.currentClassAnimData.data.byteLength - classAnimCount * 32;
      newBuff.set(new Uint8Array(this.currentCharaAnimData.data.slice(unitAnimCount * 32)), offset);
      offset += this.currentCharaAnimData.data.byteLength - unitAnimCount * 32;

      const skeletonBinary = new spine.SkeletonBinary(atlasLoader);
      const skeletonData = skeletonBinary.readSkeletonData(newBuff.buffer);
      const skeleton = new spine.Skeleton(skeletonData);
      skeleton.setSkinByName('default');
      const bounds = this.calculateBounds(skeleton);

      const animationStateData = new spine.AnimationStateData(skeleton.data);
      const animationState = new spine.AnimationState(animationStateData);
      animationState.setAnimation(0, this.getClass(this.currentClass) + '_idle', true);
      animationState.addListener({
        /*start: function (track) {
          console.log("Animation on track " + track.trackIndex + " started");
        },
        interrupt: function (track) {
          console.log("Animation on track " + track.trackIndex + " interrupted");
        },
        end: function (track) {
          console.log("Animation on track " + track.trackIndex + " ended");
        },
        disposed: function (track) {
          console.log("Animation on track " + track.trackIndex + " disposed");
        },*/
        complete: function tick() {
          // console.log("Animation on track " + track.trackIndex + " completed");
          if (this.animationQueue && this.animationQueue.length) {
            let nextAnim = this.animationQueue.shift();
            if (nextAnim === 'stop') return;
            if (nextAnim === 'hold') return setTimeout(tick, 1e3);
            if (nextAnim.substr(0, 1) !== '1') nextAnim = this.getClass(this.currentClassAnimData.type) + '_' + nextAnim;
            console.log(nextAnim);
            animationState.setAnimation(0, nextAnim, !this.animationQueue.length);
          }
        },
        /*event: function (track, event) {
          console.log("Event on track " + track.trackIndex + ": " + JSON.stringify(event));
        }*/
      });

      this.skeleton = {
        skeleton,
        state: animationState,
        bounds,
        premultipliedAlpha: true
      };
      this.loading = false;
      // (window.updateUI || setupUI)();
      if (!created && this.canvas) {
        const { width = defaultWidth } = this.props;
        this.canvas.style.width = `${width}px`;
        this.canvas.width = 2800;
        this.canvas.height = 2800;
        requestAnimationFrame(this.renderAnime);
      }
      this.activeSkeleton = this.loadingSkeleton.id;
    };
    img.src = URL.createObjectURL(blob);
  }

  private calculateBounds = (skeleton: any) => {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    const offset = new spine.Vector2();
    const size = new spine.Vector2();
    skeleton.getBounds(offset, size, []);
    offset.y = 0;
    return {
      offset,
      size
    };
  }

  private renderAnime = () => {
    const now = Date.now() / 1000;
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    // speedFactor: 1.0 is normal speed
    // delta *= speedFactor;
    // Update the MVP matrix to adjust for canvas size changes
    this.resize();

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Apply the animation state based on the delta time.
    const { state, skeleton, premultipliedAlpha } = this.skeleton;
    state.update(delta);
    state.apply(skeleton);
    skeleton.updateWorldTransform();

    // Bind the shader and set the texture and model-view-projection matrix.
    this.shader.bind();
    this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    this.batcher.begin(this.shader);

    this.skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    this.skeletonRenderer.draw(this.batcher, skeleton);
    this.batcher.end();

    this.shader.unbind();
    this.animeid = requestAnimationFrame(this.renderAnime);
  }

  private resize = () => {
    const { bounds } = this.skeleton;
    if (!this.canvas) return;
    // magic
    const centerX = bounds.offset.x + bounds.size.x / 2;
    const centerY = bounds.offset.y + bounds.size.y / 2;
    const scaleX = bounds.size.x / this.canvas.width;
    // const scaleY = bounds.size.y / this.canvas.height;
    const scale = scaleX * 0.8;
    // if (scale < 1) scale = 1;
    const width = this.canvas.width * scale;
    const height = this.canvas.height * scale;

    this.mvp.ortho2d(centerX - width / 2 + 50, centerY - height + 100, width, height);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default BattleAnime;