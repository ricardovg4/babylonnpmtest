import * as Ammo from 'ammo.js';

export let ammoModule;
export const ammoReadyPromise = new Promise((resolve) => {
    new Ammo()
        .then((result) => {
            ammoModule = result;
            resolve(result);
        })
        .catch((err) => {
            console.log("ammo couldn't be loaded as a promise");
        });
});
