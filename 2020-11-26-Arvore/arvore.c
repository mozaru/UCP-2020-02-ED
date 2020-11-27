//implementação de uma Árvore de numeros reais
#include<stdio.h>
#include<stdlib.h>

#include"fila.h"
#include"pilha.h"
#include"arvore.h"

void Inicializar(TArvore *a)
{
  a->raiz = NULL;
}

void FinalizarRec(TNo* no)
{
   if (no!=NULL)
   {
       FinalizarRec(no->esq);
       FinalizarRec(no->dir);
       free(no);
   }
}

void Finalizar(TArvore *a)
{
   FinalizarRec(a->raiz);   
   a->raiz=NULL;
}

int Vazia(TArvore a)
{
   return a.raiz == NULL;
}  


int Cheia(TArvore a)
{
  TNo *aux = (TNo*) malloc(sizeof(TNo));
  if (aux == NULL) 
    return 1;
  else
  {
    free(aux); 
    return 0;
  }
}

void EmOrdemRec(TNo* no)
{
   if (no!=NULL)
   {
       EmOrdemRec(no->esq);
       printf("%.2f ",no->info);
       EmOrdemRec(no->dir);
   }
}

void EmOrdem(TArvore a) {   EmOrdemRec(a.raiz);    }

void PreOrdemRec(TNo* no)
{
   if (no!=NULL)
   {
       printf("%.2f ",no->info);
       PreOrdemRec(no->esq);
       PreOrdemRec(no->dir);
   }
}

void PreOrdem(TArvore a) {   PreOrdemRec(a.raiz);    }

void PosOrdemRec(TNo* no)
{
   if (no!=NULL)
   {
       PosOrdemRec(no->esq);
       PosOrdemRec(no->dir);
       printf("%.2f ",no->info);
   }
}

void PosOrdem(TArvore a) {   PosOrdemRec(a.raiz);    }

int AlturaRec( TNo *No )
{
   if (No == NULL)
      return 0;
   else { 
     int hesq = AlturaRec(No->esq);
     int hdir = AlturaRec(No->dir);
     return (hesq>hdir? hesq : hdir) + 1;
   }
}

int FBN_No( TNo *No )
{
   if (No == NULL)
     return 0;
   else
     return AlturaRec( No->dir ) - AlturaRec( No->esq ); 
}

int Altura(TArvore a)
{
  return AlturaRec( a.raiz );
}

int FBN(TArvore a)
{ 
  return FBN_No( a.raiz );
}

TNo* BuscarRec(TNo *no, TInfo info)
{
#ifdef DEBUG
  if (no==NULL)
    printf("NULL\n");
  else
    printf("%.2f ",no->info);
#endif

  if (no == NULL)
     return NULL;
  else if ( info < no->info )
     return BuscarRec( no->esq, info);
  else if ( info > no->info )
     return BuscarRec( no->dir, info);
  else
     return no;
}

/*int Existe(TArvore a, TInfo info)
{
  TNo *no = a.raiz;
  while (no != NULL && no->info!=info)
     if ( info < no->info )
        no = no->esq;
     else 
        no = no->dir;
    
   return no!=NULL;
}*/

int Existe(TArvore a, TInfo info)
{
   return BuscarRec( a.raiz, info) != NULL;  
}

void Inserir(TArvore *a, TInfo info)
{
   if (Cheia(*a))
   {
       printf("Arvore cheia!");
       exit(0);
   } else { 
      TNo *novo, *no, *pai;
      novo = (TNo*) malloc(sizeof(TNo));
      novo->esq = novo->dir = NULL;
      novo->info = info;
      no = a->raiz;
      pai = NULL;
      while (no != NULL)
      {
        pai = no;
     	if ( info < no->info )
           no = no->esq;
     	else 
           no = no->dir;
      }
      if (pai==NULL)
        a->raiz = novo;
      else if (info < pai->info)
        pai->esq = novo;
      else
        pai->dir = novo;
   }
}


void Largura(TArvore a)
{
   if (a.raiz!=NULL)
   {
      TFila f;  
      inicializar_fila(&f);  
      inserir_fila(&f, a.raiz);
      while (!vazia_fila(f) )
      { 
         TNo *no = primeiro_fila(f);
         remover_fila(&f);
         printf("%.2f ", no->info);
	 if (no->esq!=NULL)		inserir_fila(&f, no->esq);
	 if (no->dir!=NULL)		inserir_fila(&f, no->dir);
      }
      finalizar_fila(&f);  
   }    
}

void Profundidade(TArvore a)
{
   if (a.raiz!=NULL)
   {
      TPilha p;  
      inicializar_pilha(&p);  
      inserir_pilha(&p, a.raiz);
      while (!vazia_pilha(p) )
      { 
         TNo *no = topo_pilha(p);
         remover_pilha(&p);
         printf("%.2f ", no->info);
	 if (no->dir!=NULL)		inserir_pilha(&p, no->dir);
	 if (no->esq!=NULL)		inserir_pilha(&p, no->esq);
      }
      finalizar_pilha(&p);  
   } 
}

void MostrarArvore(TArvore a)
{
   system("cls");
   printf("Pre-Ordem:");
   PreOrdem(a);
   printf("\nEm-Ordem :");
   EmOrdem(a);
   printf("\nPos-Ordem:");
   PosOrdem(a);
   printf("\nLargura:");
   Largura(a);
   printf("\nProfundidade:");
   Profundidade(a);
   printf("\nAltura:%i\nFBN:%i\n\n\n", Altura(a), FBN(a));
}

char Ler(TInfo *info)
{
   char str[20];
   static char op='I';
   printf("Entre com o valor:");
   scanf("%s",str);
   if (isdigit(str[0]) || str[0]=='-' || str[0]=='+')
      *info = atof(str);
   else
   {
      op = str[0];
      *info = atof(&str[1]);
   }
   return op;
}

int main(void)
{
   TArvore a;
   char op;
   float valor;
   Inicializar(&a);
   MostrarArvore(a);
   while( (op = Ler(&valor)) != 'f')
   {
      if (op=='I' || op=='i')
      {
        Inserir(&a, valor);
        MostrarArvore(a);
      }
      else if (op=='B' || op=='b')
      {
        printf("O Valor %.2f %sfoi encontrado!\n", valor, Existe(a,valor)?"":"nao ");
      }
   }
   Finalizar(&a);
   return 0;
}
