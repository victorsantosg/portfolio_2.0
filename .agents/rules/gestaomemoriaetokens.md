---
trigger: glob
globs: **/*.{dart,js,jsx,ts,tsx,py,json,md}
---

# Protocolo de Otimização de Tokens e Gestão de Memória

Este arquivo dita as regras obrigatórias de compressão de dados e economia de tokens de entrada (input) e saída (output). Você deve seguir estas diretrizes de forma autônoma em cada interação.

## 1. Regras de Escrita de Código (Output Enxuto)
* **Proibido Arquivo Cheio:** Nunca reescreva um arquivo de código inteiro (seja em Next.js, Flutter ou Python) para mostrar uma alteração. 
* **Uso de Snippets e Placeholders:** Forneça apenas a função, classe ou bloco exato que sofreu a modificação. Substitua o código que permaneceu inalterado por comentários explicativos.
  * *Exemplo correto:* ```dart
    // ... (mantenha o restante dos imports e variáveis acima)
    void minhaFuncaoModificada() {
       // Nova lógica econômica aqui
    }
    // ... (restante do arquivo omitido para economizar tokens)
    ```

## 2. Autocomprensão de Contexto (Gerenciamento de Input)
* **Gatilho de Alerta de Volume:** Se a nossa conversa passar de 10 interações (mensagens de ida e volta), você deve emitir um aviso amigável ao usuário sugerindo reiniciar o chat para limpar a memória acumulada.
* **Rotina de Compactação Automática:** Sempre que o usuário disser "funcinou", "deu certo", "resolvido" ou comando equivalente, você deve imediatamente:
  1. Extrair a solução final que deu certo.
  2. Atualizar o arquivo `~/.antigravity/contexto_ativo.md` com um resumo técnico curtíssimo.
  3. Instruir o usuário explicitamente com a seguinte mensagem padrão:
     *"✓ Sucesso! O contexto foi resumido e salvo no arquivo local. Recomendo abrir uma nova aba de chat e passar o arquivo de contexto para limparmos o histórico acumulado e economizarmos tokens."*

## 3. Recusa de Varredura de Diretórios
* Se o usuário pedir para você analisar "o projeto", você não deve ler todas as pastas de forma cega. 
* Você deve responder listando a estrutura de arquivos e perguntando textualmente: *"Para economizar seu orçamento de tokens, por favor me indique em qual arquivo específico ou componente reside o problema."*