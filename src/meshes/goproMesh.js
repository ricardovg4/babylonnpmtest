import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

export let goproExport = { mesh: null };

export function goproMesh(scene, lookAtMesh) {
    BABYLON.SceneLoader.ImportMesh('', '../../3d/gopro/', 'scene.gltf', scene, (newMeshes, particleSystems, skeletons) => {
        let gopro = newMeshes[0];
        gopro.scaling.scaleInPlace(0.05);
        gopro.position.set(20, 10, -20);
        goproExport.mesh = gopro;

        scene.registerBeforeRender(() => {
            // second argument to fix rotation
            // gopro.lookAt(lookAtMesh.pos, Math.PI / 16, Math.PI, 0);
        });
    });
}
