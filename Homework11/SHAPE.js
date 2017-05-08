const SHAPE = (function () {
    const my = {};

    function addMeshVertices(V, m, n, func) {
        function append(A) {
            for (let i = 0; i < A.length; i++) {
                V.push(A[i]);
            }
        }

        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) {
                const A = func(i / m, j / n);
                const B = func((i + 1) / m, j / n);
                const C = func(i / m, (j + 1) / n);
                const D = func((i + 1) / m, (j + 1) / n);
                append(A);
                append(B);
                append(D); // Lower right of square.
                append(D);
                append(C);
                append(A); // Upper left of square.
            }
        }
        return V;
    }

    function addDiskVertices(V, n, zSign, z) {
        function f(i) {
            const theta = zSign * 2 * Math.PI * i / n;
            V.push(Math.cos(theta), Math.sin(theta), z, 0, 0, zSign, 0, 0);
        }

        for (let i = 0; i < n; i++) {
            f(i);
            f(i + 1);
            V.push(0, 0, z, 0, 0, zSign, 0, 0);
        }
        return V;
    }

    function addTubeVertices(V, n) {
        return addMeshVertices(V, n, 1, function (u, v) {
            const theta = 2 * Math.PI * u;
            const z = 2 * v - 1;
            let c = Math.cos(theta);
            let s = Math.sin(theta);
            return [c, s, z, c, s, 0, u, v];
        });
    }

    my.cylinder = function (n) {
        const V = [];
        addDiskVertices(V, n, -1, -1);
        addTubeVertices(V, n);
        addDiskVertices(V, n, 1, 1);
        return V;
    };

    return my;
})();

