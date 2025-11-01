"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/components/DashboardContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

type TaskForm = {
  id?: string
  description: string
  projectId: string
  status: "Pendiente" | "En progreso" | "Completado"
  priority: "Baja" | "Media" | "Alta" | "Urgente"
  userId: string | ""
  dateline: Date | undefined
}

export function TasksTable() {
  const { tasks, projects, team, addTask, updateTask, deleteTask, settings, isLoading, getProjectName, getUserName } = useDashboard()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<TaskForm>({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: undefined })
  const [editId, setEditId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(tasks.length / settings.itemsPerPage))
  const pageTasks = useMemo(() => {
    const start = (page - 1) * settings.itemsPerPage
    return tasks.slice(start, start + settings.itemsPerPage)
  }, [tasks, page, settings.itemsPerPage])

  const reset = () => {
    setEditId(null)
    setForm({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: undefined })
    setError(null)
  }

  const startEdit = (id: string) => {
    const row = tasks.find((t) => t.id === id)
    if (!row) return
    setEditId(id)
    setForm({
      description: row.description,
      projectId: row.projectId,
      status: row.status,
      priority: row.priority,
      userId: row.userId || "",
      dateline: row.dateline ? new Date(row.dateline) : undefined,
    })
    setOpen(true)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.description || !form.projectId || !form.dateline) {
      setError("Completa descripción, proyecto y fecha límite")
      return
    }
    setError(null)
    const payload = {
      description: form.description,
      projectId: form.projectId,
      status: form.status,
      priority: form.priority,
      userId: form.userId || null,
      dateline: form.dateline.toISOString().slice(0, 10),
    }
    if (editId) {
      await updateTask(editId, payload)
    } else {
      await addTask(payload)
    }
    reset()
    setOpen(false)
  }

  return (
    <div className="rounded-md border">
      <div className="flex justify-end p-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
          <DialogTrigger asChild>
            <Button onClick={() => { reset(); setOpen(true) }}>Nueva tarea</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[620px]">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{editId ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
                <DialogDescription>Completa los datos de la tarea.</DialogDescription>
              </DialogHeader>
              {error ? (
                <Alert className="bg-destructive/10"><AlertDescription>{error}</AlertDescription></Alert>
              ) : null}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Proyecto *</Label>
                    <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridad</Label>
                    <Select value={form.priority} onValueChange={(v: any) => setForm({ ...form, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Asignado a</Label>
                    <Select value={form.userId || "none"} onValueChange={(v) => setForm({ ...form, userId: v === "none" ? "" : v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sin asignar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin asignar</SelectItem>
                        {team.map((u) => (
                          <SelectItem key={u.userId} value={u.userId}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Fecha límite *</Label>
                    <Calendar mode="single" selected={form.dateline} onSelect={(d) => setForm({ ...form, dateline: d })} className="rounded-md border" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}{editId ? "Guardar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Tarea</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Fecha límite</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{task.description}</TableCell>
              <TableCell>{getProjectName(task.projectId)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
              </TableCell>
              <TableCell>{getUserName(task.userId || undefined)}</TableCell>
              <TableCell>{task.dateline}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(task.id)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>Eliminar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1) }}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
