# 📋 Registro de Trabalhos

Aplicativo mobile desenvolvido em **React Native com Expo** para gerenciamento de trabalhos acadêmicos, atividades e alunos.

---

## 🛠️ Tecnologias

- React Native + Expo
- expo-sqlite (banco de dados local)
- @react-navigation/native + @react-navigation/stack (navegação)
- @react-native-picker/picker (seletores)
- victory-native + react-native-svg (gráficos)

---

## 📱 Telas e Funcionalidades

### 🏠 Home
Tela inicial com navegação para as três seções principais: Alunos, Trabalhos e Atividades.

---

### 👤 Alunos (`AlunosScreen`)
Lista todos os alunos cadastrados ordenados por ID.

- Exibe: ID, Nome, RA
- Botão **✏️ editar**: abre o formulário preenchido para edição
- Botão **🗑️ deletar**: confirmação antes de excluir
- Botão **Adicionar**: abre o formulário de cadastro

### Cadastro/Edição de Aluno (`AlunosAddScreen`)
Formulário com os campos Nome e RA.

- RA aceita apenas números (máximo 9 dígitos)
- A tela detecta automaticamente se está em modo cadastro ou edição com base nos parâmetros de navegação
- Validação: ambos os campos são obrigatórios

---


### 📁 Trabalhos (`TrabalhosScreen`)
Lista todos os trabalhos cadastrados com scroll horizontal por ter muitas colunas.

- Exibe: ID, Nome, Descrição, Data de Entrega, Situação, total de Horas Previstas e Horas Concluídas (somadas de todas as atividades vinculadas)
- Botão **📊 monitoramento**: abre a tela de visualização detalhada do trabalho
- Botão **✏️ editar**: abre o formulário de edição
- Botão **🗑️ deletar**: confirmação antes de excluir
- Botão **Adicionar**: abre o formulário de cadastro

### Cadastro/Edição de Trabalho (`TrabalhosAddScreen`)
Formulário com os campos Nome, Descrição, Data de Entrega e Situação.

- Situação selecionada via picker (Pendente / Concluído / Cancelado)
- No modo edição, exibe uma seção de **alunos vinculados** ao trabalho
- Botão **Adicionar Aluno**: abre um modal com picker listando apenas alunos ainda não vinculados
- Botão **🗑️** na linha do aluno: remove o vínculo com confirmação

---

### 📊 Monitoramento do Trabalho (`TrabalhoViewScreen`)
Tela de visualização detalhada de um trabalho específico.

- Cabeçalho com nome, situação e data de entrega do trabalho
- **Tabela de alunos** vinculados ao trabalho
- **Tabela de atividades** vinculadas ao trabalho com scroll horizontal
  - Botão **👥**: abre modal com alunos vinculados àquela atividade
  - Botão **✏️**: abre a tela de edição da atividade
  - Botão **🗑️**: deleta a atividade com confirmação
- **Gráfico de pizza - Horas Previstas por Atividade**: mostra a proporção de horas previstas de cada atividade no total
- **Gráfico de pizza - Progresso Geral de Horas**: mostra a proporção de horas concluídas (verde) vs horas restantes (cinza) do trabalho inteiro, com percentual em cada fatia

---

### ⚙️ Atividades (`AtividadesScreen`)
Lista todas as atividades cadastradas com scroll horizontal.

- Exibe: ID, Trabalho vinculado, Nome, Descrição, Horas Previstas, Horas Concluídas, Situação
- Botão **✏️ editar**: abre o formulário de edição
- Botão **🗑️ deletar**: confirmação antes de excluir
- Botão **Adicionar**: abre o formulário de cadastro

### Cadastro/Edição de Atividade (`AtividadesAddScreen`)
Formulário com os campos Trabalho, Nome, Descrição, Horas Previstas, Horas Concluídas e Situação.

- Trabalho selecionado via picker com ID e nome
- Situação selecionada via picker (Pendente / Concluído / Cancelado)
- **Regra:** horas concluídas não podem ser maiores que horas previstas
- **Regra:** ao igualar horas concluídas às previstas, a situação muda automaticamente para "Concluído" (ainda editável)
- No modo edição, exibe seção de **alunos vinculados** à atividade
  - Apenas alunos já vinculados ao **trabalho pai** da atividade aparecem disponíveis para seleção
  - Botão **Adicionar Aluno**: abre modal com picker
  - Botão **🗑️** na linha do aluno: remove o vínculo com confirmação

---

## 📁 Estrutura do Banco de Dados

### tbAluno
| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER PK | Identificador único |
| ra | TEXT UNIQUE | Registro acadêmico |
| nome | TEXT | Nome do aluno |

### tbTrabalho
| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER PK | Identificador único |
| nome | TEXT | Nome do trabalho |
| descricao | TEXT | Descrição |
| data_entrega | DATE | Data de entrega (AAAA-MM-DD) |
| situacao | TEXT | Pendente / Concluído / Cancelado |

### tbAtividade
| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER PK | Identificador único |
| idTrabalho | INTEGER FK | Trabalho ao qual pertence |
| nome | TEXT | Nome da atividade |
| descricao | TEXT | Descrição |
| horas_previstas | REAL | Horas estimadas |
| horas_concluidas | REAL | Horas realizadas |
| situacao | TEXT | Pendente / Concluído / Cancelado |

### tbTrabalhoAluno
| Campo | Tipo | Descrição |
|---|---|---|
| idTrabalho | INTEGER FK | Referência ao trabalho |
| idAluno | INTEGER FK | Referência ao aluno |

### tbAtividadeAluno
| Campo | Tipo | Descrição |
|---|---|---|
| idAtividade | INTEGER FK | Referência à atividade |
| idAluno | INTEGER FK | Referência ao aluno |

---

## 🚀 Como Executar
```bash
# instalar dependências
npm install

# iniciar o projeto
npx expo start
```

Escaneie o QR code com o aplicativo **Expo Go** (Android/iOS) ou rode em um emulador.

---

## ⚠️ Observações

- O banco de dados é local (SQLite) e fica armazenado no dispositivo
- Em caso de mudança na estrutura do banco durante o desenvolvimento, é necessário desinstalar o app ou limpar os dados do Expo Go para recriar as tabelas
- A vinculação de alunos a atividades e trabalhos só está disponível no modo **edição** (após o cadastro inicial)
