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
          "AI productivity tools use artificial intelligence to help you work faster and smarter. They can automate repetitive tasks, summarize documents, schedule meetings, and more.",
      },
      {
        question: "How can AI help with time management?",
        answer:
          "AI tools can analyze your schedule, prioritize tasks, and even block out focus time automatically, helping you make the most of your day.",
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
        question: "Can AI replace human marketers?",
        answer:
          "AI is a powerful assistant that can handle data analysis and content generation, but human creativity and strategy are still essential for successful marketing.",
      },
      {
        question: "What is the best AI for copywriting?",
        answer:
          "Tools like Jasper and Copy.ai are popular for generating marketing copy, while ChatGPT and Claude are excellent for brainstorming and drafting.",
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
        question: "How do AI image generators work?",
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
        question: "Is AI code secure?",
        answer:
          "AI coding assistants are generally safe, but you should review generated code for security vulnerabilities and avoid pasting sensitive keys or secrets into them.",
      },
      {
        question: "What is the best AI for Python?",
        answer:
          "GitHub Copilot and Cursor are highly rated for Python development, offering context-aware suggestions and refactoring capabilities.",
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
        question: "Can AI generate realistic videos?",
        answer:
          "Yes, tools like Sora, Runway, and Pika are rapidly advancing and can generate increasingly realistic video clips from text prompts.",
      },
      {
        question: "How long does it take to generate an AI video?",
        answer:
          "Generation time varies by tool and complexity, but most short clips can be generated in a few minutes.",
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
        question: "What is AI voice cloning?",
        answer:
          "AI voice cloning analyzes a sample of a person's voice to create a synthetic version that can speak any text in that person's tone.",
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
        question: "Is AI music copyright free?",
        answer:
          "It depends on the platform. Many AI music generators offer royalty-free licenses for generated tracks, but always verify the terms.",
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
        question: "Can AI write a whole book?",
        answer:
          "AI can assist significantly with plotting, character development, and drafting chapters, but writing a cohesive book usually requires human guidance and editing.",
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
        question: "Can AI summarize research papers?",
        answer:
          "Yes, tools like Consensus and Elicit are designed specifically to find and summarize academic papers and answer research questions.",
      },
    ],
  },
};
