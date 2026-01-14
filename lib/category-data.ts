import type { Category } from "@/lib/types";

interface CategoryData {
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  faqs: { question: string; answer: string }[];
}

export const categoryContent: Record<Category, CategoryData> = {
  productivity: {
    title: "Best AI Productivity Tools",
    description:
      "Boost your efficiency with the top AI productivity tools. Automate tasks, manage projects, and save time.",
    headline: "Top AI Productivity Tools",
    subheadline:
      "Supercharge your daily workflow with these cutting-edge AI assistants and automation tools.",
    faqs: [
      {
        question: "What are AI productivity tools?",
        answer:
          "AI productivity tools are apps that use artificial intelligence to help you do your work faster, smarter, or with less effort.",
      },
      {
        question: "How is AI used in productivity?",
        answer:
          "AI improves productivity by automating repetitive work, analyzing data, generating content, and assisting with decision-making in real time.",
      },
      {
        question: "Is ChatGPT a productivity tool?",
        answer:
          "Yes, ChatGPT is a productivity tool that helps with writing, coding, research, brainstorming, and task automation.",
      },
    ],
  },
  marketing: {
    title: "Best AI Marketing Tools",
    description:
      "Scale your marketing efforts with AI. Generate copy, create visuals, and analyze data with the best AI marketing software.",
    headline: "Best AI Marketing Tools",
    subheadline:
      "Transform your marketing strategy with AI-powered content creation, analytics, and automation.",
    faqs: [
      {
        question: "Is ChatGPT good at marketing?",
        answer:
          "Yes, ChatGPT is effective for marketing tasks like content creation, ad copywriting, SEO ideas, and campaign planning.",
      },
      {
        question: "How can AI be used for marketing?",
        answer:
          "AI is used in marketing for content generation, audience targeting, prediction, data analysis, personalization, analytics, chatbots, and ad optimization.",
      },
      {
        question: "Which AI tool is best for sales?",
        answer:
          "Popular AI sales tools include HubSpot AI, Salesforce Einstein, Apollo AI, and Gong for lead generation and deal insights.",
      },
    ],
  },
  llm: {
    title: "Best Large Language Models (LLMs)",
    description:
      "Explore the most powerful Large Language Models. Compare capabilities, pricing, and use cases for GPT-4, Claude, and more.",
    headline: "Top Large Language Models",
    subheadline:
      "Discover and compare the state-of-the-art language models powering the next generation of AI applications.",
    faqs: [
      {
        question: "What is an LLM?",
        answer:
          "A Large Language Model (LLM) is an AI model trained on vast amounts of text data to understand and generate human-like text.",
      },
      {
        question: "Which LLM is the best?",
        answer:
          "The 'best' LLM depends on your needs. GPT-4 is known for reasoning, Claude for safety and context window, and Llama for being open-source.",
      },
    ],
  },
  image: {
    title: "Best AI Image Generators",
    description:
      "Create stunning visuals with AI. Find the best AI art generators, photo editors, and design tools.",
    headline: "Best AI Image Generators",
    subheadline:
      "Turn text into beautiful images and art with these leading AI generation tools.",
    faqs: [
      {
        question: "Which is the best AI image generator?",
        answer:
          "They use diffusion models to interpret text prompts and gradually denoise random static into a coherent image matching your description.",
      },
      {
        question: "Can I use AI images commercially?",
        answer:
          "Most paid AI image generators allow commercial use, but you should always check the specific terms of service for each tool.",
      },
    ],
  },
  code: {
    title: "Best AI Coding Assistants",
    description:
      "Write better code faster. Discover top AI coding tools for autocompletion, debugging, and refactoring.",
    headline: "Top AI Coding Assistants",
    subheadline:
      "Accelerate your development workflow with intelligent code completion and debugging tools.",
    faqs: [
      {
        question: "Which is the best AI agent for coding?",
        answer:
          "No single AI is best at all coding tasks, but ChatGPT, Claude, and Copilot excel at code generation, debugging, and refactoring.",
      },
      {
        question: "Which AI does coding best?",
        answer:
          "GitHub Copilot and Cursor are highly rated for Python development, offering context-aware suggestions and refactoring capabilities.",
      },
      {
        question: "Which is the most powerful AI agent?",
        answer:
          "The most powerful AI agents combine reasoning, tools, and automation, such as ChatGPT, Claude, Gemini, and Auto-GPT.",
      },
    ],
  },
  video: {
    title: "Best AI Video Generators",
    description:
      "Create professional videos from text. Explore the best AI tools for video generation, editing, and avatars.",
    headline: "Best AI Video Generators",
    subheadline:
      "Create engaging videos from text or images in minutes with these powerful AI video tools.",
    faqs: [
      {
        question: "Who is the best AI video generator?",
        answer:
          "Top AI video generators include Runway, Pika, Synthesia, and OpenAI Sora, each suited for different video styles and use cases.",
      },
      {
        question: "Which AI is better for video?",
        answer:
          "The best AI for video depends on the task, with Runway and Pika for creative videos and Synthesia for professional explainer content.",
      },
      {
        question: "Which AI is free to generate video?",
        answer:
          "Some AI video tools like Pika, Runway, and CapCut offer free plans with limited features or watermarks.",
      },
      {
        question: "How can I AI a video?",
        answer:
          "You can AI-generate a video by entering a text prompt, uploading media, and letting an AI video tool create or enhance the video.",
      },
    ],
  },
  audio: {
    title: "Best AI Audio Tools",
    description:
      "Enhance your audio with AI. Find tools for voice generation, noise reduction, and transcription.",
    headline: "Top AI Audio & Voice Tools",
    subheadline:
      "Generate realistic voiceovers, clean up recordings, and transcribe audio with ease.",
    faqs: [
      {
        question: "What are the best AI audio generators?",
        answer:
          "Popular AI audio generators include ElevenLabs, PlayHT, Murf AI, and Adobe Enhance for voice and audio creation.",
      },
      {
        question: "Is there an AI that can create audio?",
        answer:
          "Yes, AI tools can generate audio such as voiceovers, music, and sound effects from text or prompts.",
      },
      {
        question: "Can ChatGPT do voice AI?",
        answer:
          "ChatGPT supports voice-based interactions and can work with AI voice models for speech generation and conversations.",
      },
      {
        question: "Which AI voice is most realistic?",
        answer:
          "ElevenLabs is widely considered one of the most realistic AI voice generators available today.",
      },
    ],
  },
  music: {
    title: "Best AI Music Generators",
    description:
      "Compose original music with AI. Discover tools for background tracks, jingles, and full songs.",
    headline: "Best AI Music Generators",
    subheadline:
      "Create royalty-free music and soundscapes for your projects using artificial intelligence.",
    faqs: [
      {
        question: "What is the best AI music generator?",
        answer:
          "Top AI music generators include Suno, Udio, AIVA, and Soundraw, known for high-quality AI-generated music.",
      },
      {
        question: "Can AI generate music for a song?",
        answer:
          "Yes, AI can generate original music for songs, including melodies, instrumentals, and full tracks.",
      },
      {
        question: "Which AI music app is free?",
        answer:
          "AI music apps like Suno, Udio, and BandLab offer free plans with limited features.",
      },
    ],
  },
  writing: {
    title: "Best AI Writing Assistants",
    description:
      "Improve your writing with AI. Find the best tools for copywriting, blogging, and creative writing.",
    headline: "Top AI Writing Assistants",
    subheadline:
      "Overcome writer's block and craft compelling content with these advanced AI writing tools.",
    faqs: [
      {
        question: "Which AI content generator is best?",
        answer:
          "Top AI content generators include ChatGPT, Jasper, Copy.ai, and Writesonic for blogs, ads, and marketing content.",
      },
      {
        question: "Can I use AI for content writing?",
        answer:
          "Yes, AI can be used for content writing such as blogs, social posts, product descriptions, and emails.",
      },
      {
        question: "What is the most advanced AI for writing content?",
        answer:
          "ChatGPT and Claude are considered among the most advanced AI tools for high-quality content writing.",
      },
    ],
  },
  research: {
    title: "Best AI Research Tools",
    description:
      "Accelerate your research. Discover AI tools for paper analysis, data extraction, and citation management.",
    headline: "Best AI Research Tools",
    subheadline:
      "Analyze documents, find sources, and synthesize information faster than ever before.",
    faqs: [
      {
        question: "Which is the best research AI?",
        answer:
          "Leading research AI tools include Perplexity, ChatGPT, Elicit, and Semantic Scholar for finding and summarizing information.",
      },
      {
        question: "Who is the most famous AI researcher?",
        answer:
          "Some of the most famous AI researchers include Geoffrey Hinton, Yann LeCun, Yoshua Bengio, and Andrew Ng.",
      },
      {
        question: "Is there an AI that does research?",
        answer:
          "Yes, research AI tools can search papers, analyze data, and summarize findings to support academic and professional research.",
      },
    ],
  },
};
