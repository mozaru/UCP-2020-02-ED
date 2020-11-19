#include <stdio.h>
#include <stdlib.h>

typedef float TInfo;

typedef struct TNo{
   TInfo info;
   struct TNo *prox;
} TNo;

typedef struct
{
  TNo *inicio,*fim; 
} TFila; 


void inicializar(TFila *f)
{
/*  (*f).inicio = NULL;
    (*f).fim = NULL;
*/
   f->inicio = NULL;
   f->fim = NULL;
}

void finalizar(TFila *f)
{
   TNo *aux;
   while (f->inicio!=NULL)
   {
      aux=f->inicio;
      f->inicio = aux->prox;
      free(aux);
   } 
   f->fim = NULL;
}

int vazia(TFila f)
{
   return f.inicio == NULL;
}

int cheia(TFila f)
{
    TNo *aux;
    aux = (TNo*) malloc(sizeof(TNo)); 
    if (aux==NULL)
      return 1; //verdadeiro
    else
    {
       free(aux);
       return 0;//falso
    }
}

TInfo primeiro(TFila f)
{
  if (vazia(f))
  {
     perror("fila vazia ao tentar pegar o valor do primeiro elemento\n");
     exit(1);
  }  
  else
  {
     return f.inicio->info;
  }
}

TInfo ultimo(TFila f)
{
  if (vazia(f))
  {
     perror("fila vazia ao tentar pegar o valor do ultimo elemento\n");
     exit(2);
  }  
  else
  {
     return f.fim->info;
  }
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
     TNo *aux = (TNo*)malloc(sizeof(TNo));
     aux->info = info;
     aux->prox = NULL;
     if (f->fim!=NULL)
        f->fim->prox = aux;
     f->fim=aux;
     if (f->inicio==NULL)
        f->inicio=aux;
  }
} 

void remover(TFila *f)
{
  if (vazia(*f))
  {
     perror("fila vazia ao tentar remover\n");
     exit(4);
  }  
  else
  {
     TNo *aux = f->inicio;	
     f->inicio = aux->prox;
     free(aux);
     if (f->inicio==NULL)
        f->fim = NULL;
  }
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
          

   finalizar(&f);
  
   return 0;
}
