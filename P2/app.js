/*
Shaders
Pequenos programas executados na GPU
Nesta execucao vamos usar para determinar como os pixels e vértices de um objeto 3D são processados e exibidos 
*/

/*
vertexShaderText

Processa cada vértice dos objetos.
Recebe as informações dos vértices e aplica transformações como translação, rotação e escala, e passar os dados processados para o fragment shader.
*/
var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'varying vec2 fragTexCoord;',
'varying vec3 fragNormal;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'uniform vec3 lightDirection;',
'',
'void main()',
'{',
'  fragTexCoord = vertTexCoord;',
'  fragNormal = normalize((mWorld * vec4(0.0, 0.0, 1.0, 0.0)).xyz);',
'  vec4 worldPosition = mWorld * vec4(vertPosition, 1.0);',
'  gl_Position = mProj * mView * worldPosition;',
'}'
].join('\n');


/*
fragmentShaderText
Processa cada pixel do objeto, determina a cor e outros atributos do pixel.
Recebe as informações interpoladas do vertex shader e calcula a cor final do pixel com base em luz, textura e outros efeitos.
*/
var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'',
'varying vec3 fragNormal;',
'uniform vec3 lightDirection;',
'void main()',
'{',
'  float diff = max(dot(fragNormal, -lightDirection), 0.0);',

'  vec3 lightColor = vec3(1.0, 1.0, 1.0);',     //Define a cor da luz

'  vec3 ambientColor = vec3(0.5, 0.5, 0.5);',   //Define a cor do ambiente
                                                //(1.0, 1.0, 1.0) intensidade máxima de vermelho, verde e azul - Logo temos uma cor branca
                                                //(0.1, 0.1, 0.1) intensidade minima de vermelho, verde e azul - Logo temos uma cor cinza escura

' highp vec4 texelColor = texture2D(sampler, fragTexCoord);',
'  gl_FragColor = vec4(texelColor.rgb *  (ambientColor + lightColor * diff), texelColor.a);',
'}'
].join('\n');

//Funcao principal do programa que inicia o WebGL
var InitProject = function () {
    console.log('This is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    //Verificacoes padroes para ver se o navegador suporta WebGL
    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Your browser does not support WebGL');
    }


    gl.clearColor(0.0, 0.0, 0.0, 1.0); //Define o RGB do fundo do projeto
    /*
        (0.0, 0.0, 0.0, 0.0) - Cor Preto - Intensidade 0%
        (0.0, 0.0, 0.0, 1.0) - Cor Preto - Intensidade 100%
        (1.0, 0.0, 0.0, 0.5) - Cor Vermelho - Intensidade 50%
    */

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    // Create shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    //Verificacoes padroes para ver se compilou corretamente as shaders
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    // Create buffer
    var boxVertices = [
        // X, Y, Z           U, V
        // Top
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,

        // Left
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,

        // Right
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   0, 1,
        1.0, -1.0, -1.0,  0, 0,
        1.0, 1.0, -1.0,   1, 0,

        // Front
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, 1.0,  0, 0,
        -1.0, 1.0, 1.0,   0, 1,

        // Back
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,   0, 1,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   1, 0,

        // Bottom
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
    ];

    var boxIndices = [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    //
    // Create Texture
    //

    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('slime') )
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Tell OpenGL state machine which program should be active.
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    var lightDirectionUniformLocation = gl.getUniformLocation(program, 'lightDirection');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    var lightDirection = new Float32Array([0.0, 0.0, 0.0]); // Direção da luz

    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(60), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    gl.uniform3fv(lightDirectionUniformLocation, lightDirection);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);

    var amplitudeY = 2.0; // Amplitude do movimento no eixo Y
    var amplitudeX = 2.5; // Amplitude do movimento no eixo X
    var speedX = 2;
    var speedY = 4;

    var loop = function () {
        var time = performance.now() / 1000;
        var angleX = time * 2 * Math.PI / 4; // Ângulo de rotação
        var angleY = time * 2 * Math.PI / 2; // Ângulo de rotação

        // Cálculo do deslocamento no eixo Y usando uma função seno para o primeiro cubo
        var yOffset = Math.sin(time * speedY) * amplitudeY;

        // Cálculo do deslocamento no eixo X usando uma função seno para o segundo cubo
        var xOffset = Math.sin(time * speedX) * amplitudeX;

        // Primeiro cubo (levemente à esquerda)
        var translationMatrix1 = new Float32Array(16);
        mat4.identity(translationMatrix1);
        mat4.translate(translationMatrix1, identityMatrix, [-3, yOffset, 0]); // Mover 3 unidades à esquerda e usar yOffset
        var firstCubeMatrix = new Float32Array(16);
        mat4.rotate(yRotationMatrix, identityMatrix, angleY, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angleX / 4, [1, 0, 0]);
        mat4.mul(firstCubeMatrix, translationMatrix1, yRotationMatrix);
        mat4.mul(firstCubeMatrix, firstCubeMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, firstCubeMatrix);
    
        // Desenhar o primeiro cubo
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.activeTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    
        // Segundo cubo (levemente à direita)
        var translationMatrix2 = new Float32Array(16);
        mat4.identity(translationMatrix2);
        mat4.translate(translationMatrix2, identityMatrix, [3 + xOffset, 0, 0]); // Mover 3 unidades à direita e usar xOffset
        var secondCubeMatrix = new Float32Array(16);
        mat4.mul(secondCubeMatrix, translationMatrix2, yRotationMatrix);
        mat4.mul(secondCubeMatrix, secondCubeMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, secondCubeMatrix);
    
        // Desenhar o segundo cubo
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
};
