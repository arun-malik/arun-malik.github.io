// Series Data Manifest
// Add new posts by appending to the posts array of the relevant series.
// Add new series by appending to the SERIES_DATA array.
// URLs can be absolute (/posts/slug/) or relative to /series/ (/series/id/slug/).

const SERIES_DATA = [
  {
    id: "strategic-hitl",
    title: "Strategic HITL for Production AI Agents",
    description: "A 13-part series exploring why Human-in-the-Loop is a structural requirement for production AI systems, backed by 53 research papers and a hyperscale case study.",
    status: "in-progress",
    tags: ["ai-agents", "hitl", "production", "governance"],
    posts: [
      {
        slug: "00-why-not-optional",
        url: "/series/strategic-hitl/00-why-not-optional/",
        title: "Why Human-in-the-Loop is Not Optional for Production AI Agents",
        date: "2026-07-01",
        excerpt: "The six-pillar argument for why HITL is not a transitional compromise but a structural requirement of any production AI system.",
        tags: ["overview", "thesis"],
        references: [],
        published: true
      },
      {
        slug: "01-cognitive-erosion",
        url: "/series/strategic-hitl/01-cognitive-erosion/",
        title: "AI is Making Us Worse at Thinking: Here's the Research",
        date: "2026-07-08",
        excerpt: "MIT EEG studies show neural degradation after 4 months of heavy LLM use. What cognitive debt means for engineering teams.",
        tags: ["cognitive-science", "research"],
        references: ["00-why-not-optional"],
        published: false
      },
      {
        slug: "02-hidden-debt",
        url: "/series/strategic-hitl/02-hidden-debt/",
        title: "The Hidden Debt in AI-Generated Code",
        date: "2026-07-15",
        excerpt: "AI commits introduce code smells at 2-3x the human baseline rate. Analysis of 302,600 commits reveals the true cost.",
        tags: ["code-quality", "technical-debt"],
        references: ["00-why-not-optional"],
        published: false
      },
      {
        slug: "03-graduated-automation",
        url: "/series/strategic-hitl/03-graduated-automation/",
        title: "Graduated Automation: How to Scale AI Without Losing Control",
        date: "2026-07-22",
        excerpt: "Architecture patterns and decision boundaries for scaling AI autonomy progressively while preserving human oversight.",
        tags: ["architecture", "governance", "autonomy"],
        references: ["00-why-not-optional"],
        published: false
      },
      {
        slug: "04-toxic-skills",
        url: "/series/strategic-hitl/04-toxic-skills/",
        title: "Your AI Agent's Skills Might Be Malware",
        date: "2026-07-29",
        excerpt: "534 of 3,984 public agent skills are critically compromised. The supply chain risk no one is talking about.",
        tags: ["security", "supply-chain"],
        references: ["00-why-not-optional"],
        published: false
      },
      {
        slug: "05-investment-not-tax",
        url: "/series/strategic-hitl/05-investment-not-tax/",
        title: "HITL is an Investment, Not a Tax",
        date: "2026-08-05",
        excerpt: "The cost model that proves human oversight generates compounding returns rather than linear overhead.",
        tags: ["economics", "roi"],
        references: ["00-why-not-optional", "03-graduated-automation"],
        published: false
      },
      {
        slug: "06-uniform-governance-fails",
        url: "/series/strategic-hitl/06-uniform-governance-fails/",
        title: "Why Uniform AI Governance Always Fails",
        date: "2026-08-12",
        excerpt: "Gartner findings on one-size-fits-all AI policies. The case for tiered, risk-proportional governance.",
        tags: ["governance", "organizational"],
        references: ["03-graduated-automation"],
        published: false
      },
      {
        slug: "07-failure-taxonomy",
        url: "/series/strategic-hitl/07-failure-taxonomy/",
        title: "The Failure Taxonomy: 5 Ways AI Agents Fail Silently",
        date: "2026-08-19",
        excerpt: "A classification of silent failure modes in production AI agents, with detection strategies for each.",
        tags: ["reliability", "failure-modes"],
        references: ["00-why-not-optional"],
        published: false
      },
      {
        slug: "08-decision-boundaries",
        url: "/series/strategic-hitl/08-decision-boundaries/",
        title: "Designing Decision Boundaries for AI Autonomy",
        date: "2026-08-26",
        excerpt: "A practical framework using risk-reversibility quadrants to determine where human judgement should intervene.",
        tags: ["architecture", "decision-framework"],
        references: ["03-graduated-automation", "06-uniform-governance-fails"],
        published: false
      },
      {
        slug: "09-sleeper-agents",
        url: "/series/strategic-hitl/09-sleeper-agents/",
        title: "What Sleeper Agents Mean for Production AI Systems",
        date: "2026-09-02",
        excerpt: "Deceptive alignment is not theoretical. Anthropic and Apollo Research demonstrate models faking compliance during evaluation.",
        tags: ["alignment", "security", "behavioral"],
        references: ["00-why-not-optional", "04-toxic-skills"],
        published: false
      },
      {
        slug: "10-cognitive-fitness",
        url: "/series/strategic-hitl/10-cognitive-fitness/",
        title: "From Vibe Coding to Verified: The Case for Cognitive Fitness",
        date: "2026-09-09",
        excerpt: "Preserving critical thinking capacity in engineering teams as AI handles more routine work.",
        tags: ["cognitive-science", "engineering-culture"],
        references: ["01-cognitive-erosion"],
        published: false
      },
      {
        slug: "11-hyperscale-resolution",
        url: "/series/strategic-hitl/11-hyperscale-resolution/",
        title: "Autonomous Incident Resolution at Hyperscale",
        date: "2026-09-16",
        excerpt: "Companion post to arXiv:2606.09122. How multi-agent orchestration achieves 90%+ resolution rates with safety guarantees.",
        tags: ["incident-resolution", "multi-agent", "case-study"],
        references: ["03-graduated-automation", "08-decision-boundaries"],
        published: false
      },
      {
        slug: "12-road-ahead",
        url: "/series/strategic-hitl/12-road-ahead/",
        title: "The Road Ahead: What Must Change Before We Trust AI Agents",
        date: "2026-09-23",
        excerpt: "Concrete recommendations for the industry: standards, tooling, and cultural shifts needed for trustworthy AI autonomy.",
        tags: ["future", "recommendations"],
        references: ["00-why-not-optional", "05-investment-not-tax", "08-decision-boundaries"],
        published: false
      }
    ]
  },
  {
    id: "ai-amplifier",
    title: "AI as Human Amplifier vs Replacement",
    description: "Exploring AI as a tool that amplifies human capability rather than replacing it. A framework for building AI systems that make people better at their jobs.",
    status: "in-progress",
    tags: ["ai-agents", "human-augmentation", "philosophy"],
    posts: [
      {
        slug: "ai-comes-for-the-grunt-work",
        url: "/posts/ai-comes-for-the-grunt-work/",
        title: "AI Comes for the Grunt Work, Not the Judgment",
        date: "2026-07-06",
        excerpt: "The overview: AI takes the rote layer of knowledge work and pushes people up the value stack, the same way the computer reshaped the accountant. Includes the proof, the bubble question, and what the research says.",
        tags: ["overview", "future-of-work", "amplification"],
        references: [],
        published: true
      },
      {
        slug: "01-amplification-thesis",
        url: "/series/ai-amplifier/01-amplification-thesis/",
        title: "The Amplification Thesis",
        date: "2026-07-13",
        excerpt: "An 8,214-participant meta-analysis shows human+AI teams beat either humans or AI working alone.",
        tags: ["evidence", "collaboration"],
        references: ["ai-comes-for-the-grunt-work"],
        published: true
      },
      {
        slug: "02-centaur-advantage",
        url: "/series/ai-amplifier/02-centaur-advantage/",
        title: "The Centaur Advantage",
        date: "2026-07-20",
        excerpt: "From freestyle chess to modern systems: the edge comes from routing each decision to human or AI by relative strength.",
        tags: ["architecture", "routing"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      },
      {
        slug: "03-great-equalizer",
        url: "/series/ai-amplifier/03-great-equalizer/",
        title: "The Great Equalizer",
        date: "2026-07-27",
        excerpt: "AI lifts novices 30%+ toward expert-level output while barely moving the experts.",
        tags: ["skills", "novices"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      },
      {
        slug: "04-cognitive-offloading-trap",
        url: "/series/ai-amplifier/04-cognitive-offloading-trap/",
        title: "The Cognitive Offloading Trap",
        date: "2026-08-03",
        excerpt: "Without deliberate design, AI offloads thinking so thoroughly it erodes the very skills it was meant to boost.",
        tags: ["cognitive-science", "risk"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      },
      {
        slug: "05-amplification-in-code",
        url: "/series/ai-amplifier/05-amplification-in-code/",
        title: "Intelligence Amplification in Code",
        date: "2026-08-10",
        excerpt: "AI coding assistants speed the typing but shift the bottleneck to review, architecture, and coordination.",
        tags: ["engineering", "code"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      },
      {
        slug: "06-amplifying-creativity",
        url: "/series/ai-amplifier/06-amplifying-creativity/",
        title: "Amplifying Creativity",
        date: "2026-08-17",
        excerpt: "AI raises creative output while quietly reducing the diversity of ideas.",
        tags: ["creativity", "tradeoffs"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      },
      {
        slug: "07-new-skill-premium",
        url: "/series/ai-amplifier/07-new-skill-premium/",
        title: "The New Skill Premium",
        date: "2026-08-24",
        excerpt: "30 million job postings show demand shifting toward the human skills that complement AI.",
        tags: ["labor-market", "skills"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      },
      {
        slug: "08-amplification-playbook",
        url: "/series/ai-amplifier/08-amplification-playbook/",
        title: "The Amplification Playbook",
        date: "2026-08-31",
        excerpt: "Task decomposition, routing, skills, friction, and metrics: how to actually redesign jobs for amplification.",
        tags: ["playbook", "organizational"],
        references: ["ai-comes-for-the-grunt-work"],
        published: false
      }
    ]
  },
  {
    id: "progressive-crystallization",
    title: "Progressive Crystallization",
    description: "A 10-part series on converting AI agent workflows into deterministic, zero-cost automation through incremental formalization.",
    status: "research",
    tags: ["automation", "ai-agents", "optimization"],
    posts: []
  },
  {
    id: "cloud-security",
    title: "Cloud Security",
    description: "Practical strategies and architectural patterns for securing cloud infrastructure, from Zero Trust to AI-aware access control.",
    status: "in-progress",
    tags: ["security", "azure", "cloud", "zero-trust"],
    posts: [
      {
        slug: "zero-trust-azure",
        url: "/posts/zero-trust-azure/",
        title: "Zero Trust in Azure: Strategies for Securing Cloud Infrastructure",
        date: "2026-04-19",
        excerpt: "Seven practical strategies for implementing Zero Trust security in Azure, covering NSGs, Private Links, Azure Policies, AVNM, and shift-left practices.",
        tags: ["security", "azure", "zero-trust"],
        references: [],
        published: true
      }
    ]
  }
];

// Standalone posts (existing posts not in a series, but available for cross-referencing)
const STANDALONE_POSTS = [
  {
    slug: "decentralized-access-control",
    url: "/posts/decentralized-access-control/",
    title: "Decentralized Granular Access Control for Agentic AI Systems in Critical Infrastructure",
    date: "2026-06-14",
    excerpt: "A decentralized, multi-layered access control architecture for agentic AI in critical cloud infrastructure.",
    tags: ["security", "access-control", "architecture"],
    references: []
  },
  {
    slug: "hitl-six-pillar-framework",
    url: "/posts/hitl-six-pillar-framework/",
    title: "The Case for Human-in-the-Loop in Production AI Agent Systems: A Six-Pillar Framework",
    date: "2026-06-14",
    excerpt: "Drawing on 53 research papers, this paper argues that HITL is a structural requirement of any production AI system.",
    tags: ["hitl", "research", "governance"],
    references: []
  },
  {
    slug: "reactive-to-autonomous",
    url: "/posts/reactive-to-autonomous/",
    title: "From Reactive to Autonomous: Evolution of AI Operations in Cloud Network Infrastructure",
    date: "2026-06-14",
    excerpt: "A five-generation maturity model tracing the evolution from manual troubleshooting to fully autonomous incident resolution.",
    tags: ["ai-ops", "maturity-model", "incident-resolution"],
    references: []
  },
  {
    slug: "autonomous-incident-resolution",
    url: "/posts/autonomous-incident-resolution/",
    title: "Autonomous Incident Resolution at Hyperscale: An Agentic AI Architecture for Network Operations",
    date: "2026-06-12",
    excerpt: "A multi-agent orchestration framework for autonomous network incident resolution with safety guarantees.",
    tags: ["multi-agent", "incident-resolution", "architecture"],
    references: ["reactive-to-autonomous"]
  },
  {
    slug: "mcp-vs-cli",
    url: "/posts/mcp-vs-cli/",
    title: "MCP vs CLI: A Comparative Analysis of AI Agent Tooling Interfaces",
    date: "2026-06-01",
    excerpt: "CLI and MCP are not competing standards. They are complementary transport layers.",
    tags: ["tooling", "mcp", "cli", "research"],
    references: []
  }
];

// Helper: Get all posts (series + standalone) as a flat array
function getAllPosts() {
  const seriesPosts = SERIES_DATA.flatMap(series =>
    series.posts.map(post => ({ ...post, seriesId: series.id, seriesTitle: series.title }))
  );
  const standalone = STANDALONE_POSTS.map(post => ({ ...post, seriesId: null, seriesTitle: null }));
  return [...seriesPosts, ...standalone];
}

// Helper: Find a post by slug across all series and standalone posts
function findPostBySlug(slug) {
  return getAllPosts().find(p => p.slug === slug) || null;
}

// Helper: Get backlinks (posts that reference a given slug)
function getBacklinks(slug) {
  return getAllPosts().filter(p => p.references && p.references.includes(slug));
}

// Helper: Get related posts by tag overlap (excluding self)
function getRelatedByTags(slug, limit = 5) {
  const post = findPostBySlug(slug);
  if (!post || !post.tags) return [];
  const allPosts = getAllPosts().filter(p => p.slug !== slug && p.published !== false);
  return allPosts
    .map(p => ({
      ...p,
      overlap: (p.tags || []).filter(t => post.tags.includes(t)).length
    }))
    .filter(p => p.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit);
}
