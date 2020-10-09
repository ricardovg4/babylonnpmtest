// module imports
// import lowPolyCar from '../../3d/low-poly_truck_car_drifter/samsung-controller.glb';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';

// import ammoPromisified
import { ammoReadyPromise, ammoModule } from '../externals/ammoPromisified';

// import meshes
import { ground, planeExport } from '../meshes/ground';
import { carMesh, carMeshAbsolutePosition, carExport } from '../meshes/carMesh';
import { saloonMesh } from '../meshes/saloonMesh';
import { goproMesh, goproExport } from '../meshes/goproMesh';

let scene;

let boxes = [];
function createBoxes(num, columns) {
    let origin = 45;
    let x = -origin;
    let y = 0;
    let z = origin;
    let spaceBetween = 5;
    let rows = Math.floor(num / columns) + 1;
    let newRow = [];
    for (let i = 0; i < rows; i++) {
        newRow.push(i * columns);
    }

    for (let i = 0; i < num; i++) {
        if (i === 0) {
            boxes[i] = BABYLON.MeshBuilder.CreateBox('b', { width: 1, depth: 2, height: 10 }, scene);
            boxes[i].position = new BABYLON.Vector3(x, y, z);
        } else {
            if (newRow.includes(i)) {
                x = -origin;
                z -= spaceBetween;
                boxes[i] = BABYLON.MeshBuilder.CreateBox(`b${i}`, { width: 1, depth: 2, height: 10 }, scene);
                boxes[i].position = new BABYLON.Vector3(x, y, z);
                // console.log('nr', [i, x, z]);
            } else {
                boxes[i] = BABYLON.MeshBuilder.CreateBox(`b${i}`, { width: 1, depth: 2, height: 10 }, scene);
                x += spaceBetween;
                boxes[i].position = new BABYLON.Vector3(x, y, z);
                // console.log([i, x, z]);
            }
        }
        boxes[i].physicsImpostor = new BABYLON.PhysicsImpostor(boxes[i], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.2, restitution: 0, friction: 2 }, scene);
    }
}

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
    saloonMesh(scene);
    goproMesh(scene, carMeshAbsolutePosition);

    // test materials
    // purple
    let myMaterial = new BABYLON.StandardMaterial('myMaterial', scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    //
    let myMaterial2 = new BABYLON.StandardMaterial('myMaterial', scene);
    myMaterial2.diffuseColor = new BABYLON.Color3(1, 5, 1);

    // meshes
    let sphere = BABYLON.Mesh.CreateSphere('sphere', 8, 8, scene);
    sphere.position.set(20, 8, -10);
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

    let box4 = BABYLON.MeshBuilder.CreateBox('box4', { width: 2, depth: 4, height: 2 }, scene);
    box4.position.set(5, 0, 5);

    createBoxes(50, 6);

    function ensureMeshIsSet(meshExport) {
        return new Promise(function (resolve, reject) {
            function waitForMesh() {
                if (meshExport.mesh) return resolve();
                setTimeout(waitForMesh, 30);
            }
            waitForMesh();
        });
    }

    ensureMeshIsSet(carExport).then(() => {
        planeExport.cameraPlane.mesh2.actionManager = new BABYLON.ActionManager(scene);
        planeExport.cameraPlane.mesh2.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: carExport.mesh
                },
                function () {
                    let sphere2 = BABYLON.Mesh.CreateSphere('sphere2', 8, 18, scene);
                    sphere2.position.set(-35, 40, 35);
                    sphere2.physicsImpostor = new BABYLON.PhysicsImpostor(sphere2, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10002, restitution: 2.9 }, scene);
                    sphere2.material = myMaterial;
                    goproExport.mesh.scalingDeterminant = 5;
                    planeExport.cameraPlane.mesh.material = myMaterial;
                }
            )
        );
        planeExport.cameraPlane.mesh2.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: carExport.mesh
                },
                function () {
                    console.log('exit');
                    goproExport.mesh.scalingDeterminant = 1;
                    planeExport.cameraPlane.mesh.material = myMaterial2;
                }
            )
        );
        planeExport.restartPlane.mesh2.actionManager = new BABYLON.ActionManager(scene);
        planeExport.restartPlane.mesh2.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: carExport.mesh
                },
                function () {
                    planeExport.restartPlane.mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 0.2);
                    for (let i = 0; i < boxes.length; i++) {
                        boxes[i].dispose();
                    }
                    boxes = [];
                }
            )
        );
        planeExport.restartPlane.mesh2.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: carExport.mesh
                },
                function () {
                    planeExport.restartPlane.mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                    createBoxes(50, 6);
                }
            )
        );
    });

    // ensureMeshIsSet(planeExport.restartPlane.mesh).then(() => {
    //     planeExport.restartPlane.mesh2.actionManager = new BABYLON.ActionManager(scene);
    //     planeExport.restartPlane.mesh2.actionManager.registerAction(
    //         new BABYLON.ExecuteCodeAction(
    //             {
    //                 trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
    //                 parameter: carExport.mesh
    //             },
    //             function () {
    //                 planeExport.restartPlane.mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 0.2);
    //                 console.log('plane restart');
    //             }
    //         )
    //     );
    //     // planeExport.restartPlane.mesh2.actionManager = new BABYLON.ActionManager(scene);
    //     // planeExport.restartPlane.mesh2.actionManager.registerAction(
    //     //     new BABYLON.ExecuteCodeAction(
    //     //         {
    //     //             trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
    //     //             parameter: carExport.mesh
    //     //         },
    //     //         function () {
    //     //             planeExport.restartPlane.mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 0.2);
    //     //             console.log('plane restart');
    //     //         }
    //     //     )
    //     // );
    // });

    scene.registerBeforeRender(() => {
        // console.log(planeExport.restartPlane['mesh']);
        if (carExport.mesh) {
            // car intersects plane
            if (carExport.mesh.intersectsMesh(planeExport.cameraPlane.mesh2, true)) {
                goproExport.mesh.lookAt(carExport.mesh.getAbsolutePosition(), Math.PI / 16, Math.PI, 0);
            }
            // car intersect boxes
            for (let i = 0; i < boxes.length; i++) {
                if (carExport.mesh.intersectsMesh(boxes[i], true)) {
                    boxes[i].material = myMaterial;
                }
            }
        }
    });

    return scene;
}
