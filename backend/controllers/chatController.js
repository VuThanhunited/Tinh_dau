// chatController.js - Xử lý chatbot AI với Gemini API sử dụng module https thuần
import https from 'https';

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn bán hàng cho cửa hàng tinh dầu thiên nhiên "Essential Oil - Pure & Natural".

Thông tin về cửa hàng:
- Chuyên bán tinh dầu thiên nhiên: tinh dầu đơn, tinh dầu blend, tinh dầu cho sức khỏe, tinh dầu làm đẹp
- Sản phẩm: máy khuếch tán, hộp quà tặng, tinh dầu xông phòng
- Hotline: 0988.888.888
- Phục vụ khách hàng tại Việt Nam

Nhiệm vụ của bạn:
- Tư vấn sản phẩm tinh dầu phù hợp với nhu cầu của khách
- Giải thích công dụng, cách dùng tinh dầu
- Hỗ trợ thông tin đơn hàng, giao hàng
- Trả lời ngắn gọn, thân thiện, bằng tiếng Việt
- Khi không biết thông tin cụ thể, hướng khách gọi hotline 0988.888.888

Hãy luôn nhiệt tình, chuyên nghiệp và thân thiện!`;

// Zero-dependency HTTPS post request helper for compatibility with older Node versions on Render
const httpsRequest = (url, body) => {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => {
              try {
                return JSON.parse(data);
              } catch (e) {
                return { error: 'Failed to parse JSON response', raw: data };
              }
            }
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(JSON.stringify(body));
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

export const sendChatMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập tin nhắn' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình Gemini API key trên server (Render/env)' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Build conversation history for Gemini
    const contents = [];
    
    // Add chat history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const requestBody = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      }
    };

    const response = await httpsRequest(apiUrl, requestBody);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(500).json({ error: errorData?.error?.message || 'Lỗi kết nối AI, vui lòng thử lại' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'Không nhận được phản hồi từ AI' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Lỗi server, vui lòng thử lại sau' });
  }
};
