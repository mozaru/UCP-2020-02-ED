#include<stdio.h>

int main()
{
   int *p,k;
   int a,b,c,d,e,f,g,h,i;
    
   p=&i;  
   for (k=0;k<9;k++)
	p[k] = k + 1;
  
   printf("a=%i\n",a);
   printf("b=%i\n",b);
   printf("c=%i\n",c);
   printf("d=%i\n",d);
   printf("e=%i\n",e);
   printf("f=%i\n",f);
   printf("g=%i\n",g);
   printf("h=%i\n",h);
   printf("i=%i\n",i);   

   for (k=0;k<9;k++)
     printf("p[%i]=%i\n",k,p[k]);

   for (k=0;k<9;k++)
     printf("p[%i]=%i\n",k,*(p+k));

   for (k=0;k<9;k++,p++)
     printf("p[%i]=%i\n",k,*p);
   return 0;
}