#include<stdio.h>
#include<stdlib.h>
#include<errno.h>

typedef float TInfo;

typedef struct TNo
{
   TInfo info;
   struct TNo *prox;  
} TNo;

typedef struct
{
  TNo *inicio;
} TLista;

void inicializar(TLista *l);
void finalizar(TLista *l);
int vazia(TLista l);
int cheia(TLista l);
int obterQtd(TLista l);
TInfo obterElemento(TLista l, int pos);
TInfo atribuirElemento(TLista *l, int pos, TInfo info);
int obterIndice(TLista l, TInfo info);
int existe(TLista l, TInfo info);
void inserirNoInicio(TLista *l,TInfo info);
void inserirNoFinal(TLista *l,TInfo info);
void inserirOrdenado(TLista *l,TInfo info);
void inserirNaPosicao(TLista *l,int pos, TInfo info);
void removerNoInicio(TLista *l);
void removerNoFinal(TLista *l);
void removerNaPosicao(TLista *l, int pos);
void removerElemento(TLista *l,TInfo info);
void removerTodos(TLista *l);

void inicializar(TLista *l)
{
   l->inicio = NULL;
}


void finalizar(TLista *l)
{
   while (!vazia(*l))
      removerNoInicio(&*l);
}

int vazia(TLista l)
{
   return l.inicio==NULL;
}
   
int cheia(TLista l)
{
   TNo *aux;
   aux = (TNo *) malloc(sizeof(TNo));
   if (aux == NULL)
      return 1;
   else
   {
      free(aux); 
      return 0;
   }
}

int obterQtd(TLista l)
{
   int qtd=0;
   TNo *aux;
   aux = l.inicio;
   while (aux!=NULL)
   {
      qtd++;
      aux = aux->prox;
   }
   return qtd;
}

TInfo obterElemento(TLista l, int pos)
{
   if (vazia(l))
   {
      perror("Lista vazia quando tentava obter o valor de um elemento\n");
      exit(1);
   }
   else 
   {
      TNo *aux = l.inicio;
      while (aux!=NULL && pos>0)
      {
         pos--;
         aux = aux->prox;
      }
      if(pos<0 || aux==NULL)
      {
         perror("Indice fora faixa quando tentava obter o valor de um elemento\n");
         exit(2);
      } else {
         return aux->info;
      }  
   }
}

TInfo atribuirElemento(TLista *l, int pos, TInfo info)
{
   if (vazia(*l))
   {
      perror("Lista vazia quando tentava alterar o valor de um elemento\n");
      exit(3);
   }
   else 
   {
      TNo *aux = l->inicio;
      while (aux!=NULL && pos>0)
      {
         pos--;
         aux = aux->prox;
      }

      if(pos<0 || aux==NULL)
      {
         perror("Indice fora faixa quando tentava alterar o valor de um elemento\n");
         exit(4);
      } else 
	 aux->info = info;
   }
}

int existe(TLista l, TInfo info)
{
    int achou = 0;
    TNo *aux = l.inicio;
    while (!achou && aux!=NULL)
    	if (aux->info == info)
	   achou = 1;
        else
           aux = aux->prox;
    return achou;
}

void inserirNoInicio(TLista *l,TInfo info)
{
   if (cheia(*l))
   {
      perror("Lista cheia quando tentava inserir no inicio\n");
      exit(5);
   }
   else
   {
      TNo *novo = (TNo*) malloc(sizeof(TNo));
      novo->info = info;
      novo->prox = l->inicio;
      l->inicio = novo;
   }
}

void inserirNoFinal(TLista *l,TInfo info)
{
   if (cheia(*l))
   {
      perror("Lista cheia quando tentava inserir no final\n");
      exit(6);
   }
   else
   {
      TNo *aux,*ant;
      TNo *novo = (TNo*) malloc(sizeof(TNo));
      novo->info = info;
      novo->prox = NULL;
      ant = NULL;
      aux = l->inicio;
      while (aux!=NULL)
      {
         ant = aux;
         aux = aux->prox;
      }
      if (ant==NULL)
        l->inicio = novo;
      else
        ant->prox = novo;
   }
}

