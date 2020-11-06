#include<stdio.h>

int main(void)
{
   int x,y,*pi;
   double b,a,*pd;
   double vet[100];

   a=x=10;
   b=y=20;

   pi=&x;
   pd=&a;
   
   printf("x = %i  \t\t endereco=%p\t tamanho:%i\n", x, &x, sizeof(x));
   printf("y = %i  \t\t endereco=%p\t tamanho:%i\n", y, &y, sizeof(y));
   printf("pi= %p  \t endereco=%p\t tamanho:%i  mem[]=%i\n", pi, &pi, sizeof(pi), *pi);
   printf("a = %.1lf\t\t endereco=%p\t tamanho:%i\n", a, &a, sizeof(a));
   printf("b = %.1lf\t\t endereco=%p\t tamanho:%i\n", b, &b, sizeof(b));
   printf("pd= %p  \t endereco=%p\t tamanho:%i  mem[]=%.1lf\n", pd, &pd, sizeof(pd), *pd);

   *pd = 15;
   pd[1] = 25;
   printf("a = %.1lf\t\t endereco=%p\t tamanho:%i\n", a, &a, sizeof(a));

   printf("b = %.1lf\t\t endereco=%p\t tamanho:%i\n", b, &b, sizeof(b));
   
   printf("conteudo de vet=%p e endereco de vet[0]=%p\n", vet, &vet[0]);

   return 0;
}