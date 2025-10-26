# Taskly - Task Manager App (React Native)

Um aplicativo de gerenciamento de tarefas desenvolvido com React Native, focado em uma interface limpa e funcionalidades essenciais para o dia a dia.

---

## Funcionalidades

- **Gerenciamento de Tarefas:** Adicione, edite e exclua tarefas de forma simples e rápida.
- **Status da Tarefa:** Marque tarefas como concluídas para melhor acompanhamento.
- **Anexo de Imagens:** Adicione uma foto a cada tarefa, utilizando a câmera ou a galeria do dispositivo.
- **Persistência de Dados:** As tarefas e imagens são salvas localmente no dispositivo usando AsyncStorage e o sistema de arquivos.
- **Tema Dinâmico:** Alterne entre os modos claro (light) e escuro (dark) para melhor conforto visual. A preferência de tema também é salva.

---

## Estrutura do Projeto

```
 ├─ App.tsx
 ├─ navigation/
 │   └─ AppNavigator.tsx
 ├─ screens/
 │   ├─ HomeScreen.tsx
 │   └─ AddTaskScreen.tsx
 ├─ context/
 │   ├─ TaskContext.tsx
 │   └─ ThemeContext.tsx
 ├─ components/
 │   ├─ TaskItem.tsx
 │   └─ EditTaskModal.tsx
 ├─ theme/
 │   └─ colors.ts
```

---

## Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| React Native | Framework principal para desenvolvimento multiplataforma. |
| TypeScript | Superset do JavaScript que adiciona tipagem estática. |
| React Navigation | Solução de roteamento e navegação para o app. |
| Context API | Gerenciamento de estado global para tarefas e tema. |
| AsyncStorage | Armazenamento local de dados (tarefas e preferência de tema). |
| React Native Image Picker | Biblioteca para seleção de imagens da galeria e câmera. |
| React Native FS | Biblioteca para manipulação do sistema de arquivos, usada para salvar as imagens. |

---

## Instalação e Execução

1. **Clonar o repositório**
```bash
git clone https://github.com/GuilhermesNabor/Taskly.git
cd Taskly
```

2. **Instalar dependências**
```bash
npm install
```

3. **Executar no Android**
```bash
npx react-native run-android
```

4. **Executar no iOS**
```bash
npx pod-install ios
npx react-native run-ios
```

---

## Contato

- **Guilherme Nabor** - [@GuilhermesNabor](https://github.com/GuilhermesNabor)
- **Email**: guilhermenabor@outlook.com.br
