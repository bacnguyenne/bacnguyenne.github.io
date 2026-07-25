// Single source of truth for the portfolio (projects, experience, achievements,
// education, skills). Edit here to update the Projects and About pages.

export interface Project {
	title: string;
	blurb: string;
	tech: string[];
	result?: string;
	context?: string;
	year: string;
	repo?: string;
	demo?: string;
	tags: string[];
	featured?: boolean;
}

export const PROJECTS: Project[] = [
	{
		title: 'agentcheck',
		blurb:
			'A static-analysis linter & security scanner for AI coding-agent configuration (Claude Code & MCP) — 58 rules, safe --fix, JSON output, an MCP server, and a 198-item catalog of vetted Skills, MCP servers, and Tools you can install with one command. The validator runs entirely in your browser.',
		tech: ['TypeScript', 'Next.js', 'Node.js', 'MCP', 'Vitest'],
		result: 'CLI + core published on npm · live in-browser validator',
		year: '2026',
		repo: 'https://github.com/bacnguyenne/agentcheck',
		demo: '/agentcheck/',
		tags: ['developer-tools', 'security', 'open-source'],
		featured: true,
	},
	{
		title: 'KX-Solution',
		blurb:
			'A domain-agnostic agentic AI platform — multi-agent orchestration that adapts across domains. Built at AutoNxt AI for Kaizenics, with a software-defined-vehicle application running virtual cars on RemotiveLabs ECUs with Android Automotive and CARLA.',
		tech: ['Python', 'Multi-agent', 'RemotiveLabs', 'Android Automotive', 'CARLA', 'Neo4j', 'Docker'],
		context: 'AutoNxt AI · Kaizenics',
		year: '2026',
		tags: ['agents', 'platform', 'sdv'],
		featured: true,
	},
	{
		title: 'Baby Safety Reminder',
		blurb:
			'A child-presence safety reminder that helps prevent children from being left unattended in a vehicle — built at AutoNxt AI with digital.auto.',
		tech: ['digital.auto', 'VSS', 'Python', 'Computer Vision'],
		context: 'AutoNxt AI · digital.auto',
		year: '2026',
		tags: ['safety', 'computer-vision', 'sdv'],
		featured: true,
	},
	{
		title: 'Code-Switching Automatic Speech Recognition (Malay–English)',
		blurb:
			'A hybrid Whisper-encoder + LLaMA-decoder ASR system for Malay–English code-switching, trained with Noisy Student Training and teacher–student pseudo-labeling for low-resource robustness.',
		tech: ['PyTorch', 'Whisper', 'LLaMA', 'Hugging Face'],
		result: 'Reduced WER from 34% → 28% on the CS-ASR benchmark',
		year: '2025',
		repo: 'https://github.com/bacnguyenne/Code-Switching-Automatic-Speech-Recognition',
		tags: ['ASR', 'NLP', 'research'],
		featured: true,
	},
	{
		title: 'Multi-Agent E-commerce Assistant',
		blurb:
			'A modular multi-agent system automating customer support, product recommendation, and dynamic pricing — RAG-based reasoning and memory over a streaming backend with a TypeScript front-end.',
		tech: ['LangChain', 'AutoGen', 'FastAPI', 'Kafka', 'Qdrant', 'TypeScript'],
		result: 'End-to-end prototype: ingestion → embeddings → agents → API → UI',
		year: '2025',
		repo: 'https://github.com/bacnguyenne/Multi-Agent-for-Ecomerce',
		tags: ['agents', 'rag', 'full-stack'],
	},
	{
		title: 'CIViT — Deepfake Detection',
		blurb:
			'A hybrid CNN + InceptionNeXt + Vision Transformer pipeline for video deepfake detection, trained across Celeb-DF (V2), DFD, DeepfakeTIMIT and WildDeepfake with strong augmentation.',
		tech: ['PyTorch', 'Vision Transformer', 'InceptionNeXt', 'OpenCV'],
		result: '91% accuracy on CelebDF-V2, 94% on DFD',
		context: 'Research @ CIS Lab, National Chung Cheng University (Taiwan)',
		year: '2024',
		repo: 'https://github.com/bacnguyenne/CIViT-Deepfake-detection',
		tags: ['computer-vision', 'research'],
	},
	{
		title: 'Fashion Image Captioning (BEiT + GPT-2)',
		blurb:
			'A Transformer encoder–decoder that generates fashion product descriptions, using BEiT for visual features and GPT-2 for generation, evaluated on the FACAD dataset.',
		tech: ['PyTorch', 'BEiT', 'GPT-2', 'Hugging Face'],
		result: 'ROUGE-L 67.5 / BLEU-1 65.4 — beats ViT & DeiT baselines',
		year: '2024',
		repo: 'https://github.com/bacnguyenne/Caption-Generation-For-Fashion-Images',
		tags: ['computer-vision', 'NLP'],
	},
	{
		title: 'RAG for Financial Information',
		blurb:
			'A retrieval-augmented generation pipeline for question-answering over financial documents.',
		tech: ['LangChain', 'Vector DB', 'Python'],
		year: '2024',
		repo: 'https://github.com/bacnguyenne/RAGs-for-Financial-Information',
		tags: ['rag', 'NLP'],
	},
	{
		title: 'Vietnamese Sentiment Classification',
		blurb:
			'Vietnamese sentiment classification experiments comparing different word-embedding approaches.',
		tech: ['Python', 'scikit-learn', 'NLP'],
		year: '2023',
		repo: 'https://github.com/bacnguyenne/vietnamese-sentiment-classification',
		tags: ['NLP', 'machine-learning'],
	},
	{
		title: 'GraphFrames on Spark',
		blurb: 'Large-scale graph analytics with GraphFrames on Apache Spark.',
		tech: ['Apache Spark', 'GraphFrames'],
		year: '2023',
		repo: 'https://github.com/bacnguyenne/Graphframes-on-spark',
		tags: ['big-data'],
	},
];

