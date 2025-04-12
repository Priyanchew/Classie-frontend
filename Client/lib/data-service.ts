import type { Assignment, Submission, SyncStatus, Team, Activity, User } from "./types"

// Mock data for assignments
const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Introduction to Physics",
    subject: "Physics",
    description:
      "Explore the fundamental concepts of physics including motion, energy, and forces. Complete the problems at the end of Chapter 1.",
    dueDate: "2025-04-20",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-01T10:00:00Z",
    completed: false,
    attachments: ["physics_chapter1.pdf"],
    syncStatus: "synced",
  },
  {
    id: "a2",
    title: "Essay on Modern Literature",
    subject: "English",
    description: "Write a 1000-word essay analyzing the themes in one of the novels we've studied this semester.",
    dueDate: "2025-04-25",
    createdAt: "2025-04-02T14:30:00Z",
    updatedAt: "2025-04-02T14:30:00Z",
    completed: false,
    syncStatus: "pending",
  },
  {
    id: "a3",
    title: "Data Structures Implementation",
    subject: "Computer Science",
    description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
    dueDate: "2025-04-18",
    createdAt: "2025-04-03T09:15:00Z",
    updatedAt: "2025-04-03T09:15:00Z",
    completed: true,
    syncStatus: "synced",
  },
  {
    id: "a4",
    title: "Chemical Reactions Lab Report",
    subject: "Chemistry",
    description: "Document your observations and results from the acid-base titration experiment conducted in class.",
    dueDate: "2025-04-22",
    createdAt: "2025-04-05T11:45:00Z",
    updatedAt: "2025-04-05T11:45:00Z",
    completed: false,
    syncStatus: "synced",
  },
  {
    id: "a5",
    title: "Linear Algebra Problem Set",
    subject: "Mathematics",
    description: "Complete problems 1-15 from Chapter 3 on vector spaces and linear transformations.",
    dueDate: "2025-04-10",
    createdAt: "2025-04-01T08:30:00Z",
    updatedAt: "2025-04-01T08:30:00Z",
    completed: false,
    syncStatus: "synced",
  },
  {
    id: "a6",
    title: "Group Project: Renewable Energy",
    subject: "Environmental Science",
    description: "Work with your team to create a presentation on a renewable energy source of your choice.",
    dueDate: "2025-04-30",
    createdAt: "2025-04-05T13:15:00Z",
    updatedAt: "2025-04-05T13:15:00Z",
    completed: false,
    teamId: "t1",
    syncStatus: "synced",
  },
]

// Mock data for submissions
const mockSubmissions: Submission[] = [
  {
    id: "s1",
    assignmentId: "a1",
    assignmentTitle: "Introduction to Physics",
    studentName: "John Doe",
    content: "The kinetic energy of an object is directly proportional to its mass and the square of its velocity.",
    status: "submitted",
    timestamp: "2025-04-10T15:30:00Z",
    syncStatus: "synced",
  },
  {
    id: "s2",
    assignmentId: "a2",
    assignmentTitle: "Essay on Modern Literature",
    studentName: "Jane Smith",
    content: "The themes of alienation and isolation are prevalent throughout the novel.",
    status: "draft",
    timestamp: "2025-04-12T09:45:00Z",
    syncStatus: "pending",
  },
  {
    id: "s3",
    assignmentId: "a3",
    assignmentTitle: "Data Structures Implementation",
    studentName: "Alex Johnson",
    content: "Implementation of binary search tree with all required operations.",
    status: "submitted",
    timestamp: "2025-04-15T14:20:00Z",
    syncStatus: "synced",
  },
]

