//==============================================================================================
// Originally written in 2016 by Peter Shirley <ptrshrl@gmail.com>
//
// To the extent possible under law, the author(s) have dedicated all copyright and related and
// neighboring rights to this software to the public domain worldwide. This software is
// distributed without any warranty.
//
// You should have received a copy (see file COPYING.txt) of the CC0 Public Domain Dedication
// along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//==============================================================================================

#include "rtweekend.h"

#include "camera.h"
#include "hittable.h"
#include "hittable_list.h"
#include "material.h"
#include "sphere.h"


int main() {

    //Mode e a variavel que vai controlar qual imagem vai ser processada
    // 0 e 1 representam a imagem com a camera num angulo top-down, 0 com elas proximas e 1 com ela igualmente separadas
    // 2 e 3 representam a imagem com a camera no angulo do horizonte, com 2 sendo ela em desordem e o 3 ordenadas
    int mode = 3; 
    hittable_list world;

    //Chamada para criacao do chao
    auto ground_material = make_shared<lambertian>(color(0.5, 0.5, 0.5));
    world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));

    //Esfera de madeira
    auto material1 = make_shared<lambertian>(color(0.4, 0.2, 0.1));

    //Esfera de prata polida (Reflete bem a luz, quase como um espelho)
    auto material2 = make_shared<metal>(color(0.7, 0.6, 0.5), 0.0);

    //Esfera azul de "borracha" (Material pouco refletivel que tem uma cor solida)
    auto material3 = make_shared<lambertian>(color(0.2, 0.3, 0.7));

    //Esfera de ouro "Escovado" (Reflete as cores, mas com pouca definicao de formas)
    auto material4 = make_shared<metal>(color(0.8, 0.6, 0.2), 0.3);

    //Esfera verde de "borracha" (Material pouco refletivel que tem uma cor solida)
    auto material5 = make_shared<lambertian>(color(0.1, 0.8, 0.1));

    // Esfera de Vidro Transparente: uma bola de vidro clara 
    auto material1a = make_shared<dielectric>(1.5);
    
    // Esfera de Vidro Oca: parece vidro imerso em água
    auto materialba = make_shared<dielectric>(1.0 / 1.5);

    // Esfera de cobre fosca, sem reflexos nítidos
    auto material2a = make_shared<lambertian>(color(0.9, 0.5, 0.4));

    // Esfera ciano cromada, superfície altamente reflexiva
    auto material3a = make_shared<metal>(color(0, 1, 1), 0.0);

    // Esfera magenta cromada, superfície altamente reflexiva
    auto material4a = make_shared<metal>(color(1, 0, 1), 0.0);

    // Esfera azul-conza de "borracha" parecida com um brinquedo de borracha
    auto material5a = make_shared<lambertian>(color(0.3, 0.4, 0.5));

    //Inicializacao da camera e seus paremetros universais
    camera cam;

    cam.aspect_ratio      = 16.0 / 9.0;
    cam.image_width       = 1200;
    cam.samples_per_pixel = 10;
    cam.max_depth         = 20;

    switch (mode)
    {
    case 0:
        //Na criacao de esferas, aqui esta o     x  y  z  Y sempre é inicializado com 1 pois ele conta a partir do meio da esfera
            world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material1));

            world.add(make_shared<sphere>(point3(-1, 1, 4), 1.0, material4));
            
            world.add(make_shared<sphere>(point3(1, 1, -4), 1.0, material2));

            world.add(make_shared<sphere>(point3(-1, 1, -4), 1.0, material3));

            world.add(make_shared<sphere>(point3(1, 1, 4), 1.0, material5));

            cam.vfov     = 40;
            cam.lookfrom = point3(0, 15, 0); 
            cam.lookat   = point3(0, 0, 0); 
            cam.vup      = vec3(0, 0, -1);
            cam.defocus_angle = 0.6;
            cam.focus_dist    = 15.0;

        break;
    
    case 1:
            world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material1));

            world.add(make_shared<sphere>(point3(-2, 1, 2), 1.0, material4));

            world.add(make_shared<sphere>(point3(2, 1, -2), 1.0, material2));

            world.add(make_shared<sphere>(point3(-2, 1, -2), 1.0, material3));

            world.add(make_shared<sphere>(point3(2, 1, 2), 1.0, material5));

            cam.vfov     = 40;
            cam.lookfrom = point3(0, 15, 0); 
            cam.lookat   = point3(0, 0, 0); 
            cam.vup      = vec3(0, 0, -1);
            cam.defocus_angle = 0.6;
            cam.focus_dist    = 15.0;

        break;
    
    case 2:
            world.add(make_shared<sphere>(point3(-5, 1, 0), 1.0, material1a));

            world.add(make_shared<sphere>(point3(-5, 1, 0), 0.7, materialba));

            world.add(make_shared<sphere>(point3(5, 1, 0), 1.0, material4a));

            world.add(make_shared<sphere>(point3(-2.5, 1, 0), 1.0, material2a));

            world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material3a));

            world.add(make_shared<sphere>(point3(2.5, 1, 0), 1.0, material5a));

            cam.vfov     = 20;
            cam.lookfrom = point3(-13, 2, 15);
            cam.lookat   = point3(-1, 0, 0);
            cam.vup      = vec3(0,1,0);
            cam.defocus_angle = 0.6;
            cam.focus_dist    = 15.0;

        break;
        
    case 3:
            world.add(make_shared<sphere>(point3(-1.25, 1, 3), 1.0, material1a));

            world.add(make_shared<sphere>(point3(-1.25, 1, 3), 0.9, materialba));

            world.add(make_shared<sphere>(point3(1.25, 1, 3), 1.0, material4a));  

            world.add(make_shared<sphere>(point3(-2.5, 1, 0), 1.0, material2a));

            world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material3a));
            
            world.add(make_shared<sphere>(point3(2.5, 1, 0), 1.0, material5a));        

            cam.vfov     = 20;
            cam.lookfrom = point3(0, 4, 15);
            cam.lookat   = point3(-1, 0, 0);
            cam.vup      = vec3(0,1,0);
            cam.defocus_angle = 0.6;
            cam.focus_dist    = 15.0;

        break;
    }
    //Renderizacao da imagem
    cam.render(world);

}
