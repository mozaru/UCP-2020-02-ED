# Lista 

## Operações Básicas da Lista Encadeada


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


implementação em C da lista encadeada *por vetor*
~~~c
#include<stdio.h>
#include<stdlib.h>
#include<errno.h>

#define _MAX_ 100

typedef float TInfo;

typedef struct
{
   TInfo info;
   int   prox;
} TNo;

typedef struct
{
   TNo v[_MAX_];
   int   inicio, disponiveis;
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
   int i;
   (*l).inicio = -1;
   (*l).disponiveis = 0;
   for(i=0;i<_MAX_-1;i++)
      (*l).v[i].prox = i+1;
   (*l).v[_MAX_-1].prox = -1;
}


void finalizar(TLista *l)
{
   while (!vazia(*l))
      removerNoInicio(&*l);
}

int vazia(TLista l)
{
  return l.inicio == -1;
}
   
int cheia(TLista l)
{
  return l.disponiveis == -1;
}

int obterQtd(TLista l)
{
   int qtd = 0;
   int aux = l.inicio;
   while( aux != -1 )
   {
      qtd++;
      aux = l.v[aux].prox;
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
      int i = 0;
      int aux = l.inicio;
      while( i<pos && aux != -1 )
      {
         aux = l.v[aux].prox;
         i++;
      }
      if(pos<0 || aux==-1)
      {
         perror("Indice fora faixa quando tentava obter o valor de um elemento\n");
         exit(2);
      } else {
         return l.v[aux].info;
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
      int i = 0;
      int aux = (*l).inicio;
      while( i<pos && aux != -1 )
      {
         aux = (*l).v[aux].prox;
         i++;
      }
      if(pos<0 || aux==-1)
      {
         perror("Indice fora faixa quando tentava alterar o valor de um elemento\n");
         exit(4);
      } else {
         (*l).v[aux].info = info;
      }  
   }
}

int obterIndice(TLista l, TInfo info)
{
   int achou = 0; //falso
   int pos = 0;
   int aux = l.inicio;
   while( aux != -1 && !achou)
   {
        if (l.v[aux].info == info)
            achou = 1;
        else {
            pos++;
            aux = l.v[aux].prox;
        }
   }
   return achou?pos:-1;      	 
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
      int novo;
      novo = (*l).disponiveis;                              //pega o primeiro no disponivel
      (*l).disponiveis = (*l).v[(*l).disponiveis].prox;     //remove o no da lista de disponiveis
      (*l).v[novo].info = info;                             //coloca a informação no novo no
      (*l).v[novo].prox = (*l).inicio;                      //o proximo do novo no, é o primeiro da lista 
      (*l).inicio = novo;                                   //o novo no passa a ser o primeiro da lista
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
        int novo;
        int aux = (*l).inicio;
        int ant = -1;
        while( aux != -1 )
        {
            ant = aux;
            aux = (*l).v[aux].prox;
        }
        novo = (*l).disponiveis;                              //pega o primeiro no disponivel
        (*l).disponiveis = (*l).v[(*l).disponiveis].prox;     //remove o no da lista de disponiveis
        (*l).v[novo].info = info;                             //coloca a informação no novo no
        (*l).v[novo].prox = -1;                               //o proximo do novo no, é -1 pois ele é o ultimo da lista
        if (ant==-1)                                          //verifica se tem anterior
            (*l).inicio = novo;                               //caso nao tenha entao o novo nó é o primeiro da lista 
        else
            (*l).v[ant].prox = novo;                          //caso tenha anterior, então o novo nó  passa a ser proximo do no anterior
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
        int novo;
        int aux = (*l).inicio;
        int ant = -1;
        while( aux != -1 && (*l).v[aux].info < info )
        {
            ant = aux;
            aux = (*l).v[aux].prox;
        }
        novo = (*l).disponiveis;                              //pega o primeiro no disponivel
        (*l).disponiveis = (*l).v[(*l).disponiveis].prox;     //remove o no da lista de disponiveis
        (*l).v[novo].info = info;                             //coloca a informação no novo no
        (*l).v[novo].prox = aux;                               //o proximo do novo no, é aux pois ele entrar entre o ant e o aux
        if (ant==-1)                                          //verifica se tem anterior
            (*l).inicio = novo;                               //caso nao tenha entao o novo nó é o primeiro da lista 
        else
            (*l).v[ant].prox = novo;                          //caso tenha anterior, então o novo nó  passa a ser proximo do no anterior   }
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
        int novo;
        int aux = (*l).inicio;
        int ant = -1;
        int i=0;
        while( aux != -1 && i < pos )
        {
            i++;
            ant = aux;
            aux = (*l).v[aux].prox;
        }
        if(pos<0 || i!=pos)
        {
            perror("Indice fora faixa quando tentava inserir um elemento em uma posicao especifica\n");
            exit(15);
        } 
        novo = (*l).disponiveis;                              //pega o primeiro no disponivel
        (*l).disponiveis = (*l).v[(*l).disponiveis].prox;     //remove o no da lista de disponiveis
        (*l).v[novo].info = info;                             //coloca a informação no novo no
        (*l).v[novo].prox = aux;                               //o proximo do novo no, é aux pois ele entrar entre o ant e o aux
        if (ant==-1)                                          //verifica se tem anterior
            (*l).inicio = novo;                               //caso nao tenha entao o novo nó é o primeiro da lista 
        else
            (*l).v[ant].prox = novo;                          //caso tenha anterior, então o novo nó  passa a ser proximo do no anterior   }
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
        int alvo;
        alvo = (*l).inicio;                             //guarda o elemento a remover
        (*l).inicio = (*l).v[(*l).inicio].prox;         //remove da lista de elementos uteis
        (*l).v[alvo].prox = (*l).disponiveis;           //insere o no removido na lista de nos disponiveis
        (*l).disponiveis = alvo;                        //o no removido passa a ser o primeiro disponivel
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
        int aux = (*l).inicio;
        int ant = -1;
        while( (*l).v[aux].prox != -1 )
        {
            ant = aux;
            aux = (*l).v[aux].prox;
        }
        if (ant==-1)                                    //se so tem um no, ele é o primeiro e o ultimo
            (*l).inicio = -1;                           //se sim, entao a lista ficará vazia
        else                                            //senao
            (*l).v[ant].prox = -1;                      //o proximo do no anterior passa a ser -1, pois ele será o ultimo
        (*l).v[aux].prox = (*l).disponiveis;            //insere o no removido na lista de nos disponiveis
        (*l).disponiveis = aux;                         //o no removido passa a ser o primeiro disponivel
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
        int aux = (*l).inicio;
        int ant = -1;
        int i = 0;
        while( i < pos && (*l).v[aux].prox != -1 )
        {
            ant = aux;
            aux = (*l).v[aux].prox;
        }

        if(pos<0 || pos!=i)
        {
            perror("Indice fora faixa quando tentava remover o elemento de uma posicao especifica\n");
            exit(14);
        }  

        if (ant==-1)                                    //se é o primeiro
            (*l).inicio = (*l).v[aux].prox;             //se sim, entao o inicio será o proximo do auxiliar
        else                                            //senao
            (*l).v[ant].prox = (*l).v[aux].prox;        //o proximo do no anterior passa a ser o proximo do auxiliar
        (*l).v[aux].prox = (*l).disponiveis;            //insere o no removido na lista de nos disponiveis
        (*l).disponiveis = aux;                         //o no removido passa a ser o primeiro disponivel
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
        int aux = (*l).inicio;
        int ant = -1;
        while(  aux != -1 &&  (*l).v[aux].info != info)
        {
            ant = aux;
            aux = (*l).v[aux].prox;
        }

        if(aux==-1)
        {
            perror("elemento nao encontrado ao remover\n");
            exit(12);
        }  

        if (ant==-1)                                    //se é o primeiro
            (*l).inicio = (*l).v[aux].prox;             //se sim, entao o inicio será o proximo do auxiliar
        else                                            //senao
            (*l).v[ant].prox = (*l).v[aux].prox;        //o proximo do no anterior passa a ser o proximo do auxiliar
        (*l).v[aux].prox = (*l).disponiveis;            //insere o no removido na lista de nos disponiveis
        (*l).disponiveis = aux;                         //o no removido passa a ser o primeiro disponivel
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
~~~

