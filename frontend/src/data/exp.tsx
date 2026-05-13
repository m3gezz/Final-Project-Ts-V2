const av = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=70`;

export const users: User[] = [
  {
    id: "u1",
    username: "alex.morgan",
    full_name: "Alex Morgan",
    email: "alex@collab.app",
    avatar: av("alex"),
    bio: "Product designer · indie hacker",
    about:
      "I love crafting beautiful, intuitive product experiences and shipping side-projects on weekends.",
    skills: ["Figma", "Design Systems", "React", "Framer"],
    badges: [
      { name: "Early adopter", emoji: "🚀" },
      { name: "10 projects", emoji: "🏆" },
    ],
  },
  {
    id: "u2",
    username: "sam.lee",
    full_name: "Sam Lee",
    email: "sam@collab.app",
    avatar: av("sam"),
    bio: "Full-stack engineer",
    about: "Backend-leaning generalist. Rust, TypeScript, Postgres.",
    skills: ["TypeScript", "Rust", "Postgres", "AWS"],
    badges: [{ name: "Open source", emoji: "💻" }],
  },
  {
    id: "u3",
    username: "nora.k",
    full_name: "Nora Kowalski",
    email: "nora@collab.app",
    avatar: av("nora"),
    bio: "ML researcher",
    about: "Working on multimodal models and applied ML.",
    skills: ["Python", "PyTorch", "ML", "Research"],
    badges: [{ name: "Top contributor", emoji: "⭐" }],
  },
  {
    id: "u4",
    username: "diego.r",
    full_name: "Diego Ramos",
    email: "diego@collab.app",
    avatar: av("diego"),
    bio: "iOS developer",
    about: "Swift, SwiftUI and clean architecture.",
    skills: ["Swift", "SwiftUI", "iOS"],
    badges: [],
  },
  {
    id: "u5",
    username: "mia.tan",
    full_name: "Mia Tan",
    email: "mia@collab.app",
    avatar: av("mia"),
    bio: "Growth & marketing",
    about: "B2B SaaS growth, SEO and lifecycle.",
    skills: ["SEO", "Lifecycle", "Copywriting"],
    badges: [],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Lumen — AI study companion",
    image: img("photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3"),
    category: "AI",
    skills: ["React", "Python", "ML"],
    description:
      "An AI tutor that adapts to how you learn. Personalized study plans, spaced repetition and instant explanations.",
    manifesto:
      "Education should bend to the student, not the other way around. Lumen is a small team trying to make personalized learning accessible to anyone.",
    ownerId: "u1",
    members: ["u1", "u2", "u3"],
    likes: 128,
    liked: true,
    comments: [
      {
        id: "c1",
        userId: "u3",
        text: "Love this direction. Are you hiring an ML eng?",
        at: "2d",
      },
    ],
  },
  {
    id: "p2",
    title: "Orbit — async standups",
    image: img("photo-1551434678-e076c223a692"),
    category: "Productivity",
    skills: ["TypeScript", "Node", "Slack API"],
    description:
      "Replace daily standups with async video updates that summarize themselves.",
    manifesto:
      "Meetings are taxes on focus. Orbit gives teams their mornings back.",
    ownerId: "u2",
    members: ["u2", "u4"],
    likes: 64,
    comments: [],
  },
  {
    id: "p3",
    title: "Pebble — habit tracker",
    image: img("photo-1517048676732-d65bc937f952"),
    category: "Mobile",
    skills: ["Swift", "SwiftUI", "Design"],
    description: "Tiny habits, real change. A zero-friction iOS habit tracker.",
    manifesto:
      "Small consistent actions beat heroic effort. Pebble removes every excuse to skip a day.",
    ownerId: "u4",
    members: ["u4", "u5"],
    likes: 42,
    comments: [],
  },
  {
    id: "p4",
    title: "Beacon — open SEO toolkit",
    image: img("photo-1460925895917-afdab827c52f"),
    category: "Marketing",
    skills: ["SEO", "Next.js", "Analytics"],
    description: "An open-source alternative to expensive SEO suites.",
    manifesto:
      "SEO knowledge shouldn't be paywalled. Beacon makes the basics free for everyone.",
    ownerId: "u5",
    members: ["u5", "u1"],
    likes: 91,
    comments: [],
  },
  {
    id: "p5",
    title: "Halo — design tokens manager",
    image: img("photo-1545239351-1141bd82e8a6"),
    category: "Design",
    skills: ["Figma", "Tokens", "TypeScript"],
    description:
      "Sync design tokens between Figma and your codebase, in real time.",
    manifesto: "Designers and engineers deserve a single source of truth.",
    ownerId: "u1",
    members: ["u1"],
    likes: 73,
    comments: [],
  },
  {
    id: "p6",
    title: "Quill — collaborative writing",
    image: img("photo-1455390582262-044cdead277a"),
    category: "Productivity",
    skills: ["Editor", "CRDT", "React"],
    description: "Realtime writing for technical teams.",
    manifesto:
      "Documentation is the highest leverage activity in software. Quill makes it joyful.",
    ownerId: "u3",
    members: ["u3", "u2"],
    likes: 55,
    comments: [],
  },
];

export const workspaces: Workspace[] = [
  {
    id: "w1",
    projectId: "p1",
    name: "Lumen Workspace",
    members: [
      { userId: "u1", role: "Owner" },
      { userId: "u2", role: "Admin" },
      { userId: "u3", role: "Member" },
    ],
  },
  {
    id: "w2",
    projectId: "p2",
    name: "Orbit Workspace",
    members: [
      { userId: "u2", role: "Owner" },
      { userId: "u4", role: "Member" },
    ],
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    workspaceId: "w1",
    title: "Design onboarding flow",
    status: "doing",
    assigneeId: "u1",
    priority: "high",
  },
  {
    id: "t2",
    workspaceId: "w1",
    title: "Set up auth + RLS",
    status: "todo",
    assigneeId: "u2",
    priority: "high",
  },
  {
    id: "t3",
    workspaceId: "w1",
    title: "Train baseline tutor model",
    status: "doing",
    assigneeId: "u3",
    priority: "med",
  },
  {
    id: "t4",
    workspaceId: "w1",
    title: "Landing page copy",
    status: "done",
    assigneeId: "u1",
    priority: "low",
  },
  {
    id: "t5",
    workspaceId: "w1",
    title: "Pricing experiments",
    status: "todo",
    priority: "med",
  },
  {
    id: "t6",
    workspaceId: "w2",
    title: "Slack integration",
    status: "doing",
    assigneeId: "u2",
    priority: "high",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    workspaceId: "w1",
    userId: "u1",
    text: "Morning team! Pushed the new onboarding mocks 🌅",
    at: "9:02",
  },
  {
    id: "m2",
    workspaceId: "w1",
    userId: "u2",
    text: "Looking at them now. The empty state is 🔥",
    at: "9:05",
  },
  {
    id: "m3",
    workspaceId: "w1",
    userId: "u3",
    text: "Quick q: do we want spaced repetition in v1?",
    at: "9:12",
  },
  {
    id: "m4",
    workspaceId: "w1",
    userId: "u1",
    text: "Yes, but minimal. Let's ship the simplest version.",
    at: "9:14",
    attachment: { name: "v1-scope.pdf", size: "284 KB" },
  },
];

export const invitations: Invitation[] = [
  {
    id: "i1",
    workspaceId: "w1",
    fromUserId: "u4",
    toUserId: "u1",
    status: "pending",
    kind: "join_request",
  },
  {
    id: "i2",
    workspaceId: "w2",
    fromUserId: "u2",
    toUserId: "u1",
    status: "pending",
    kind: "invite",
  },
  {
    id: "i3",
    workspaceId: "w1",
    fromUserId: "u1",
    toUserId: "u5",
    status: "pending",
    kind: "invite",
  },
];

export const findUser = (id: string) => users.find((u) => u.id === id)!;
export const findProject = (id: string) => projects.find((p) => p.id === id);
export const findWorkspace = (id: string) =>
  workspaces.find((w) => w.id === id);
