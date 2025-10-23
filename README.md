# 📱 Task Manager App (React Native)

Um aplicativo de gerenciamento de tarefas desenvolvido com **React Native CLI**, **React Navigation**, **AsyncStorage** e **Context API**.  
Permite adicionar, marcar como concluída e excluir tarefas, tudo salvo localmente no dispositivo.

---

## 🚀 Funcionalidades

- ✅ Adicionar novas tarefas  
- ✅ Marcar tarefas como concluídas  
- ✅ Excluir tarefas  
- ✅ Salvamento automático no dispositivo via AsyncStorage  
- ✅ Navegação entre telas com React Navigation  
- ✅ Tema escuro moderno e responsivo

---

## 🧠 Estrutura do Projeto

```
 ├─ App.tsx
 ├─ navigation/
 │   └─ AppNavigator.tsx
 ├─ screens/
 │   ├─ HomeScreen.tsx
 │   └─ AddTaskScreen.tsx
 ├─ context/
 │   └─ TaskContext.tsx
 ├─ components/
 │   └─ TaskItem.tsx
```

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/GuilhermesNabor/Taskly.git
cd Taskly
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Instalar pacotes necessários
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-native-async-storage/async-storage
npm install react-native-screens
```

### 4️⃣ Instalar dependências nativas (iOS)
```bash
npx pod-install ios
```

### 5️⃣ Limpar cache e iniciar o projeto
```bash
npm start --reset-cache
```

### 6️⃣ Rodar no Android
```bash
npx react-native run-android
```

### 7️⃣ Rodar no iOS
```bash
npx react-native run-ios
```

---

## 🖼️ Interface

- **Tela Inicial (HomeScreen):** lista de tarefas com opção de marcar como concluída e excluir.  
- **Tela Nova Tarefa (AddTaskScreen):** campo para digitar e salvar uma nova tarefa.  
- **Design:** tema escuro com elementos modernos e responsivos.

---

## 🧰 Tecnologias Utilizadas

| Tecnologia | Descrição |
|-------------|------------|
| React Native CLI | Framework principal |
| React Navigation | Navegação entre telas |
| AsyncStorage | Armazenamento local |
| Context API | Gerenciamento de estado global |
| TypeScript | Tipagem estática |

---

## 🧼 Comandos de manutenção

| Ação | Comando |
|------|----------|
| Limpar cache | `npm start --reset-cache` |
| Reinstalar pacotes | `rm -rf node_modules && npm install` |
| Atualizar dependências | `npm update` |
| Instalar pods (iOS) | `npx pod-install ios` |

---

## Contato

- **Guilherme Nabor** - [@GuilhermesNabor](https://github.com/GuilhermesNabor)
- **Email**: guilhermenabor@outlook.com.br
