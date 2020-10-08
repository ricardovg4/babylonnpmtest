// module imports
// import lowPolyCar from '../../3d/low-poly_truck_car_drifter/samsung-controller.glb';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';

// import ammoPromisified
import { ammoReadyPromise, ammoModule } from '../externals/ammoPromisified';

// import meshes
import { ground, planeExport } from '../meshes/ground';
import { carMesh, carMeshAbsolutePosition, carExport } from '../meshes/carMesh';
// import { saloonMesh } from '../meshes/saloonMesh';
import { goproMesh, goproExport } from '../meshes/goproMesh';

// main function
export default async function createScene(engine, canvas) {
    let preTasks = [ammoReadyPromise];
    await Promise.all(preTasks || []);

    // create the scene with the engine argument
    const scene = new BABYLON.Scene(engine);

    // create camera
    const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 0, new BABYLON.Vector3(60, 90, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    // camera.setTarget(new BABYLON.Vector3(Math.PI, 50, Math.PI / 2));
    camera.attachControl(canvas, true);

    // Hemispheric light
    const light = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 10, 0), scene);
    light.intensity = 0.7;
    const light2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(2, 10, 0), scene);
    light2.intensity = 0.5;

    // enable physics
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin(true, ammoModule));

    // Ground import
    ground(scene);
    carMesh(scene);
    // saloonMesh(scene);
    goproMesh(scene, carMeshAbsolutePosition);

    // test materials
    // purple
    let myMaterial = new BABYLON.StandardMaterial('myMaterial', scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    //
    let myMaterial2 = new BABYLON.StandardMaterial('myMaterial', scene);
    myMaterial2.diffuseColor = new BABYLON.Color3(1, 5, 1);

    // meshes
    let sphere = BABYLON.Mesh.CreateSphere('sphere', 8, 2, scene);
    sphere.position.set(20, 1, -10);
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
    sphere.material = myMaterial;
    // sphere.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(1, 0, 1, 0));
    // sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 0), sphere.getAbsolutePosition());

    let box = BABYLON.MeshBuilder.CreateBox('box', { width: 1, depth: 2, height: 10 }, scene);
    box.position.set(10, 0, 10);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.2, restitution: 0, friction: 0 }, scene);
    box.material = myMaterial2;

    let box2 = BABYLON.MeshBuilder.CreateBox('box2', { width: 1, depth: 2, height: 10 }, scene);
    box2.position.set(10, 0, 14);
    box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 20, restitution: 0, friction: 0.5 }, scene);
    box2.material = myMaterial2;
    box2.lookAt(new BABYLON.Vector3(20, 0, -10));

    async function meshAwait(meshToAwait) {
        let meshPromise = new Promise((resolve, reject) => {
            //     if (meshToAwait.mesh !== null) {
            //         resolve(meshToAwait.mesh);
            //     } else {
            //         reject("didn't get it");
            // }
            // while (meshToAwait.mesh === null) {
            //     setTimeout(() => {}, 100);
            // }
            resolve(meshToAwait.mesh);
        });
        try {
            let meshResult = await meshPromise;
            console.log(meshResult);
            return meshResult;
        } catch (error) {
            console.log('no');
        }
    }
    // const importResult = await BABYLON.SceneLoader.ImportMeshAsync('', '', lowPolyCar, scene, undefined, '.glb');
    // importResult.meshes[0].scaling.scaleInPlace(50);

    function ensureMeshIsSet(meshExport) {
        return new Promise(function (resolve, reject) {
            function waitForMesh() {
                if (meshExport.mesh) return resolve();
                setTimeout(waitForMesh, 30);
            }
            waitForMesh();
        });
    }

    let box4 = BABYLON.MeshBuilder.CreateBox('box4', { width: 2, depth: 4, height: 2 }, scene);
    box4.position.set(5, 0, 5);
    // meshAwait(carExport);
    // let plane = new BABYLON.MeshBuilder.CreatePlane('plane', { size: 40 }, scene);
    // plane.position.set(25, 1, -25);
    // plane.rotation.x = Math.PI / 2;

    scene.registerBeforeRender(() => {
        // ensureMeshIsSet(carExport)
        // .then(() => console.log('success on mesh import'))
        // .then(() => {
        // ensureMeshIsSet(planeExport);
        // .then(() => console.log('success on mesh import'));
        // })
        // .then(() => {
        // if (carExport.mesh) {
        //     if (carExport.mesh.intersectsMesh(planeExport.mesh, true)) {
        //         console.log('collision intersection!');
        //     }
        // }
        // console.log(planeExport.mesh);
        // });
        if (carExport.mesh) {
            if (carExport.mesh.intersectsMesh(planeExport.mesh, true)) {
                console.log('collision intersection!');
                goproExport.mesh.lookAt(carExport.mesh.getAbsolutePosition(), Math.PI / 16, Math.PI, 0);
                planeExport.mesh.material = myMaterial;
            } else {
                planeExport.mesh.material = myMaterial2;
            }
        }
        // carPromise.then((res) => console.log('success', carExport)).catch((rej) => console.log('nope'));
        //     if (carExport.mesh.intersectsMesh(planeExport.mesh, false)) {
        //         console.log('it works!');
        //     }
        // console.log(!!carExport.mesh);
    });
    // console.log(carExport.mesh);

    return scene;
}
