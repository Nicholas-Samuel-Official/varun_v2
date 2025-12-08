const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client with Emergent LLM key
// Note: Emergent key requires special proxy URL
const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY || 'sk-emergent-e38419c1261D13b510',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.emergent.sh/v1',
});

const SYSTEM_PROMPT = `You are Varun AI Assistant, a helpful expert in rainwater harvesting and water conservation. You help users with:
- Understanding rainwater harvesting systems
- Feasibility calculations and recommendations
- Installation guidance and best practices
- Water conservation tips
- IoT sensor data interpretation
- Cost estimation and ROI analysis

Keep your responses concise, friendly, and actionable. Use simple language and provide practical advice.`;

// Fallback responses for when API fails
const FALLBACK_RESPONSES = {
  greeting: "Hello! I'm Varun AI Assistant. I can help you with rainwater harvesting, feasibility checks, and water conservation. What would you like to know?",
  feasibility: "To check feasibility, you need to consider: 1) Your roof area (larger is better), 2) Annual rainfall in your area (more rain = more harvest), 3) Soil type (sandy/loamy is best for recharge), and 4) Your location. Use our Feasibility Check tool on the dashboard for detailed calculations!",
  cost: "Rainwater harvesting costs vary based on system size. On average: Small home setup (2000L tank): ₹30,000-50,000, Medium setup (5000L): ₹80,000-1,20,000. Includes tank, filtration, pipes, and installation. ROI typically 3-5 years through water bill savings!",
  installation: "Installation steps: 1) Install gutters and downpipes on roof, 2) Add first-flush diverter to remove initial dirty water, 3) Install storage tank (underground or overhead), 4) Add filter system, 5) Connect distribution pipes. Hire certified professionals for best results!",
  benefits: "Benefits of rainwater harvesting: 1) Reduces water bills, 2) Provides backup during water shortages, 3) Reduces groundwater depletion, 4) Decreases stormwater runoff, 5) Improves soil moisture, 6) Eco-friendly and sustainable. It's a smart long-term investment!",
  sensors: "IoT sensors monitor your rainwater system in real-time: Rain sensors detect rainfall, Level sensors track tank water levels, Quality sensors check water purity, Flow meters measure usage. Check the IoT Sensors page in the app for live data!",
  default: "That's a great question! For detailed information about rainwater harvesting, I recommend: 1) Use our Feasibility Check tool, 2) Book an appointment with our experts, 3) Check the IoT sensors for real-time data. I'm here to help guide you through the process!"
};

function getKeywordResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.match(/hello|hi|hey|greet/)) {
    return FALLBACK_RESPONSES.greeting;
  }
  if (msg.match(/feasib|possible|viable|check|suitable/)) {
    return FALLBACK_RESPONSES.feasibility;
  }
  if (msg.match(/cost|price|expensive|money|rupee|₹|budget/)) {
    return FALLBACK_RESPONSES.cost;
  }
  if (msg.match(/install|setup|build|construct|implement/)) {
    return FALLBACK_RESPONSES.installation;
  }
  if (msg.match(/benefit|advantage|why|good|help|save/)) {
    return FALLBACK_RESPONSES.benefits;
  }
  if (msg.match(/sensor|iot|monitor|data|reading/)) {
    return FALLBACK_RESPONSES.sensors;
  }
  
  return FALLBACK_RESPONSES.default;
}

// @desc    Chat with AI assistant
// @route   POST /api/chatbot
// @access  Public
const chat = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Try OpenAI API first
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-6),
        { role: 'user', content: message },
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0]?.message?.content;

      if (aiResponse) {
        return res.status(200).json({
          success: true,
          response: aiResponse,
          source: 'ai',
        });
      }
    } catch (apiError) {
      logger.error(`OpenAI API error: ${apiError.message}`);
      // Fall through to keyword-based response
    }

    // Fallback to keyword-based responses
    const fallbackResponse = getKeywordResponse(message);
    
    res.status(200).json({
      success: true,
      response: fallbackResponse,
      source: 'fallback',
    });
  } catch (error) {
    logger.error(`Chatbot error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  chat,
};
