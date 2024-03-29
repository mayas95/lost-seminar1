import Node from './Node.js';

export default class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [2, 5, 3],
            ambient          : 3,
            diffuse          : 0.8,
            specular         : 1,
            shininess        : 10,
            color            : [255, 255, 255],
            attenuatuion     : [1.0, 0, 0.02]
        });
    }

}
