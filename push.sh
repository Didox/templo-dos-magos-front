#!/bin/bash

# Verifica se foi passado um parâmetro
if [ -z "$1" ]; then
    echo "Digite a mensagem do commit:"
    read mensagem
else
    mensagem="$1"
fi

# Executa os comandos git
git add .
git commit -am "$mensagem"
git push
git status
