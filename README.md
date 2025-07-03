## 🧠 Marcus — ИИ-интервьюер на базе Ollama

Marcus — это локальное приложение на базе **React** и **Ollama**, которое имитирует процесс технического собеседования с разработчиком. Отличный инструмент для практики навыков, самооценки и тренировки перед реальными интервью.

---

## 🚀 Преимущества проекта

* ✅ **Полностью оффлайн** — всё работает на вашем компьютере, без сторонних API.
* 🧠 **Использует Ollama и мощную модель типа CodeLlama** для генерации вопросов.
* 💬 **Интерфейс чата** с отправкой сообщений по Enter или кнопке.
* 🎨 Адаптивный и современный UI с TailwindCSS и иконками от `react-icons`.
* 🔧 Удобный backend на Express.js для взаимодействия с Ollama.
* 🧩 Гибкая архитектура для дальнейшего расширения (выбор темы, уровней сложности, логирование ответов и т.д.).

---

## 📦 Установка и запуск

> Убедитесь, что у вас установлен **Node.js**, **Ollama**, и модель `codellama:13b` или `llama3`.

---

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/yourusername/marcus.git
cd marcus
```

---

### 2. Установите зависимости

#### 📁 Для frontend:

```bash
cd frontend
npm install
```

#### 📁 Для backend:

```bash
cd ../backend
npm install
```

---

### 3. Запустите Ollama

Если модель не установлена, установите её:

```bash
ollama pull codellama:13b
```

Затем запустите:

```bash
ollama run codellama:13b
```

> Или замените модель на `llama3:13b`, если предпочитаете её.

---

### 4. Запуск backend

```bash
cd backend
node index.js
```

Backend будет доступен по адресу: [http://localhost:3001](http://localhost:3001)

---

### 5. Запуск frontend

```bash
cd frontend
npm run dev
```

Frontend будет доступен по адресу: [http://localhost:5173](http://localhost:5173)

---

## 📁 Структура проекта

```
marcus/
├── backend/        # Node.js + Express сервер
│   └── index.js
├── frontend/       # React-приложение
│   ├── src/
│   ├── App.jsx
│   └── Chat.jsx, StartPage.jsx и т.д.
└── README.md
```

---

## 💡 Идеи для развития

* Добавить выбор сложности (Junior / Middle / Senior)
* Генерация технических задач и тестов
* Хранение истории сессий
* Поддержка голосового ввода и озвучивания ответа

---

## 🤝 Благодарности

* [Ollama](https://ollama.com/) — локальное выполнение LLM
* [Meta's CodeLlama](https://huggingface.co/codellama) — языковая модель для кода
* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)

---

Если хочешь, я могу адаптировать `README.md` под твой GitHub-профиль, вставить логотип проекта и примеры скриншотов.
