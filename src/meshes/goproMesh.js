import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

// import digital assets
import goproGltf from '../../3d/gopro/scene2.gltf';

export let goproExport = { mesh: null };

export async function goproMesh(scene, lookAtMesh) {
    const goproImport = await BABYLON.SceneLoader.ImportMeshAsync('', '', goproGltf, scene, undefined);
    let gopro = goproImport.meshes[0];
    gopro.scaling.scaleInPlace(0.05);
    gopro.position.set(20, 10, -20);
    goproExport.mesh = gopro;

    // BABYLON.SceneLoader.ImportMesh('', '../../3d/gopro/', 'scene.gltf', scene, (newMeshes, particleSystems, skeletons) => {
    //     let gopro = newMeshes[0];
    //     gopro.scaling.scaleInPlace(0.05);
    //     gopro.position.set(20, 10, -20);
    //     goproExport.mesh = gopro;
    // });
}
