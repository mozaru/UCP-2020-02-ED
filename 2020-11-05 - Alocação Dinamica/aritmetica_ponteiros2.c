#include<stdio.h>

int main()
{
   int i;
   double a;
   unsigned char *p;
    
   a=-2;
   p = (unsigned char*)&a;
   printf("a = %i\n",a);

   for(i=0;i<sizeof(a);i++)
      printf("a[%i] = %i\n",i,p[i]);
   return 0;
}