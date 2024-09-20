#  Processamento Gráfico - Projeto individual

Objetivo:
    Visualizar dois objetos 3D. metas, adicionar textura em ambos objetos, iluminação e movimentos independentes.

Ferramentas utilizadas:
    JavaScript - Linguagem de programacao optada para realizacao do projeto

    WebGL - API do JavaScript que possui o induito de renderizar objetos 3D e 2D dentro de navegadores web

    GL-Matrix (versao 3.4.0) - Bliblioteca do JavaScript para manipulacao de matrizes e vetores, seu induito neste projeto e auxiliar na rotacao e movimento dos objetos

Como rodar:
    É necessario abrir um servidor local - Pois navegadores nao permite o uso de texturas, logo a solucao e abrir um servidor local, siga os passos:
    1- Abra um terminal com acesso adminstrativo em P2
    2- npm install -g http-server
    3- inicie o servidor - http-server
    4- acesse o servidor - [http-server](http://192.168.15.9:8080)

    Adendo: As vezes o computador náo permite a execucao de um servidor https com scrips externos, no meu caso o comando que eu executei para se livrar desse erro foi o seguinte:
    Set-ExecutionPolicy RemoteSigned
    Esse comando altera a política de execução para permitir scripts

Fontes:
    https://www.youtube.com/watch?v=kB0ZVUrI4Aw&list=PLjcVFFANLS5zH_PeKC6I8p0Pt1hzph_rt&index=2
    Conjunto de videos ensinando a ferramente WebGL dentre outras ferramentas