// Mock data for teams
const mockTeams: Team[] = [
  {
    id: "t1",
    name: "Physics Study Group",
    subject: "Physics",
    description: "A team for collaborating on physics assignments and exam preparation.",
    code: "PHY123",
    createdAt: "2025-03-15T10:00:00Z",
    members: [
      {
        id: "user-1",
        name: "Alex Johnson",
        email: "alex@example.com",
        isTeamLead: true,
      },
      {
        id: "user-2",
        name: "Sarah Williams",
        email: "sarah@example.com",
      },
      {
        id: "user-3",
        name: "Michael Brown",
        email: "michael@example.com",
      },
    ],
    assignmentCount: 2,
    assignments: [
      {
        id: "a1",
        title: "Introduction to Physics",
        subject: "Physics",
        description:
          "Explore the fundamental concepts of physics including motion, energy, and forces. Complete the problems at the end of Chapter 1.",
        dueDate: "2025-04-20",
        createdAt: "2025-04-01T10:00:00Z",
        updatedAt: "2025-04-01T10:00:00Z",
        completed: false,
        syncStatus: "synced",
      },
      {
        id: "a7",
        title: "Physics Lab: Pendulum Motion",
        subject: "Physics",
        description: "Conduct the pendulum experiment and write up your findings in a lab report.",
        dueDate: "2025-04-28",
        createdAt: "2025-04-07T09:30:00Z",
        updatedAt: "2025-04-07T09:30:00Z",
        completed: false,
        syncStatus: "synced",
      },
    ],
  },
  {
    id: "t2",
    name: "Computer Science Project Team",
    subject: "Computer Science",
    description: "Team for the semester-long software development project.",
    code: "CS456",
    createdAt: "2025-03-20T14:30:00Z",
    members: [
      {
        id: "user-1",
        name: "Alex Johnson",
        email: "alex@example.com",
      },
      {
        id: "user-4",
        name: "Emily Chen",
        email: "emily@example.com",
        isTeamLead: true,
      },
      {
        id: "user-5",
        name: "David Kim",
        email: "david@example.com",
      },
    ],
    assignmentCount: 1,
    assignments: [
      {
        id: "a3",
        title: "Data Structures Implementation",
        subject: "Computer Science",
        description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
        dueDate: "2025-04-18",
        createdAt: "2025-04-03T09:15:00Z",
        updatedAt: "2025-04-03T09:15:00Z",
        completed: true,
        syncStatus: "synced",
      },
    ],
  },
  {
    id: "t3",
    name: "Environmental Science Research",
    subject: "Environmental Science",
    description: "Team for the renewable energy research project.",
    code: "ENV789",
    createdAt: "2025-03-25T11:15:00Z",
    members: [
      {
        id: "user-1",
        name: "Alex Johnson",
        email: "alex@example.com",
      },
      {
        id: "user-6",
        name: "Jessica Martinez",
        email: "jessica@example.com",
        isTeamLead: true,
      },
      {
        id: "user-7",
        name: "Ryan Taylor",
        email: "ryan@example.com",
      },
      {
        id: "user-8",
        name: "Olivia Wilson",
        email: "olivia@example.com",
      },
    ],
    assignmentCount: 1,
    assignments: [
      {
        id: "a6",
        title: "Group Project: Renewable Energy",
        subject: "Environmental Science",
        description: "Work with your team to create a presentation on a renewable energy source of your choice.",
        dueDate: "2025-04-30",
        createdAt: "2025-04-05T13:15:00Z",
        updatedAt: "2025-04-05T13:15:00Z",
        completed: false,
        teamId: "t1",
        syncStatus: "synced",
      },
    ],
  },
]

