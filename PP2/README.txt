Ferramentas necessarias para execucao:

    C++ - Linguagem de programa optada para o desenvolvimento do projeto

    MakeFile - Ajuda na execucao e armazenamento da informacao gerada pelo programa
        https://cmake.org/download/

Metodo para execucao do programa:

    Selecionar qual modelo de imagem ira ser vista
        Dentro do main existe a variavel Mode, ela e a variavel que vai controlar qual imagem vai ser processada
        0 e 1 representam a imagem com a camera num angulo top-down, 0 com elas proximas e 1 com ela igualmente separadas
        2 e 3 representam a imagem com a camera no angulo do horizonte, com 2 sendo ela em desordem e o 3 ordenadas
   
    Abre um terminal na pasta build
        "cd build"

    Faca a exclusao (Caso exista) do makeFile antigo
        rm -r CMakeCache.txt CMakeFiles #Linux-version
        Remove-Item -Recurse -Force CMakeCache.txt, CMakeFiles #Windowns-version
    
    Crie o MakeFile
        cmake -G "MinGW Makefiles" ..
        mingw32-make

    Execute o MakeFile para criar um output em txt
        .\executavel.exe > output.txt

    Execute o MakeFile para criar um output em ppm
        .\executavel.exe > image.ppm

    Comando para ler o txt
        start output.txt

    Comando para abrir a imagem
        start image.ppm

    !!! As vezes o computador nao tem nenhuma ferramente capaz de abrir a imagem !!!
    Para solucionar esse problema use o site:
    https://www.cs.rhodes.edu/welshc/COMP141_F16/ppmReader.html
    Neste link basta colocar o arquivo ppm que ele abre a imagem para voce

Definicao do WCS e Posicionamento dos objetos:
    O ponto (0,0,0) deste projeto e o meio exato do plano, o "chao" e uma esfera gigantesca com origem no -1000 com 1000 de raio, logo, a parte visivel para a camera  e so sua parte superior
    que esta localizada em (0,0,0) (-1000 +1000), pois o posicionamento e baseado no centro das esferas, nao em sua extremidade. 
    Por esse motivo, todas as esferas colocadas possuem (x,1,z), com x e z podendo ter varios valores, como as esferas tem raio 1 e seu posicionamento e dado a partir de seu centro
    se elas iniciarem com y = 0, elas apareciriam pela metade
    Valores em x: positivos = Esfera mais a direita    negativos =  Esfera mais a esquerda
    Valores em z: positivos = Esfera mais para frente  negativos =  Esfera mais para a frente

Resultado Obtido:
    Com a producao deste projeto, foram elaboradas 4 imagens, essas imagens podem ser obtidas tanta na execucao do programa, mas tambem estao armazenadas na pasta "Result_Img"
    tanto seu arquivo original de execucao (Em ppm), como também ja modificadas para png

Fontes: 
    Esse projeto foi feito em conjunto com o curso "Ray Tracing in One Weekend", podemos observar que alguns arquivos foram retirados do curso de forma literal. 
    O objetivo desse projeto nao foi a criacao do algoritmo, mas sim visualizar como podemos manipular objetos e seus materias dentro de um ambiente 3D com RayTracing.
    Caso voce queira acessar o curso e entender a funcionalidade completa de todas as funcoes, acesse o link: https://raytracing.github.io/books/RayTracingInOneWeekend.html