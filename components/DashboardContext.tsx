"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

export type Project = {
  id: string
  name: string
  description?: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "Planificado" | "En progreso" | "En revisión" | "Completado"
  progress: number
  teamSize: number
  createdAt: string
}

export type TeamMember = {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string | null
  phone?: string
  projectId?: string | null
  isActive: boolean
}

export type TaskItem = {
  id: string
  description: string
  projectId: string
  status: "Pendiente" | "En progreso" | "Completado"
  priority: "Baja" | "Media" | "Alta" | "Urgente"
  userId?: string | null
  dateline: string
}

export type SettingsState = {
  itemsPerPage: number
  notifications: boolean
  theme: "light" | "dark" | "system"
  dateFormat: "YYYY-MM-DD" | "DD/MM/YYYY"
  language: "es" | "en"
  defaultProjectId: string | null
  compactMode: boolean
  showActivityFeed: boolean
}

type DashboardContextValue = {
  projects: Project[]
  team: TeamMember[]
  tasks: TaskItem[]
  settings: SettingsState
  isLoading: boolean

  getProjectName: (projectId: string) => string
  getUserName: (userId?: string | null) => string

  addProject: (data: Omit<Project, "id" | "createdAt" | "status" | "progress"> & Partial<Pick<Project, "status" | "progress">>) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  addTeamMember: (data: Omit<TeamMember, "userId">) => Promise<void>
  updateTeamMember: (userId: string, data: Partial<TeamMember>) => Promise<void>
  deleteTeamMember: (userId: string) => Promise<void>
  addTask: (data: Omit<TaskItem, "id">) => Promise<void>
  updateTask: (id: string, data: Partial<TaskItem>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateSettings: (data: Partial<SettingsState>) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const simulateNetwork = (ms = 650) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 65,
    teamSize: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    priority: "medium",
    status: "En revisión",
    progress: 90,
    teamSize: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones",
    category: "web",
    priority: "low",
    status: "Planificado",
    progress: 20,
    teamSize: 4,
    createdAt: new Date().toISOString(),
  },
]

const initialTeam: TeamMember[] = [
  {
    userId: "u1",
    role: "Frontend Developer",
    name: "María García",
    email: "maria@example.com",
    position: "Frontend",
    birthdate: "1996-05-12",
    phone: "+51 999 111 222",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "u2",
    role: "Backend Developer",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Backend",
    birthdate: "1992-08-02",
    phone: "+51 999 333 444",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "u3",
    role: "UI/UX Designer",
    name: "Ana López",
    email: "ana@example.com",
    position: "Diseño",
    birthdate: "1994-03-21",
    phone: "+51 999 555 666",
    projectId: "p2",
    isActive: false,
  },
]

const initialTasks: TaskItem[] = [
  {
    id: "t1",
    description: "Implementar autenticación",
    projectId: "p1",
    status: "En progreso",
    priority: "Alta",
    userId: "u1",
    dateline: "2025-11-15",
  },
  {
    id: "t2",
    description: "Diseñar pantalla de perfil",
    projectId: "p2",
    status: "Pendiente",
    priority: "Media",
    userId: "u3",
    dateline: "2025-11-20",
  },
  {
    id: "t3",
    description: "Configurar CI/CD",
    projectId: "p3",
    status: "Completado",
    priority: "Alta",
    userId: "u2",
    dateline: "2025-11-10",
  },
]

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks)
  const [settings, setSettings] = useState<SettingsState>({
    itemsPerPage: 5,
    notifications: true,
    theme: "system",
    dateFormat: "DD/MM/YYYY",
    language: "es",
    defaultProjectId: null,
    compactMode: false,
    showActivityFeed: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const getProjectName = useCallback(
    (projectId: string) => projects.find((p) => p.id === projectId)?.name ?? "—",
    [projects]
  )
  const getUserName = useCallback(
    (userId?: string | null) => (userId ? team.find((u) => u.userId === userId)?.name ?? "—" : "—"),
    [team]
  )

  const addProject: DashboardContextValue["addProject"] = async (data) => {
    setIsLoading(true)
    await simulateNetwork()
    setProjects((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status ?? "Planificado",
        progress: data.progress ?? 0,
        teamSize: data.teamSize,
        createdAt: new Date().toISOString(),
      },
    ])
    setIsLoading(false)
  }

  const deleteProject: DashboardContextValue["deleteProject"] = async (projectId) => {
    setIsLoading(true)
    await simulateNetwork()
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId))
    setTeam((prev) => prev.map((m) => (m.projectId === projectId ? { ...m, projectId: null } : m)))
    setIsLoading(false)
  }

  const addTeamMember: DashboardContextValue["addTeamMember"] = async (data) => {
    setIsLoading(true)
    await simulateNetwork()
    setTeam((prev) => [...prev, { ...data, userId: crypto.randomUUID() }])
    setIsLoading(false)
  }

  const updateTeamMember: DashboardContextValue["updateTeamMember"] = async (userId, data) => {
    setIsLoading(true)
    await simulateNetwork()
    setTeam((prev) => prev.map((m) => (m.userId === userId ? { ...m, ...data } : m)))
    setIsLoading(false)
  }

  const deleteTeamMember: DashboardContextValue["deleteTeamMember"] = async (userId) => {
    setIsLoading(true)
    await simulateNetwork()
    setTeam((prev) => prev.filter((m) => m.userId !== userId))
    setTasks((prev) => prev.map((t) => (t.userId === userId ? { ...t, userId: null } : t)))
    setIsLoading(false)
  }

  const addTask: DashboardContextValue["addTask"] = async (data) => {
    setIsLoading(true)
    await simulateNetwork()
    setTasks((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    setIsLoading(false)
  }

  const updateTask: DashboardContextValue["updateTask"] = async (id, data) => {
    setIsLoading(true)
    await simulateNetwork()
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
    setIsLoading(false)
  }

  const deleteTask: DashboardContextValue["deleteTask"] = async (id) => {
    setIsLoading(true)
    await simulateNetwork()
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setIsLoading(false)
  }

  const updateSettings: DashboardContextValue["updateSettings"] = (data) => {
    setSettings((prev) => ({ ...prev, ...data }))
  }

  const value = useMemo<DashboardContextValue>(
    () => ({
      projects,
      team,
      tasks,
      settings,
      isLoading,
      getProjectName,
      getUserName,
      addProject,
      deleteProject,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      addTask,
      updateTask,
      deleteTask,
      updateSettings,
    }),
    [projects, team, tasks, settings, isLoading, getProjectName, getUserName]
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return ctx
}