void inserirOrdenado(TLista *l,TInfo info)
{
   if (cheia(*l))
   {
      perror("Lista cheia quando tentava inserir ordenadamente\n");
      exit(7);
   }
   else
   {
      TNo *aux,*ant;
      TNo *novo = (TNo*) malloc(sizeof(TNo));
      novo->info = info;
      novo->prox = NULL;
      ant = NULL;
      aux = l->inicio;
      while (aux!=NULL && aux->info < info)
      {
         ant = aux;
         aux = aux->prox;
      }
      novo->prox = aux;
      if (ant==NULL)
        l->inicio = novo;
      else
        ant->prox = novo;
   }
}

void inserirNaPosicao(TLista *l,int pos, TInfo info)
{
   if (cheia(*l))
   {
      perror("Lista cheia quando tentava inserir em uma posicao especifica\n");
      exit(8);
   }
   else
   {
      TNo *aux,*ant;
      TNo *novo = (TNo*) malloc(sizeof(TNo));
      novo->info = info;
      novo->prox = NULL;
      ant = NULL;
      aux = l->inicio;
      while (aux!=NULL && pos>0)
      {
         pos--;
         ant = aux;
         aux = aux->prox;
      }
      if(pos!=0)
      {
            perror("Indice fora faixa quando tentava inserir um elemento em uma posicao especifica\n");
            exit(15);
      } else { 
        novo->prox = aux;
        if (ant==NULL)
          l->inicio = novo;
        else
          ant->prox = novo;
      }
   }
}

void removerNoInicio(TLista *l)
{
   if (vazia(*l))
   {
      fprintf(stderr,"Lista vazia quando tentava remover o primeiro elemento\n");
      exit(9);
   }
   else 
   {
      TNo *aux = l->inicio;
      l->inicio = aux->prox; 
      free(aux); 
   }
}

void removerNoFinal(TLista *l)
{
   if (vazia(*l))
   {
      perror("Lista vazia quando tentava remover o ultimo elemento\n");
      exit(10);
   }
   else 
   {
      TNo *aux = l->inicio;
      TNo *ant = NULL;
      while( aux->prox != NULL )
      {
         ant = aux;
         aux = aux->prox;
      }
      if (ant==NULL)
         l->inicio = NULL;  
      else
         ant->prox = NULL;
      free(aux); 
   }
}

void removerNaPosicao(TLista *l, int pos)
{
   if (vazia(*l))
   {
      perror("Lista vazia quando tentava remover o elemento de uma posicao especifica\n");
      exit(13);
   }
   else 
   {
      TNo *aux = l->inicio;
      TNo *ant = NULL;
      while( aux != NULL && pos>0 )
      {
         pos--;
         ant = aux;
         aux = aux->prox;
      }
      if(pos!=0)
      {
         perror("Indice fora faixa quando tentava remover o elemento de uma posicao especifica\n");
         exit(14);
      } else {
         if (ant==NULL)
            l->inicio = aux->prox;  
         else
            ant->prox = aux->prox;
         free(aux); 
      }
   }
}

void removerElemento(TLista *l, TInfo info)
{
    if (vazia(*l))
    {
        perror("Lista vazia quando tentava remover um elemento especifico\n");
        exit(11);
    }
    else
    {
      TNo *aux = l->inicio;
      TNo *ant = NULL;
      while( aux != NULL && aux->info!=info )
      {
         ant = aux;
         aux = aux->prox;
      }
      if(aux==NULL)
      {
         perror("elemento nao encontrado ao remover\n");
         exit(12);
      } else {
         if (ant==NULL)
            l->inicio = aux->prox;  
         else
            ant->prox = aux->prox;
         free(aux); 
      }
    }
}

void removerTodos(TLista *l)
{
   while (!vazia(*l))
      removerNoInicio(&*l);
}


int main(void)
{
  TLista l;
  int i;
  float n;
  inicializar(&l);

  scanf("%f",&n);   
  while (n!=0)
  {
     inserirOrdenado(&l, n);
     scanf("%f",&n);
  }
 
  for(i=0;i<obterQtd(l);i++)
    printf("%.2f ", obterElemento(l,i));
  printf("\n");
  
  while (scanf("%f",&n)>0)
  {
     if (existe(l,n))
     {
        removerElemento(&l,n);
        printf("Removido com sucesso!\n");
     } 
     else   
        printf("Valor nao encontrado!\n");
  }
  removerNoInicio(&l);
  for(i=0;i<obterQtd(l);i++)
    printf("%.2f ", obterElemento(l,i));
  printf("\n");

  finalizar(&l);
  return 0;
}