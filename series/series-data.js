// Series Data Manifest
// Add new posts by appending to the posts array of the relevant series.
// Add new series by appending to the SERIES_DATA array.
// URLs can be absolute (/posts/slug/) or relative to /series/ (/series/id/slug/).

const SERIES_DATA = [
  {
    id: "strategic-hitl",
    title: "Strategic HITL for Production AI Agents",
    description: "A complete 13-part series on human oversight for AI agents, combining public research with hypothetical engineering designs and explicit limits on the evidence.",
    status: "complete",
    tags: ["ai-agents", "hitl", "production", "governance"],
    // These dates are evenly spaced from July 1 to September 26, 2026.
    // They are editorial series dates, not original publication dates.
    // Preserve publication provenance in article metadata and feed.xml.
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
        title: "AI and critical thinking: What the research actually shows",
        date: "2026-07-08",
        excerpt: "What an EEG experiment, a knowledge-worker survey, and a perspective paper tell us about AI, critical thinking, and meaningful human oversight.",
        tags: ["Series", "cognitive-science", "research"],
        references: ["00-why-not-optional"],
        published: true
      },
      {
        slug: "02-hidden-debt",
        url: "/series/strategic-hitl/02-hidden-debt/",
        title: "The Hidden Debt in AI-Generated Code",
        date: "2026-07-16",
        excerpt: "What public studies reveal about persistent code-quality issues, the limits of AI-versus-human comparisons, and reviewing architectural change.",
        tags: ["Series", "code-quality", "technical-debt"],
        references: ["00-why-not-optional"],
        published: true
      },
      {
        slug: "03-graduated-automation",
        url: "/series/strategic-hitl/03-graduated-automation/",
        title: "Graduated Automation: How to Scale AI Without Losing Control",
        date: "2026-07-23",
        excerpt: "How a procedure earns permission to act: scoped approvals, independent checks, and withdrawing autonomy when conditions change.",
        tags: ["Series", "architecture", "governance", "autonomy"],
        references: ["00-why-not-optional"],
        published: true
      },
      {
        slug: "04-toxic-skills",
        url: "/series/strategic-hitl/04-toxic-skills/",
        title: "Your AI Agent's Skills Might Be Malware",
        date: "2026-07-30",
        excerpt: "What the ToxicSkills audit found, what its numbers do not prove, and how to limit the damage from a compromised agent skill.",
        tags: ["Series", "security", "supply-chain"],
        references: ["00-why-not-optional"],
        published: true
      },
      {
        slug: "05-investment-not-tax",
        url: "/series/strategic-hitl/05-investment-not-tax/",
        title: "When Human Oversight Pays for Itself",
        date: "2026-08-06",
        excerpt: "A practical cost model for human review, with a hypothetical payback calculation, sensitivity checks, and cases where oversight does not break even.",
        tags: ["Series", "economics", "roi", "governance"],
        references: ["00-why-not-optional", "03-graduated-automation"],
        published: true
      },
      {
        slug: "06-uniform-governance-fails",
        url: "/series/strategic-hitl/06-uniform-governance-fails/",
        title: "AI Governance Needs Shared Rules and Different Controls",
        date: "2026-08-14",
        excerpt: "How to keep shared AI governance rules while tailoring controls to each use, with explicit ownership, testable evidence, and reassessment when permissions change.",
        tags: ["Series", "governance", "organizational"],
        references: ["03-graduated-automation"],
        published: true
      },
      {
        slug: "07-failure-taxonomy",
        url: "/series/strategic-hitl/07-failure-taxonomy/",
        title: "Five Ways to Question an AI Agent's Success",
        date: "2026-08-21",
        excerpt: "A proposed review framework for checking an agent's diagnosis, scope, lasting outcome, downstream effects, and context freshness beyond a successful tool call.",
        tags: ["Series", "reliability", "failure-modes"],
        references: ["00-why-not-optional"],
        published: true
      },
      {
        slug: "08-decision-boundaries",
        url: "/series/strategic-hitl/08-decision-boundaries/",
        title: "Designing Decision Boundaries for AI Autonomy",
        date: "2026-08-28",
        excerpt: "How to turn autonomy policy into testable action conditions, using a hypothetical booking service to examine consent, reversibility, retries, and the cost of delay.",
        tags: ["Series", "architecture", "decision-framework"],
        references: ["03-graduated-automation", "06-uniform-governance-fails"],
        published: true
      },
      {
        slug: "09-sleeper-agents",
        url: "/series/strategic-hitl/09-sleeper-agents/",
        title: "What sleeper agents mean for production AI systems",
        date: "2026-09-04",
        excerpt: "Sleeper-agent experiments show why cleaner evaluations do not prove harmful behaviour is gone, and why production checks need independent evidence.",
        tags: ["AI Agents", "HITL", "Security", "Series"],
        references: ["00-why-not-optional", "04-toxic-skills"],
        published: true
      },
      {
        slug: "10-cognitive-fitness",
        url: "/series/strategic-hitl/10-cognitive-fitness/",
        title: "From vibe coding to verified: Practising independent diagnosis",
        date: "2026-09-12",
        excerpt: "A proposal for practising independent diagnosis in AI-assisted engineering, with synthetic exercises and tests of whether the learning transfers.",
        tags: ["AI Agents", "HITL", "Engineering", "Series"],
        references: ["01-cognitive-erosion"],
        published: true
      },
      {
        slug: "11-hyperscale-resolution",
        url: "/series/strategic-hitl/11-hyperscale-resolution/",
        title: "Incident resolution with AI: A hypothetical reference design",
        date: "2026-09-19",
        excerpt: "A fictional incident workflow follows an AI-assisted rollback from alert to verified recovery, with explicit authority, handoff, and failure constraints.",
        tags: ["AI Agents", "HITL", "Operations", "Series"],
        references: ["03-graduated-automation", "08-decision-boundaries"],
        published: true
      },
      {
        slug: "12-road-ahead",
        url: "/series/strategic-hitl/12-road-ahead/",
        title: "The road ahead: What evidence would justify more autonomy?",
        date: "2026-09-26",
        excerpt: "Before removing an approval step, ask what evidence would justify the change, what the trial cannot show, and what would reverse the decision.",
        tags: ["AI Agents", "HITL", "Governance", "Series"],
        references: ["00-why-not-optional", "05-investment-not-tax", "08-decision-boundaries"],
        published: true
      }
    ]
  },
  {
  "id": "ai-amplifier",
  "title": "AI as Human Amplifier vs Replacement",
  "description": "An overview and eight essays on when AI improves human work, when automation makes sense, and how to test the difference.",
  "status": "complete",
  "tags": [
    "ai-agents",
    "human-augmentation",
    "philosophy"
  ],
  "posts": [
    {
      "slug": "ai-comes-for-the-grunt-work",
      "url": "/posts/ai-comes-for-the-grunt-work/",
      "title": "AI changes the work. Who gets the gains?",
      "date": "2026-07-01",
      "excerpt": "Automating a task can help a worker, replace their work, or create demand elsewhere. The outcome depends on how jobs and institutions change.",
      "tags": [
        "Series",
        "Essay",
        "Future of Work"
      ],
      "references": [],
      "published": true
    },
    {
      "slug": "01-amplification-thesis",
      "url": "/series/ai-amplifier/01-amplification-thesis/",
      "title": "The Amplification Thesis",
      "date": "2026-07-12",
      "excerpt": "AI can improve human work without making human-plus-AI the best option. Design for amplification, then test it against the alternatives.",
      "tags": [
        "Series",
        "Essay",
        "AI Strategy"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "02-centaur-advantage",
      "url": "/series/ai-amplifier/02-centaur-advantage/",
      "title": "The Centaur Advantage",
      "date": "2026-07-23",
      "excerpt": "Human-AI routing only helps if the router can identify a useful difference in ability. A chess experiment shows both the opportunity and the difficulty.",
      "tags": [
        "Series",
        "Architecture",
        "Human-AI Teaming"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "03-great-equalizer",
      "url": "/series/ai-amplifier/03-great-equalizer/",
      "title": "The Great Equalizer",
      "date": "2026-08-03",
      "excerpt": "AI can narrow performance gaps on a task. That does not mean it gives novices an expert's knowledge, pay, or independence.",
      "tags": [
        "Series",
        "Skills",
        "Research"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "04-cognitive-offloading-trap",
      "url": "/series/ai-amplifier/04-cognitive-offloading-trap/",
      "title": "The Cognitive Offloading Trap",
      "date": "2026-08-14",
      "excerpt": "Better assisted work and better learning are different outcomes. A classroom experiment shows why the distinction matters.",
      "tags": [
        "Series",
        "Learning",
        "Cognitive Science"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "05-amplification-in-code",
      "url": "/series/ai-amplifier/05-amplification-in-code/",
      "title": "Intelligence Amplification in Code",
      "date": "2026-08-24",
      "excerpt": "AI coding tools can accelerate a bounded task and slow experienced maintainers. Measure the work you actually need to finish.",
      "tags": [
        "Series",
        "Engineering",
        "Research"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "06-amplifying-creativity",
      "url": "/series/ai-amplifier/06-amplifying-creativity/",
      "title": "Amplifying Creativity",
      "date": "2026-09-04",
      "excerpt": "AI suggestions can improve an individual story while making a collection of stories more alike. Quality and variety need separate tests.",
      "tags": [
        "Series",
        "Creativity",
        "Research"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "07-new-skill-premium",
      "url": "/series/ai-amplifier/07-new-skill-premium/",
      "title": "The New Skill Premium",
      "date": "2026-09-15",
      "excerpt": "Job postings show which skills employers ask for, not what caused a wage premium. Build a development plan without mistaking either for a guarantee.",
      "tags": [
        "Series",
        "Skills",
        "Labor Market"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    },
    {
      "slug": "08-amplification-playbook",
      "url": "/series/ai-amplifier/08-amplification-playbook/",
      "title": "The Amplification Playbook",
      "date": "2026-09-26",
      "excerpt": "A proposed trial for redesigning one workflow around AI, with explicit baselines, worker input, learning checks, and a decision to stop.",
      "tags": [
        "Series",
        "AI Strategy",
        "Work Design"
      ],
      "references": [
        "ai-comes-for-the-grunt-work"
      ],
      "published": true
    }
  ]
},
  {
  "id": "progressive-crystallization",
  "title": "Progressive Crystallization",
  "description": "Ten essays on agent-led, hybrid, and deterministic playbooks: where knowledge comes from, what to test, and where the behavior belongs.",
  "status": "in-progress",
  "tags": [
    "automation",
    "ai-agents",
    "optimization"
  ],
  "posts": [
    {
      "slug": "01-ordinary-automation",
      "url": "/series/progressive-crystallization/01-ordinary-automation/",
      "title": "When an AI workflow should become ordinary automation",
      "date": "2026-09-27",
      "excerpt": "Once an AI-assisted workflow works, which parts should become normal software and which still need reasoning?",
      "tags": [
        "Series",
        "AI Agents",
        "Automation"
      ],
      "references": [],
      "published": true
    },
    {
      "slug": "02-rules-and-reasoning",
      "title": "Three execution forms, not a maturity ladder",
      "published": true,
      "excerpt": "Who chooses the next step, where reasoning occurs, and how to describe a mixed workflow without calling it a maturity ladder.",
      "url": "/series/progressive-crystallization/02-rules-and-reasoning/",
      "date": "2026-09-27",
      "tags": [
        "Series",
        "AI Agents",
        "Automation"
      ],
      "references": [
        "01-ordinary-automation"
      ]
    },
    {
      "slug": "03-runs-and-specifications",
      "title": "Two ways to get a useful playbook",
      "published": true,
      "excerpt": "Learn from an investigation or start with domain expertise. Both routes need an explicit contract and a record of what remains uncertain.",
      "url": "/series/progressive-crystallization/03-runs-and-specifications/",
      "date": "2026-09-27",
      "tags": [
        "Series",
        "AI Agents",
        "Automation"
      ],
      "references": [
        "02-rules-and-reasoning"
      ]
    },
    {
      "slug": "04-playbook-contract",
      "title": "What a playbook must promise, and who can author it",
      "published": true,
      "excerpt": "A fictional lab contract separates evidence, decisions, and authority, with ownership and stop conditions that a reviewer can inspect.",
      "url": "/series/progressive-crystallization/04-playbook-contract/",
      "date": "2026-09-27",
      "tags": [
        "Series",
        "AI Agents",
        "Automation"
      ],
      "references": [
        "03-runs-and-specifications"
      ]
    },
    {
      "slug": "05-bounded-reasoning",
      "title": "Keep the reasoning where it is needed",
      "published": true,
      "excerpt": "A worked hybrid workflow separates collection from interpretation and makes invalid answers, uncertainty, and consequences visible.",
      "url": "/series/progressive-crystallization/05-bounded-reasoning/",
      "date": "2026-09-27",
      "tags": [
        "Series",
        "AI Agents",
        "Automation"
      ],
      "references": [
        "04-playbook-contract"
      ]
    },
    {
      "slug": "06-rule-evidence",
      "title": "When a rule has earned its place",
      "published": false,
      "excerpt": "An executable synthetic example tests a narrow status rule, its rejection boundary, and the limits of replacing interpretation with code."
    },
    {
      "slug": "07-permissions-and-recovery",
      "title": "Permissions, recovery, and changed inputs",
      "published": false,
      "excerpt": "A recovery runbook for denied access, stale evidence, partial work, and drift, without silently granting an agent more authority."
    },
    {
      "slug": "08-measure-outcomes",
      "title": "Measure the outcome, not just the model calls",
      "published": false,
      "excerpt": "Define eligible work, verified outcomes, cost, and human effort before comparing execution forms or claiming an improvement."
    },
    {
      "slug": "09-implementation-location",
      "title": "Keep the playbook, or move behavior into the service?",
      "published": false,
      "excerpt": "An architecture decision separates execution form from implementation location, with ownership, rollout, and recovery on both sides."
    },
    {
      "slug": "10-several-designs",
      "title": "One scenario, several defensible designs",
      "published": false,
      "excerpt": "A fictional lab scenario brings the contracts, tests, recovery paths, and location choices together without requiring a single endpoint."
    }
  ]
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
