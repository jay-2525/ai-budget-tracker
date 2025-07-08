# AI Budget Tracker 💰

A modern, AI-powered personal finance management application that helps you track expenses, manage budgets, and gain insights into your spending habits. Built with React, TypeScript, and Tailwind CSS.

![AI Budget Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## ✨ Features

### 🤖 AI-Powered
- **Smart Categorization**: Automatically categorize expenses using AI
- **Spending Insights**: Get personalized financial insights and recommendations
- **Budget Suggestions**: AI-powered budget recommendations based on spending patterns
- **Dual AI Support**: Works with OpenAI API or local Ollama models

### 💳 Expense Management
- **Transaction Tracking**: Add, edit, and delete income/expense transactions
- **Category Management**: Organize transactions with customizable categories
- **Tag System**: Add tags for better organization and filtering
- **Receipt Storage**: Attach receipts to transactions (planned feature)

### 📊 Analytics & Insights
- **Beautiful Dashboard**: Overview of your financial health
- **Interactive Charts**: Visualize spending patterns with charts and graphs
- **Monthly Reports**: Detailed monthly financial reports
- **Goal Tracking**: Set and track financial goals

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes or use system preference
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Built with accessibility in mind

### 🔒 Privacy-First
- **Local Storage**: All data stored locally in your browser
- **No Cloud Dependency**: Works completely offline (except AI features)
- **Data Export/Import**: Full control over your financial data
- **Open Source**: Transparent and auditable code

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-budget-tracker.git
   cd ai-budget-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:12000`

## 🤖 AI Configuration

### Option 1: OpenAI API
1. Go to Settings → AI Configuration
2. Enable AI Features
3. Select "OpenAI" as provider
4. Enter your OpenAI API key
5. Choose your preferred model (e.g., `gpt-3.5-turbo`)

### Option 2: Local Ollama
1. Install [Ollama](https://ollama.ai/) on your machine
2. Pull a model: `ollama pull llama2`
3. Start Ollama: `ollama serve`
4. In the app, go to Settings → AI Configuration
5. Enable AI Features
6. Select "Ollama (Local)" as provider
7. Set Ollama URL (default: `http://localhost:11434`)
8. Enter model name (e.g., `llama2`)

## 📱 Usage

### Adding Transactions
1. Click the "Add Transaction" button
2. Choose transaction type (Income/Expense)
3. Enter amount and description
4. Select category or let AI suggest one
5. Add tags for better organization
6. Save the transaction

### AI Features
- **Smart Categorization**: When adding transactions, click the AI button to get category suggestions
- **Insights**: View AI-generated insights on your dashboard
- **Budget Recommendations**: Get AI suggestions for budget planning

### Data Management
- **Export Data**: Settings → Export to download your data as JSON
- **Import Data**: Settings → Import to restore from a backup
- **Clear Data**: Settings → Clear All Data (use with caution)

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout component
│   ├── Dashboard.tsx   # Dashboard with charts
│   └── TransactionForm.tsx # Transaction form
├── services/           # External services
│   └── aiService.ts    # AI integration
├── utils/              # Utility functions
│   ├── storage.ts      # Local storage management
│   ├── currency.ts     # Currency formatting
│   └── date.ts         # Date utilities
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## 🎨 Customization

### Themes
The app supports light, dark, and system themes. You can customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Categories
Add custom categories in the Settings page or modify the default categories in `src/utils/storage.ts`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kadir Gecit**
- Email: gecit.kadir@icloud.com
- GitHub: [@kadirgeciit](https://github.com/kadirgeciit)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful styling
- [Heroicons](https://heroicons.com/) - For beautiful icons
- [Recharts](https://recharts.org/) - For interactive charts
- [OpenAI](https://openai.com/) - For AI capabilities
- [Ollama](https://ollama.ai/) - For local AI models

## 🔮 Roadmap

- [ ] Receipt scanning and OCR
- [ ] Bank account integration
- [ ] Advanced analytics and forecasting
- [ ] Multi-currency support
- [ ] Collaborative budgets
- [ ] Mobile app (React Native)
- [ ] Investment tracking
- [ ] Bill reminders and notifications

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/ai-budget-tracker/issues) page
2. Create a new issue if your question isn't answered
3. Email: gecit.kadir@icloud.com

---

Made with ❤️ by [Kadir Gecit](https://github.com/kadirgeciit)