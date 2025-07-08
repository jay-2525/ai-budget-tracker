import type { AIConfig, Transaction } from '../types';

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async categorizeExpense(description: string, amount: number): Promise<{
    category: string;
    confidence: number;
    tags: string[];
  } | null> {
    if (!this.config.enabled) return null;

    try {
      if (this.config.provider === 'openai') {
        return await this.categorizeWithOpenAI(description, amount);
      } else if (this.config.provider === 'ollama') {
        return await this.categorizeWithOllama(description, amount);
      }
    } catch (error) {
      console.error('AI categorization failed:', error);
    }

    return null;
  }

  async generateInsights(transactions: Transaction[]): Promise<string[]> {
    if (!this.config.enabled || transactions.length === 0) return [];

    try {
      const prompt = this.buildInsightsPrompt(transactions);
      
      if (this.config.provider === 'openai') {
        return await this.generateInsightsWithOpenAI(prompt);
      } else if (this.config.provider === 'ollama') {
        return await this.generateInsightsWithOllama(prompt);
      }
    } catch (error) {
      console.error('AI insights generation failed:', error);
    }

    return [];
  }

  async suggestBudget(transactions: Transaction[]): Promise<{
    category: string;
    suggestedAmount: number;
    reasoning: string;
  }[] | null> {
    if (!this.config.enabled || transactions.length === 0) return null;

    try {
      const prompt = this.buildBudgetPrompt(transactions);
      
      if (this.config.provider === 'openai') {
        return await this.suggestBudgetWithOpenAI(prompt);
      } else if (this.config.provider === 'ollama') {
        return await this.suggestBudgetWithOllama(prompt);
      }
    } catch (error) {
      console.error('AI budget suggestion failed:', error);
    }

    return null;
  }

  private async categorizeWithOpenAI(description: string, amount: number) {
    if (!this.config.apiKey) throw new Error('OpenAI API key not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are a financial categorization assistant. Categorize expenses into one of these categories: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Travel, Education, Other. Also suggest relevant tags. Respond with JSON format: {"category": "category_name", "confidence": 0.95, "tags": ["tag1", "tag2"]}`
          },
          {
            role: 'user',
            content: `Categorize this expense: "${description}" - Amount: $${amount}`
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        // Fallback parsing if JSON is malformed
        return this.parseAIResponse(content);
      }
    }

    return null;
  }

  private async categorizeWithOllama(description: string, amount: number) {
    const ollamaUrl = this.config.ollamaUrl || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: `Categorize this expense into one of these categories: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Travel, Education, Other. Also suggest relevant tags.

Expense: "${description}" - Amount: $${amount}

Respond with JSON format: {"category": "category_name", "confidence": 0.95, "tags": ["tag1", "tag2"]}`,
        stream: false,
        options: {
          temperature: 0.3,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.response;
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return this.parseAIResponse(content);
      }
    }

    return null;
  }

  private async generateInsightsWithOpenAI(prompt: string): Promise<string[]> {
    if (!this.config.apiKey) throw new Error('OpenAI API key not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor. Analyze spending patterns and provide actionable insights. Return insights as a JSON array of strings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return content.split('\n').filter((line: string) => line.trim().length > 0);
      }
    }

    return [];
  }

  private async generateInsightsWithOllama(prompt: string): Promise<string[]> {
    const ollamaUrl = this.config.ollamaUrl || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: `You are a financial advisor. Analyze the following spending data and provide actionable insights. Return insights as a JSON array of strings.

${prompt}`,
        stream: false,
        options: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.response;
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return content.split('\n').filter((line: string) => line.trim().length > 0);
      }
    }

    return [];
  }

  private async suggestBudgetWithOpenAI(_prompt: string) {
    // Similar implementation to generateInsightsWithOpenAI but for budget suggestions
    // Implementation would be similar to above methods
    return null;
  }

  private async suggestBudgetWithOllama(_prompt: string) {
    // Similar implementation to generateInsightsWithOllama but for budget suggestions
    return null;
  }

  private buildInsightsPrompt(transactions: Transaction[]): string {
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return `Analyze this spending data:
Total Expenses: $${totalExpenses.toFixed(2)}
Category Breakdown: ${JSON.stringify(categoryTotals, null, 2)}
Recent Transactions: ${transactions.slice(0, 10).map(t => `${t.description}: $${t.amount} (${t.category})`).join(', ')}

Provide 3-5 actionable financial insights.`;
  }

  private buildBudgetPrompt(_transactions: Transaction[]): string {
    // Build prompt for budget suggestions based on transaction history
    return `Based on transaction history, suggest monthly budget amounts for each category.`;
  }

  private parseAIResponse(content: string): { category: string; confidence: number; tags: string[] } {
    // Fallback parser for non-JSON responses
    const lines = content.split('\n');
    let category = 'Other';
    let confidence = 0.5;
    let tags: string[] = [];

    for (const line of lines) {
      if (line.toLowerCase().includes('category')) {
        const match = line.match(/category[:\s]+([^,\n]+)/i);
        if (match) category = match[1].trim();
      }
      if (line.toLowerCase().includes('confidence')) {
        const match = line.match(/confidence[:\s]+([\d.]+)/i);
        if (match) confidence = parseFloat(match[1]);
      }
      if (line.toLowerCase().includes('tags')) {
        const match = line.match(/tags[:\s]+\[([^\]]+)\]/i);
        if (match) {
          tags = match[1].split(',').map(tag => tag.trim().replace(/"/g, ''));
        }
      }
    }

    return { category, confidence, tags };
  }
}