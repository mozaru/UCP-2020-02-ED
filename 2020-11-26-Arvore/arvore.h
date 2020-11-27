#ifndef _ARVORE_H_
#define _ARVORE_H_

typedef float TInfo; 

typedef struct TNo{
   TInfo info;
   struct TNo *esq, *dir;   
} TNo;

typedef struct{
  TNo* raiz; 
} TArvore;

#endif
