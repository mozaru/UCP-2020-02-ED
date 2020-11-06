#include<stdio.h>
#include<stdlib.h> //malloc e o free

int main()
{
	int *vet, i, qtd;

        printf("entre com a quantidade de numeros:");
        scanf("%i", &qtd);

        vet = (int *)malloc(sizeof(int) * qtd);
       
        for(i=0; i< qtd; i++)
        {
            printf("V[%i]=",i);
            scanf("%i", &vet[i]);
        }           
  
      	for(i=qtd-1; i>= 0; i--)
            printf("V[%i]=%i\n",i, vet[i]);
    
        free(vet);
}