export interface Experience {
	role: string;
	org: string;
	location: string;
	period: string;
	points: string[];
}

export const EXPERIENCE: Experience[] = [
	{
		role: 'AI Engineer',
		org: 'AutoNxt AI',
		location: 'Ho Chi Minh City, Vietnam',
		period: 'Nov 2025 – Present',
		points: [
			'Work on software-defined vehicles (SDV): production computer-vision / AI pipelines, edge AI on automotive hardware, and virtual ECU / vehicle simulation.',
			'Project Kaizenics — built KX-Solution, a domain-agnostic agentic AI platform (multi-agent orchestration), with an SDV application: virtual cars on RemotiveLabs ECUs with Android Automotive and CARLA.',
			'Built Baby Safety Reminder, a separate child-presence safety system, with digital.auto.',
		],
	},
	{
		role: 'AI Engineer Intern',
		org: 'Bluebolt Software',
		location: 'Ho Chi Minh City, Vietnam',
		period: 'Mar 2025 – Jun 2025',
		points: [
			'Built a smart HR assistant (recruitment, payroll, employee services) using LangChain + the OpenAI API.',
			'Implemented tool-using agents with memory, retrieval, and a vector database over internal systems.',
		],
	},
	{
		role: 'AI Research Intern',
		org: 'CIS Lab — National Chung Cheng University',
		location: 'Chiayi, Taiwan',
		period: 'Jun 2024 – Oct 2024',
		points: [
			'Researched video deepfake detection with Transformer models.',
			'Authored a research report and presented at the International Student Research Symposium at CCU.',
		],
	},
];

export interface Achievement {
	title: string;
	detail?: string;
	year: string;
}

export const ACHIEVEMENTS: Achievement[] = [
	{ title: 'Top 5 — VLSP 2025 ASR/SER Challenge', year: '2025' },
	{ title: 'Young Scientists Conference — 4 submissions', detail: 'Accepted/presented research', year: '2022–2024' },
	{ title: 'Eureka Consolation Prize (School Level)', year: '2022' },
	{ title: 'TOEIC Certificate', year: '2024' },
	{ title: 'Member & Mentor — AI Lab, IUH', year: '2021–present' },
	{ title: 'UIT Challenge · Vietnam Datathon', detail: 'Competition participant', year: '2023–2024' },
];

export const EDUCATION = {
	school: 'Industrial University of Ho Chi Minh City (IUH)',
	degree: 'B.Eng., Data Science',
	period: 'Sep 2021 – Jun 2025',
	detail: 'GPA 3.48/4.0 (Good) · Coursework: Deep Learning, NLP, Computer Vision',
};

export const SKILLS: { group: string; items: string[] }[] = [
	{ group: 'Embedded / SDV', items: ['TensorRT', 'ONNX', 'KUKSA (VSS)', 'CAN / SOME-IP', 'RemotiveLabs', 'AAOS', 'CARLA'] },
	{ group: 'AI / ML', items: ['Multi-agent (LangChain, AutoGen)', 'RAG', 'Computer Vision', 'NLP', 'ASR', 'PyTorch', 'TensorFlow', 'Hugging Face', 'OpenCV'] },
	{ group: 'Languages', items: ['Python', 'C/C++', 'TypeScript'] },
	{ group: 'Backend & Tools', items: ['FastAPI', 'Kafka', 'Docker', 'Git'] },
	{ group: 'Databases', items: ['PostgreSQL', 'Neo4j', 'MongoDB', 'Qdrant', 'Weaviate', 'MySQL'] },
	{ group: 'LLM serving', items: ['vLLM', 'Ollama', 'llama.cpp'] },
];
