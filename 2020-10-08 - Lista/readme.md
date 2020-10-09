# Lista 

## Operações Basicas da Lista 


- **Vazia**  -> retorna verdadeiro quando não existem elementos na lista e falso caso contrário
- **Cheia**  -> retorna verdadeiro quando a lista jaestá na sua capacidade maxima e falso caso contrário
- **ObterQtd** > retorna a quantidade de elementos na lista
- **ObterElemento(pos)** -> retorna o valor do elemento na posição pos 
- **AlterElemento(pos)** -> altera o valor do elemento na posição pos
- **Existe** -> retorna verdadeiro se o elemento foi encontrado na lista e falso caso contrário
- **Inserir**  
   - **InserirNoInicio** -> insere um novo elemento no inicio da lista
   - **InserirNoFinal** -> insere um novo elemento no fim da lista
   - **InserirOrdenado** -> insere um elemento na posição correta para manter a ordenação
   - **InserirNaPosicao** -> insere um elemento na posição especificada
- **Remover**
   - **RemoverNoInicio** -> remove o primeiro elemento
   - **RemoverNoFinal**  -> remove o ultimo elemento
   - **RemoverElemento** -> remove o elemento desejado
   - **RemoverNaPosicao** ->remove o elemento na posição especificada
   - **RemoverTodos** -> remove todos os elementos


implementação em C
~~~c
#include<stdio.h>
#include<stdlib.h>
#include<errno.h>

#define _MAX_ 100

typedef float TInfo;

typedef struct
{
   TInfo v[_MAX_];
   int   qtd;
} TLista;

void inicializar(TLista *l)
{
   (*l).qtd = 0;
}

void finalizar(TLista *l)
{
   (*l).qtd = 0;
}

int vazia(TLista l)
{
  return l.qtd==0;
}
   
int cheia(TLista l)
{
  return l.qtd == _MAX_;
}

int obterQtd(TLista l)
{
   return l.qtd;
}

TInfo obterElemento(TLista l, int pos)
{
   if (vazia(l))
   {
      perror("Lista vazia quando tentava obter o valor de um elemento\n");
      exit(1);
   }
   else if(pos<0 || pos>=l.qtd)
   {
      perror("Indice fora faixa quando tentava obter o valor de um elemento\n");
      exit(2);
   }  
   else 
     return l.v[pos];
}

TInfo atribuirElemento(TLista l, int pos, TInfo info)
{
   if (vazia(l))
   {
      perror("Lista vazia quando tentava atribuir o valor de um elemento\n");
      exit(3);
   }
   else if(pos<0 || pos>=l.qtd)
   {
      perror("Indice fora faixa quando tentava atribuir o valor de um elemento\n");
      exit(4);
   }  
   else 
     l.v[pos] = info;
}

int obterIndice(TLista l, TInfo info)
{
   int i=0;
   int achou = 0; //falso
   while (!achou && i<l.qtd)
      if (l.v[i] == info)
         achou = 1;//verdadeiro
      else
         i++;
   return achou?i:-1;      	 
}

int existe(TLista l, TInfo info)
{
   return obterIndice(l, info)!=-1;   	 
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
      int i;
      for(i=(*l).qtd-1; i>=0; i--)
        (*l).v[i+1] = (*l).v[i];
      (*l).v[ 0 ] = info;
      (*l).qtd++;
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
      (*l).v[ (*l).qtd ] = info;
      (*l).qtd++;
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
      int i;
      i = (*l).qtd-1;
      while(i>=0 && (*l).v[i]>info)
      {
        (*l).v[i+1] = (*l).v[i];
        i--;
      }
      (*l).v[ i+1 ] = info;
      (*l).qtd++;
   }
}
void inserirNaPosicao(TLista *l,int pos, TInfo info)
{
   if (cheia(*l))
   {
      perror("Lista cheia quando tentava inserir em uma posicao especifica\n");
      exit(8);
   }
   else if(pos<0 || pos>(*l).qtd)
   {
      perror("Indice fora faixa quando tentava inserir um elemento em uma posicao especifica\n");
      exit(15);
   } 
   else
   {
      int i;
      for(i=(*l).qtd-1; i>=pos; i--)
        (*l).v[i+1] = (*l).v[i];
      (*l).v[ pos ] = info;
      (*l).qtd++;
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
      int i;
      for (i=0;i<(*l).qtd-1;i++)
        (*l).v[i] = (*l).v[i+1];
      (*l).qtd--;
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
      (*l).qtd--;
}

void removerNaPosicao(TLista *l, int pos)
{
   if (vazia(*l))
   {
      perror("Lista vazia quando tentava remover o elemento de uma posicao especifica\n");
      exit(13);
   }
   else if(pos<0 || pos>=(*l).qtd)
   {
      perror("Indice fora faixa quando tentava remover o elemento de uma posicao especifica\n");
      exit(14);
   }  
   else 
   {
      int i;
      for (i=pos;i<(*l).qtd-1;i++)
        (*l).v[i] = (*l).v[i+1];
      (*l).qtd--;
   }
}

void removerElemento(TLista *l,TInfo info)
{
   if (vazia(*l))
   {
      perror("Lista vazia quando tentava remover um elemento especifico\n");
      exit(11);
   }
   else
   {
      int pos = obterIndice(*l, info);
      if ( pos == -1)
      {
         perror("elemento nao encontrado ao remover\n");
         exit(12);
      }
      else
        removerNaPosicao(l, pos);
   } 
}


void removerTodos(TLista *l)
{
   (*l).qtd = 0;
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
~~~

