Ferramentas necessarias para execucao

C++ - Linguagem de programa optada para o desenvolvimento do projeto

MakeFile - Ajuda na execucao e armazenamento da informacao gerada pelo programa

Metodo para execucao do programa:

    Entre na pasta Build - "cd build"

    Execute os seguintes linhas de comando
        cmake -G "MinGW Makefiles" ..
        mingw32-make

    Cria um txt com o resultado
    .\executavel.exe > output.txt

    Cria uma imagem em ppm do resultad
    .\executavel.exe > image.ppm

    Comando para ler o txt
    start output.txt

    Comando para abrir a imagem
    start image.ppm

    !!! As vezes o computador nao tem nenhuma ferramente capaz de abrir a imagem !!!
    Para solucionar esse problema use o site:
    https://www.cs.rhodes.edu/welshc/COMP141_F16/ppmReader.html
    Neste link basta colocar o arquivo ppm que ele abre a imagem para voce