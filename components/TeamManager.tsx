"use client"

import { useState } from "react"
import { useDashboard } from "@/components/DashboardContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"

type FormState = {
  name: string
  email: string
  role: string
  position: string
  phone: string
  birthdate: Date | undefined
  projectId: string | null
  isActive: boolean
}

export function TeamManager() {
  const { team, projects, addTeamMember, updateTeamMember, deleteTeamMember, isLoading } = useDashboard()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "",
    position: "",
    phone: "",
    birthdate: undefined,
    projectId: null,
    isActive: true,
  })

  const reset = () => {
    setEditId(null)
    setForm({ name: "", email: "", role: "", position: "", phone: "", birthdate: undefined, projectId: null, isActive: true })
    setError(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role) {
      setError("Completa nombre, email y role")
      return
    }
    setError(null)
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      position: form.position,
      phone: form.phone,
      birthdate: form.birthdate ? form.birthdate.toISOString().slice(0, 10) : null,
      projectId: form.projectId ?? null,
      isActive: form.isActive,
    }
    if (editId) {
      await updateTeamMember(editId, payload)
    } else {
      await addTeamMember(payload)
    }
    reset()
    setOpen(false)
  }

  const startEdit = (id: string) => {
    const row = team.find((t) => t.userId === id)
    if (!row) return
    setEditId(id)
    setForm({
      name: row.name,
      email: row.email,
      role: row.role,
      position: row.position,
      phone: row.phone || "",
      birthdate: row.birthdate ? new Date(row.birthdate) : undefined,
      projectId: row.projectId ?? null,
      isActive: row.isActive,
    })
    setOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
          <DialogTrigger asChild>
            <Button onClick={() => { reset(); setOpen(true) }}>Nuevo miembro</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{editId ? "Editar miembro" : "Nuevo miembro"}</DialogTitle>
                <DialogDescription>Completa la información del miembro del equipo.</DialogDescription>
              </DialogHeader>
              {error ? (
                <Alert className="bg-destructive/10"><AlertDescription>{error}</AlertDescription></Alert>
              ) : null}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rol *</Label>
                    <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Cargo</Label>
                    <Input id="position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fecha de nacimiento</Label>
                    <Calendar mode="single" selected={form.birthdate} onSelect={(d) => setForm({ ...form, birthdate: d })} className="rounded-md border" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Proyecto</Label>
                    <Select value={form.projectId ?? "none"} onValueChange={(v) => setForm({ ...form, projectId: v === "none" ? null : v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin asignar</SelectItem>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 pt-2">
                      <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                      <Label>Activo</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}{editId ? "Guardar cambios" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {team.map((member) => {
              const projectName = projects.find((p) => p.id === (member.projectId ?? ""))?.name || "Sin asignar"
              return (
                <div key={member.userId} className="flex items-start justify-between p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">ID: <span className="font-mono">{member.userId}</span></p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        <p><span className="text-muted-foreground">Rol:</span> {member.role}</p>
                        <p><span className="text-muted-foreground">Email:</span> {member.email}</p>
                        <p><span className="text-muted-foreground">Cargo:</span> {member.position || "—"}</p>
                        <p><span className="text-muted-foreground">Teléfono:</span> {member.phone || "—"}</p>
                        <p><span className="text-muted-foreground">Nacimiento:</span> {member.birthdate || "—"}</p>
                        <p><span className="text-muted-foreground">Proyecto:</span> {projectName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.isActive ? "default" : "secondary"}>{member.isActive ? "Activo" : "Inactivo"}</Badge>
                    <Button size="sm" variant="outline" onClick={() => startEdit(member.userId)}>Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteTeamMember(member.userId)}>Eliminar</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


