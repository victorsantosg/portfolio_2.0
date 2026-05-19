---
trigger: glob
globs: **/*.{dart,js,jsx,ts,tsx,py,json,md}
---

# Blueprint de Escopo de Nova Tarefa (Modo Econômico)

Toda vez que uma nova funcionalidade (feature) ou refatoração pesada for iniciada, você deve estruturar o plano de ataque seguindo este modelo, gerando um output de no máximo 200 palavras.

## 1. Mapeamento Cirúrgico de Arquivos
Antes de pedir para ler qualquer código, liste apenas os arquivos estritamente necessários para a tarefa.
* **Arquivos de Entrada (Leitura):** Apenas onde a lógica será consultada.
* **Arquivos de Saída (Escrita):** Onde o código novo será injetado.

## 2. Declaração de Dependências
Identifique se a tarefa exige pacotes novos ou alterações em arquivos de configuração global (como `pubspec.yaml`, `package.json`, `next.config.js`). Se não exigir, declare: "Nenhuma dependência externa será afetada".

## 3. Protocolo de Substituição Mínima
Você se compromete a gerar alterações apenas nos métodos mapeados acima, utilizando a técnica de placeholders (`// ... código anterior`) para blindar o restante do arquivo contra reescritas desnecessárias que queimam tokens.