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
'precision mediump float;', // Define a precisão das variáveis float
'',
'attribute vec3 vertPosition;', // Posição do vértice
'attribute vec2 vertTexCoord;', // Coordenadas de textura do vértice
'varying vec2 fragTexCoord;', // Coordenadas de textura passadas para o fragment shader
'varying vec3 fragNormal;', // Normal do vértice passada para o fragment shader
'uniform mat4 mWorld;', // Matriz de transformação do mundo
'uniform mat4 mView;', // Matriz de visualização
'uniform mat4 mProj;', // Matriz de projeção
'uniform vec3 lightDirection;', // Direção da luz
'',
'void main()', // Função principal do vertex shader
'{',
'  fragTexCoord = vertTexCoord;', // Passa as coordenadas de textura para o fragment shader
'  fragNormal = normalize((mWorld * vec4(0.0, 0.0, 1.0, 0.0)).xyz);', // Calcula a normal do vértice
'  vec4 worldPosition = mWorld * vec4(vertPosition, 1.0);', // Transforma a posição do vértice para o espaço do mundo
'  gl_Position = mProj * mView * worldPosition;', // Define a posição final do vértice na tela
'}'
].join('\n');


/*
fragmentShaderText
Processa cada pixel do objeto, determina a cor e outros atributos do pixel.
Recebe as informações interpoladas do vertex shader e calcula a cor final do pixel com base em luz, textura e outros efeitos.
*/
var fragmentShaderText =
[
'precision mediump float;', // Define a precisão das variáveis float
'',
'varying vec2 fragTexCoord;', // Coordenadas de textura recebidas do vertex shader
'uniform sampler2D sampler;', // Amostrador de textura
'',
'varying vec3 fragNormal;', // Normal recebida do vertex shader
'uniform vec3 lightDirection;', // Direção da luz
'void main()', // Função principal do fragment shader
'{',
'  float diff = max(dot(fragNormal, -lightDirection), 0.0);', // Calcula o fator de difusão da luz

'  vec3 lightColor = vec3(1.0, 1.0, 1.0);',     // Define a cor da luz
'  vec3 ambientColor = vec3(0.5, 0.5, 0.5);',   // Define a cor do ambiente
                                                // (1.0, 1.0, 1.0) intensidade máxima de vermelho, verde e azul - Logo temos uma cor branca
                                                // (0.5, 0.5, 0.5) intensidade média de vermelho, verde e azul - Logo temos uma cor cinza clara 

' highp vec4 texelColor = texture2D(sampler, fragTexCoord);', // Adiciona a textura
'  gl_FragColor = vec4(texelColor.rgb *  (ambientColor + lightColor * diff), texelColor.a);', // Define a cor final do fragmento
'}'
].join('\n');

//Funcao principal do programa que inicia o WebGL
var InitProject = function () {
    console.log('This is working');

    var canvas = document.getElementById('game-surface'); // Obtém o elemento canvas
    var gl = canvas.getContext('webgl'); // Cria um contexto WebGL

    //Verificações padrões para ver se o navegador suporta WebGL
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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Limpa o buffer de cor e profundidade
    gl.enable(gl.DEPTH_TEST); // Ativa o teste de profundidade
    gl.enable(gl.CULL_FACE); // Ativa o culling de faces
    gl.frontFace(gl.CCW); // Define a ordem das faces frontais
    gl.cullFace(gl.BACK); // Culling nas faces traseiras

    // Cria os shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    //verficações padrões  para ver se compilou corretamente as shaders
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

    // Cria e vincula o programa
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

    // Criação dos buffers de vértices e índices
    var boxVertices = [
        // X, Y, Z           U, V
        // Acima
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,

        // Esquerda
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,

        // Direita
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   0, 1,
        1.0, -1.0, -1.0,  0, 0,
        1.0, 1.0, -1.0,   1, 0,

        // Frente
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, 1.0,  0, 0,
        -1.0, 1.0, 1.0,   0, 1,

        // Atrás
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,   0, 1,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   1, 0,

        // Abaixo
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
    ];

    var boxIndices = [
        // Acima
        0, 1, 2,
        0, 2, 3,

        // Esquerda
        5, 4, 6,
        6, 4, 7,

        // Direita
        8, 9, 10,
        8, 10, 11,

        // Frente
        13, 12, 14,
        15, 14, 12,

        // Atrás
        16, 17, 18,
        16, 18, 19,

        // Abaixo
        21, 20, 22,
        22, 20, 23
    ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

     // Configura os atributos do vertex shader
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        positionAttribLocation, // Localização do atributo
        3, // Número de elementos por atributo
        gl.FLOAT, // Tipo dos elementos
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Tamanho de um vértice individual
        0 // Offset do início de um vértice individual para este atribut
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, // Localização do atributo
        2, // Número de elementos por atributo
        gl.FLOAT, // Tipo dos elementos
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Tamanho de um vértice individual
        3 * Float32Array.BYTES_PER_ELEMENT // Offset para as coordenadas de textura
    );

    // Habilita os atributos para uso
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    //
    // Criar Textura
    //
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);

    // Configurações da textura
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Carrega a imagem como textura
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('slime') )
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Define o programa ativo
    gl.useProgram(program);

    // Obter localizações das variáveis uniformes
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    var lightDirectionUniformLocation = gl.getUniformLocation(program, 'lightDirection');

    // Inicializar matrizes e direção da luz
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    var lightDirection = new Float32Array([0.0, 0.0, 0.0]); // Direção da luz

    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(60), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    // Enviar matrizes uniformes para os shaders
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    gl.uniform3fv(lightDirectionUniformLocation, lightDirection);

    // Matrizes auxiliares para rotação
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);

    // Parâmetros de movimento dos cubos
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

    // Iniciar o loop de renderização
    requestAnimationFrame(loop);
};
