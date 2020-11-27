//pilha de reais por ponteiro
#include<stdio.h>
#include<stdlib.h>

#include"pilha.h"


void inicializar_pilha(TPilha *P)  //usamos o * para passagem por referencia
{
  (*P).pTopo = NULL;
}

void finalizar_pilha(TPilha *P)
{
  TNoPilha *aux,*ant;
  aux = (*P).pTopo;
  while (aux!=NULL)
  {
     ant = aux;
     aux = (*aux).prox;
     free(ant);
  }
  (*P).pTopo = NULL;
}

int vazia_pilha(TPilha P)  //nao precisa passar por referencia pq nao altera a variavel P
{
   return P.pTopo == NULL;
}

int cheia_pilha(TPilha P)  //nao precisa passar por referencia pq nao altera a variavel P
{
   TNoPilha *aux;
   aux = (TNoPilha*) malloc(sizeof(TNoPilha));
   if (aux==NULL)
     return 1;//verdadeiro
   else
   {
     free(aux);
     return 0;//falso
   }
}

TInfoPilha topo_pilha(TPilha P)
{
   return (*P.pTopo).info;
}

void inserir_pilha(TPilha *P, TInfoPilha valor)
{
    TNoPilha *aux;
    if (cheia_pilha(*P))
       printf("Pilha cheia!");
    else
    {
      aux = (TNoPilha*) malloc(sizeof(TNoPilha));
      (*aux).info = valor;
      (*aux).prox = (*P).pTopo;
      (*P).pTopo = aux;
    }
}

void remover_pilha(TPilha *P)
{
    if (vazia_pilha(*P))
       printf("Pilha vazia!");
    else   
    {
       TNoPilha *aux;
       aux = (*P).pTopo; 
       (*P).pTopo = (*aux).prox;
       free(aux);
    }
}



