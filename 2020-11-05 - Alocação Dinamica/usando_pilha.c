//pilha de reais por ponteiro
//uri 1242 - Alien Ribonucleic Acid 

#include<stdio.h>
#include<stdlib.h>

typedef char TInfo;

typedef struct TNo {
   TInfo       info;
   struct TNo* prox;  
} TNo;

typedef struct {
   TNo *pTopo;
} TPilha;


void inicializar(TPilha *P)  //usamos o * para passagem por referencia
{
  (*P).pTopo = NULL;
}

void finalizar(TPilha *P)
{
  TNo *aux,*ant;
  aux = (*P).pTopo;
  while (aux!=NULL)
  {
     ant = aux;
     aux = (*aux).prox;
     free(ant);
  }
  (*P).pTopo = NULL;
}

int vazia(TPilha P)  //nao precisa passar por referencia pq nao altera a variavel P
{
   return P.pTopo == NULL;
}

int cheia(TPilha P)  //nao precisa passar por referencia pq nao altera a variavel P
{
   TNo *aux;
   aux = (TNo*) malloc(sizeof(TNo));
   if (aux==NULL)
     return 1;//verdadeiro
   else
   {
     free(aux);
     return 0;//falso
   }
}

TInfo topo(TPilha P)
{
   return (*P.pTopo).info;
}

void inserir(TPilha *P, TInfo valor)
{
   TNo *aux;
    if (cheia(*P))
       printf("Pilha cheia!");
    else
    {
      aux = (TNo*) malloc(sizeof(TNo));
      (*aux).info = valor;
      (*aux).prox = (*P).pTopo;
      (*P).pTopo = aux;
    }
}

void remover(TPilha *P)
{
    if (vazia(*P))
       printf("Pilha vazia!");
    else   
    {
       TNo *aux;
       aux = (*P).pTopo; 
       (*P).pTopo = (*aux).prox;
       free(aux);
    }
}


int compativel(char base1, char base2)
{
    return ((base1=='B' && base2=='S') || (base1=='S' && base2=='B') ||
            (base1=='F' && base2=='C') || (base1=='C' && base2=='F'));
}

#include <string.h>

#define _MAX_ 300

int main(void) {
	TPilha fita;
	int ligacoes,i,tam;
	char linha[_MAX_], letra;
	
	while ( scanf("%s", linha) > 0 )
	{
	    tam = strlen(linha);
	    inicializar(&fita);
            ligacoes = 0;
            for(i=0;i<tam;i++)
            {
                letra = linha[i];
                if (vazia(fita) || !compativel(letra, topo(fita)))
                    inserir(&fita, letra);
                else { 
                    ligacoes++;
                    remover(&fita);
                }
            }
            printf("%i\n", ligacoes); 
	    finalizar(&fita);
	}
	return 0;
}