// Mock data for activities
const mockActivities: Activity[] = [
  {
    id: "act1",
    type: "assignment",
    message: "New assignment 'Introduction to Physics' has been added",
    timestamp: "2025-04-01T10:00:00Z",
    user: {
      id: "admin-1",
      name: "Professor Smith",
      email: "smith@example.com",
    },
    link: "/assignments/a1",
  },
  {
    id: "act2",
    type: "deadline",
    message: "Deadline for 'Linear Algebra Problem Set' is approaching (2 days left)",
    timestamp: "2025-04-08T09:00:00Z",
    user: {
      id: "system",
      name: "System",
      email: "system@example.com",
    },
    link: "/assignments/a5",
  },
  {
    id: "act3",
    type: "team",
    message: "Created team 'Physics Study Group'",
    timestamp: "2025-03-15T10:00:00Z",
    user: {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
    },
    link: "/teams/t1",
  },
  {
    id: "act4",
    type: "join",
    message: "Sarah Williams joined team 'Physics Study Group'",
    timestamp: "2025-03-16T14:20:00Z",
    user: {
      id: "user-2",
      name: "Sarah Williams",
      email: "sarah@example.com",
    },
    link: "/teams/t1",
  },
  {
    id: "act5",
    type: "complete",
    message: "Completed assignment 'Data Structures Implementation'",
    timestamp: "2025-04-15T16:45:00Z",
    user: {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
    },
    link: "/assignments/a3",
  },
  {
    id: "act6",
    type: "edit",
    message: "Extended deadline for 'Essay on Modern Literature'",
    timestamp: "2025-04-18T11:30:00Z",
    user: {
      id: "admin-1",
      name: "Professor Smith",
      email: "smith@example.com",
    },
    link: "/assignments/a2",
  },
  {
    id: "act7",
    type: "comment",
    message: "Added a comment on 'Group Project: Renewable Energy'",
    timestamp: "2025-04-10T13:15:00Z",
    user: {
      id: "user-6",
      name: "Jessica Martinez",
      email: "jessica@example.com",
    },
    link: "/assignments/a6",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all assignments
export async function getAssignments(): Promise<Assignment[]> {
  await delay(800)
  return [...mockAssignments]
}

// Get a single assignment by ID
export async function getAssignment(id: string): Promise<Assignment | null> {
  await delay(600)
  const assignment = mockAssignments.find((a) => a.id === id)
  return assignment || null
}

// Create a new assignment
export async function createAssignment(data: Partial<Assignment>): Promise<Assignment> {
  await delay(1000)

  const newAssignment: Assignment = {
    id: `a${mockAssignments.length + 1}`,
    title: data.title || "Untitled Assignment",
    subject: data.subject || "General",
    description: data.description || "",
    dueDate: data.dueDate || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: "pending",
  }

  mockAssignments.push(newAssignment)
  return newAssignment
}

// Submit an assignment
export async function submitAssignment(data: {
  assignmentId: string
  content: string
  status: "draft" | "submitted"
}): Promise<void> {
  await delay(1000)

  const assignmentIndex = mockAssignments.findIndex((a) => a.id === data.assignmentId)

  if (assignmentIndex >= 0 && data.status === "submitted") {
    mockAssignments[assignmentIndex].completed = true
    mockAssignments[assignmentIndex].syncStatus = "pending"
  }
}

// Get all submissions
export async function getSubmissions(): Promise<Submission[]> {
  await delay(800)
  return [...mockSubmissions]
}

// Get submissions for a specific assignment
export async function getSubmissionsForAssignment(assignmentId: string): Promise<Submission[]> {
  await delay(600)
  return mockSubmissions.filter((s) => s.assignmentId === assignmentId)
}

// Save a submission (create or update)
export async function saveSubmission(data: Partial<Submission>): Promise<Submission> {
  await delay(1000)

  const existingIndex = mockSubmissions.findIndex((s) => s.id === data.id)

  if (existingIndex >= 0) {
    // Update existing submission
    const updated = {
      ...mockSubmissions[existingIndex],
      ...data,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending" as SyncStatus,
    }

    mockSubmissions[existingIndex] = updated as Submission
    return updated as Submission
  } else {
    // Create new submission
    const assignment = mockAssignments.find((a) => a.id === data.assignmentId)

    const newSubmission: Submission = {
      id: `s${mockSubmissions.length + 1}`,
      assignmentId: data.assignmentId || "",
      assignmentTitle: assignment?.title || "Unknown Assignment",
      studentName: "Current User",
      content: data.content || "",
      status: data.status || "draft",
      timestamp: new Date().toISOString(),
      syncStatus: "pending",
    }

    mockSubmissions.push(newSubmission)
    return newSubmission
  }
}

// Get all teams
export async function getTeams(): Promise<Team[]> {
  await delay(800)
  return [...mockTeams]
}

// Get a single team by ID
export async function getTeam(id: string): Promise<Team | null> {
  await delay(600)
  const team = mockTeams.find((t) => t.id === id)
  return team || null
}

// Create a new team
export async function createTeam(data: {
  name: string
  subject: string
  description?: string
}): Promise<Team> {
  await delay(1000)

  // Generate a random team code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const newTeam: Team = {
    id: `t${mockTeams.length + 1}`,
    name: data.name,
    subject: data.subject,
    description: data.description,
    code: generateCode(),
    createdAt: new Date().toISOString(),
    members: [
      {
        id: "user-1",
        name: "Alex Johnson",
        email: "alex@example.com",
        isTeamLead: true,
      },
    ],
    assignmentCount: 0,
    assignments: [],
  }

  mockTeams.push(newTeam)

  // Add activity
  mockActivities.push({
    id: `act${mockActivities.length + 1}`,
    type: "team",
    message: `Created team '${newTeam.name}'`,
    timestamp: new Date().toISOString(),
    user: {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
    },
    link: `/teams/${newTeam.id}`,
  })

  return newTeam
}

// Join a team
export async function joinTeam(code: string): Promise<Team> {
  await delay(1000)

  const team = mockTeams.find((t) => t.code === code)

  if (!team) {
    throw new Error("Invalid team code")
  }

  // Check if user is already a member
  const isMember = team.members.some((m) => m.id === "user-1")

  if (!isMember) {
    const user: User = {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
    }

    team.members.push(user)

    // Add activity
    mockActivities.push({
      id: `act${mockActivities.length + 1}`,
      type: "join",
      message: `Alex Johnson joined team '${team.name}'`,
      timestamp: new Date().toISOString(),
      user,
      link: `/teams/${team.id}`,
    })
  }

  return team
}

// Get all activities
export async function getActivities(): Promise<Activity[]> {
  await delay(800)
  return [...mockActivities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
