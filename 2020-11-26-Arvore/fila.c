#include <stdio.h>
#include <stdlib.h>

#include "fila.h"


void inicializar_fila(TFila *f)
{
/*  (*f).inicio = NULL;
    (*f).fim = NULL;
*/
   f->inicio = NULL;
   f->fim = NULL;
}

void finalizar_fila(TFila *f)
{
   TNoFila *aux;
   while (f->inicio!=NULL)
   {
      aux=f->inicio;
      f->inicio = aux->prox;
      free(aux);
   } 
   f->fim = NULL;
}

int vazia_fila(TFila f)
{
   return f.inicio == NULL;
}

int cheia_fila(TFila f)
{
    TNoFila *aux;
    aux = (TNoFila*) malloc(sizeof(TNoFila)); 
    if (aux==NULL)
      return 1; //verdadeiro
    else
    {
       free(aux);
       return 0;//falso
    }
}

TInfoFila primeiro_fila(TFila f)
{
  if (vazia_fila(f))
  {
     perror("fila vazia ao tentar pegar o valor do primeiro elemento\n");
     exit(1);
  }  
  else
  {
     return f.inicio->info;
  }
}

TInfoFila ultimo_fila(TFila f)
{
  if (vazia_fila(f))
  {
     perror("fila vazia ao tentar pegar o valor do ultimo elemento\n");
     exit(2);
  }  
  else
  {
     return f.fim->info;
  }
}


void inserir_fila(TFila *f, TInfoFila info)
{
  if (cheia_fila(*f))
  {
     perror("fila cheia ao tentar inserir\n");
     exit(3);
  }  
  else
  {
     TNoFila *aux = (TNoFila*)malloc(sizeof(TNoFila));
     aux->info = info;
     aux->prox = NULL;
     if (f->fim!=NULL)
        f->fim->prox = aux;
     f->fim=aux;
     if (f->inicio==NULL)
        f->inicio=aux;
  }
} 

void remover_fila(TFila *f)
{
  if (vazia_fila(*f))
  {
     perror("fila vazia ao tentar remover\n");
     exit(4);
  }  
  else
  {
     TNoFila *aux = f->inicio;	
     f->inicio = aux->prox;
     free(aux);
     if (f->inicio==NULL)
        f->fim = NULL;
  }
}

