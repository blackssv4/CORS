require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// مسار للتحقق من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('Proxy Server is running!');
});

// مسار API للدردشة
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body;
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: language === 'ar' 
              ? "أنت مساعد يتحدث العربية بطلاقة" 
              : "You are an English-speaking assistant"
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
