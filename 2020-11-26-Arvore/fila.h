#ifndef _FILA_H_
#define _FILA_H_

#include "arvore.h"

typedef TNo* TInfoFila;

typedef struct TNoFila{
   TInfoFila       info;
   struct TNoFila *prox;
} TNoFila;

typedef struct
{
  TNoFila *inicio,*fim; 
} TFila;

void inicializar_fila(TFila *f);
void finalizar_fila(TFila *f);
int vazia_fila(TFila f);
int cheia_fila(TFila f);
TInfoFila primeiro_fila(TFila f);
TInfoFila ultimo_fila(TFila f);
void inserir_fila(TFila *f, TInfoFila info);
void remover_fila(TFila *f);

#endif