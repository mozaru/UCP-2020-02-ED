#ifndef _PILHA_H_
#define _PILHA_H_

#include"arvore.h"

typedef TNo* TInfoPilha;

typedef struct TNoPilha {
   TInfoPilha       info;
   struct TNoPilha* prox;  
} TNoPilha;

typedef struct {
   TNoPilha *pTopo;
} TPilha;

void inicializar_pilha(TPilha *P);
void finalizar_pilha(TPilha *P);
int vazia_pilha(TPilha P);
int cheia_pilha(TPilha P);
TInfoPilha topo_pilha(TPilha P);
void inserir_pilha(TPilha *P, TInfoPilha valor);
void remover_pilha(TPilha *P);

#endif