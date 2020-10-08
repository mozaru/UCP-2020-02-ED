# Fila

## FIFO - "First In First Out"
## "primeiro a entrar é o primeiro a sair"

operações basicas:

- **vazia**  -> retorna verdadeiro se nao existe elementos na fila e falso caso contrario		
- **cheia**  -> retorna verdadeiro se a fila ja esta na sua capacidade maxima de ocupação e falso caso contrário
- **primeiro** -> retorna o valor do elemento mais antigo na fila, ou seja, o valor do elemento no inicio da fila
- **ultimo** -> retorna o valor do elemento mais recente na fila, ou seja, o valor do elemento no final da fila
-**inserir** -> insere um novo elemento ao final da fila
-**remover** -> remove o elemento mais antigo na fila, ou seja, o elemento no inicio da fila

Implementação de uma fila de reais em C

~~~C
#include <stdio.h>
#include <stdlib.h>

#define _MAX_ 100 

typedef float TInfo;

typedef struct
{
  TInfo v[_MAX_];
  int iInicio,iFim;       
} TFila; 

#define prox(x) = ((x+1)%_MAX_)

void inicializar(TFila *f)
{
  (*f).iInicio =  0;
  (*f).iFim    = -1;
}

void finalizar(TFila *f)
{
  (*f).iInicio =  0;
  (*f).iFim    = -1;
}

int vazia(TFila f)
{
   return f.iFim==-1;
}

int cheia(TFile f)
{
   return f.iFim!=-1 && prox(f.iFim) == f.iInicio;
}

TInfo primeiro(TFila f)
{
  if (vazia(f))
  {
     perror("fila vazia ao tentar pegar o valor do primeiro elemento\n");
     exit(1);
  }  
  else
    return f.v[f.iInicio];
}

TInfo ultimo(TFila f)
{
  if (vazia(f))
  {
     perror("fila vazia ao tentar pegar o valor do ultimo elemento\n");
     exit(2);
  }  
  else
     return f.v[f.iFim];
}


void inserir(TFila *f, TInfo info)
{
  if (cheia(*f))
  {
     perror("fila cheia ao tentar inserir\n");
     exit(3);
  }  
  else
  {
     (*f).iFim = prox((*f).iFim);
     (*f).v[(*f).iFim] = info;
  }
} 

void remover(Tfila *f)
{
  if (vazia(*f))
  {
     perror("fila vazia ao tentar remover\n");
     exit(4);
  }  
  else if ((*f).iInicio == (*f).iFim)
  {
     (*f).iInicio = 0;
     (*f).iFim = -1;
  }
  else
     (*f).iInicio = prox((*f).iInicio);
}

int main(void)
{
   TFila f;
   float n;

   inicializar(&f);

   while (scanf("%f",&n)>0)
   	inserir(&f, n);

   while (!vazia(f))
   {
      printf("%.2f ", primeiro(f));
      remover(&f);
   }
          

   finalizar(*f);
  
   return 0;
}

~~~


