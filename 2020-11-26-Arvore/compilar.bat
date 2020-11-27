gcc -c Fila.c -o fila.obj
gcc -c Pilha.c -o pilha.obj
gcc -c Arvore.c -o arvore.obj -DDEBUG

gcc fila.obj pilha.obj arvore.obj -o arvore.exe
