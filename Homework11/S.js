const S = (function () {
    const my = {};

    function quad(f, u0, v0, u1, v1) { // Local to this class.
        const q = [];
        q.push(f(u0, v0));
        q.push(f(u1, v0));
        q.push(f(u1, v1));
        q.push(f(u0, v1));
        q.push(f(u0, v0));
        return q;
    }

    /* 0 stays constant, phi switches sign each time, 1 switches sign every 2.
     0: [0,  1,  phi],   4: [ 1,  phi, 0],   8: [ phi, 0,  1],
     1: [0,  1, -phi],   5: [ 1, -phi, 0],   9: [-phi, 0,  1],
     2: [0, -1,  phi],   6: [-1,  phi, 0],   10:[ phi, 0, -1],
     3: [0, -1, -phi],   7: [-1, -phi, 0],   11:[-phi, 0, -1]*/
    function icos(i, j) {
        const phi = (1 + Math.sqrt(5)) / 2;
        let phi1 = (j % 2 === 0) ? phi : -phi;
        let one = (j < 2) ? 1 : -1;

        switch (i) {
            case 0:
                return [0, one, phi1];
            case 1:
                return [one, phi1, 0];
            case 2:
                return [phi1, 0, one];
        }
    }

    my.parametricMesh = function (f, nu, nv) {
        let i, j, u, v;
        const C = [];
        for (j = 0; j < nv; j++) {
            v = j / nv;
            for (i = 0; i < nu; i++) {
                u = i / nu;
                C.push(quad(f, u, v, u + 1 / nu, v + 1 / nv));
            }
        }
        return C;
    };

    my.sphere = function (u, v) {
        const theta = 2 * Math.PI * u;
        const phi = Math.PI * (v - .5);
        return [Math.cos(theta) * Math.cos(phi),
            Math.sin(theta) * Math.cos(phi),
            Math.sin(phi)];
    };

    my.torus = function (u, v) {
        const theta = 2 * Math.PI * u;
        const phi = 2 * Math.PI * v;
        const r = 0.3;
        return [
            Math.cos(theta) * (1 + r * Math.cos(phi)),
            Math.sin(theta) * (1 + r * Math.cos(phi)),
            r * Math.sin(phi)
        ];
    };

    my.tube = function (u, v) {
        const theta = 2 * Math.PI * u;
        return [Math.cos(theta),
            Math.sin(theta),
            2 * v - 1];
    };

    my.unitIcosahedron = function () {
        const v = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                v.push(icos(i, j));
            }
        }

        return [
            /* Face 0 */[v[0], v[2], v[8]],
            /* Face 1 */[v[0], v[8], v[4]],
            /* Face 2 */[v[0], v[4], v[6]],
            /* Face 3 */[v[0], v[6], v[9]],
            /* Face 4 */[v[0], v[9], v[2]],

            /* Face 5 */[v[2], v[7], v[5]],
            /* Face 6 */[v[2], v[5], v[8]],
            /* Face 7 */[v[2], v[9], v[7]],

            /* Face 8 */[v[8], v[5], v[10]],
            /* Face 9 */[v[8], v[10], v[4]],

            /* Face 10 */[v[10], v[5], v[3]],
            /* Face 11 */[v[10], v[3], v[1]],
            /* Face 12 */[v[10], v[1], v[4]],

            /* Face 13 */[v[1], v[6], v[4]],
            /* Face 14 */[v[1], v[3], v[11]],
            /* Face 15 */[v[1], v[11], v[6]],

            /* Face 16 */[v[6], v[11], v[9]],

            /* Face 17 */[v[11], v[3], v[7]],
            /* Face 18 */[v[11], v[7], v[9]],

            /* Face 19 */[v[3], v[5], v[7]]
        ];
    };

    return my;
})();

