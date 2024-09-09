'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LayoutDashboard, UserSquare2, FolderKanban, BarChart2, Settings, Users, DollarSign, Target, PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import axios from '../lib/axios'

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lead: string;
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  deadline: string;
  fee: number;
}

function Dashboard({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) {
  const [timeFilter, setTimeFilter] = useState('all')
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [clientsResponse, projectsResponse] = await Promise.all([
        axios.get('/api/clients'),
        axios.get('/api/projects')
      ])
      setClients(clientsResponse.data)
      setProjects(projectsResponse.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const totalEarnings = projects.reduce((sum, project) => sum + project.fee, 0)
  const activeProjects = projects.filter(project => project.status !== 'Completed').length

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)
    // In a real application, you would filter the data based on the selected time period here
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Select onValueChange={handleTimeFilterChange} defaultValue={timeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Lead Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.slice(0, 3).map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.lead}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.filter(project => project.status !== 'Completed').map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {clients.length === 0 && projects.length === 0 ? (
        <div className="text-center mt-8">
          <p>No clients or projects found. Start by adding some!</p>
        </div>
      ) : (
        <>
          {/* Render your existing dashboard content here */}
        </>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}

function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [newClient, setNewClient] = useState<Client>({ id: 0, name: '', email: '', phone: '', lead: '' })
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      setClients(response.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching clients:', error)
      setError('Failed to fetch clients. Please try again later.')
    }
  }

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewClient(prev => ({ ...prev, [name]: value }))
  }

  const handleClientSelectChange = (value: string) => {
    setNewClient(prev => ({ ...prev, lead: value }))
  }

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await axios.put(`/api/clients/${newClient.id}`, newClient)
      } else {
        await axios.post('/api/clients', newClient)
      }
      await fetchClients() // Fetch updated list of clients
      setNewClient({ id: 0, name: '', email: '', phone: '', lead: '' })
      setIsClientDialogOpen(false)
      setIsEditing(false)
      setError(null)
    } catch (error) {
      console.error('Error saving client:', error)
      setError('Failed to save client. Please try again later.')
    }
  }

  const handleEditClient = (client: Client) => {
    setNewClient(client)
    setIsEditing(true)
    setIsClientDialogOpen(true)
  }

  const handleDeleteClient = async (id: number) => {
    try {
      await axios.delete(`/api/clients/${id}`)
      fetchClients()
      setError(null)
    } catch (error) {
      console.error('Error deleting client:', error)
      setError('Failed to delete client. Please try again later.')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" name="name" value={newClient.name} onChange={handleClientInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={newClient.email} onChange={handleClientInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={newClient.phone} onChange={handleClientInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead">Lead Source</Label>
                <Select onValueChange={handleClientSelectChange} value={newClient.lead}>
                  <SelectTrigger id="lead">
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Direct Email">Direct Email</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{isEditing ? 'Update Client' : 'Add Client'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Lead Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.lead}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Project>({ id: 0, name: '', client: '', status: '', deadline: '', fee: 0 })
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to fetch projects. Please try again later.')
    }
  }

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ 
      ...prev, 
      [name]: name === 'fee' ? parseFloat(value) : value 
    }))
  }

  const handleProjectSelectChange = (name: string, value: string) => {
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await axios.put(`/api/projects/${newProject.id}`, newProject)
      } else {
        await axios.post('/api/projects', newProject)
      }
      await fetchProjects() // Fetch updated list of projects
      setNewProject({ id: 0, name: '', client: '', status: '', deadline: '', fee: 0 })
      setIsProjectDialogOpen(false)
      setIsEditing(false)
      setError(null)
    } catch (error) {
      console.error('Error saving project:', error)
      setError('Failed to save project. Please try again later.')
    }
  }

  const handleEditProject = (project: Project) => {
    setNewProject(project)
    setIsEditing(true)
    setIsProjectDialogOpen(true)
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await axios.delete(`/api/projects/${id}`)
      fetchProjects()
      setError(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project. Please try again later.')
    }
  }

  const handleCompleteProject = async (project: Project) => {
    try {
      const updatedProject = { ...project, status: 'Completed' };
      await axios.put(`/api/projects/${project.id}`, updatedProject);
      await fetchProjects(); // Fetch updated list of projects
      setError(null);
    } catch (error) {
      console.error('Error completing project:', error);
      setError('Failed to complete project. Please try again later.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => {
              setNewProject({ id: 0, name: '', client: '', status: '', deadline: '', fee: 0 })
              setIsEditing(false)
              setIsProjectDialogOpen(true)
            }}>
              <PlusCircle className="h-4 w-4" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" name="name" value={newProject.name} onChange={handleProjectInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectClient">Client</Label>
                <Input id="projectClient" name="client" value={newProject.client} onChange={handleProjectInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectStatus">Status</Label>
                <Select onValueChange={(value) => handleProjectSelectChange('status', value)} value={newProject.status}>
                  <SelectTrigger id="projectStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDeadline">Deadline</Label>
                <Input id="projectDeadline" name="deadline" type="date" value={newProject.deadline} onChange={handleProjectInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectFee">Fee</Label>
                <Input id="projectFee" name="fee" type="number" value={newProject.fee} onChange={handleProjectInputChange} required />
              </div>
              <Button type="submit">{isEditing ? 'Update Project' : 'Add Project'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell>${project.fee.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {project.status !== 'Completed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleCompleteProject(project)}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}

function Statistics() {
  const [timeFilter, setTimeFilter] = useState('all')
  const [earnings, setEarnings] = useState<{ year: number; month: number; earnings: number }[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    projectsCompleted: 0,
    activeClients: 0,
    averageProjectValue: 0
  })

  useEffect(() => {
    fetchData()
  }, [timeFilter])

  const fetchData = async () => {
    try {
      // Fetch earnings data from API
      const earningsResponse = await axios.get(`/api/earnings?timeFilter=${timeFilter}`)
      setEarnings(earningsResponse.data)

      // Fetch stats data from API
      const statsResponse = await axios.get(`/api/stats?timeFilter=${timeFilter}`)
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error fetching statistics data:', error)
    }
  }

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <Select onValueChange={setTimeFilter} defaultValue={timeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Project Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageProjectValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Earnings {timeFilter !== 'all' ? `(${timeFilter})` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{`${getMonthName(item.month)} ${item.year}`}</TableCell>
                  <TableCell>${item.earnings.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsScreen() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorFallback({error, resetErrorBoundary}: {error: Error; resetErrorBoundary: () => void}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard setIsLoading={setIsLoading} />
      case 'clients':
        return <Clients />
      case 'projects':
        return <Projects />
      case 'statistics':
        return <Statistics />
      case 'settings':
        return <SettingsScreen />
      default:
        return <Dashboard setIsLoading={setIsLoading} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-16 bg-white shadow-md">
        <nav className="flex flex-col items-center py-4">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('dashboard')}
          >
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('clients')}
          >
            <UserSquare2 className="h-6 w-6" />
            <span className="sr-only">Clients</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('projects')}
          >
            <FolderKanban className="h-6 w-6" />
            <span className="sr-only">Projects</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('statistics')}
          >
            <BarChart2 className="h-6 w-6" />
            <span className="sr-only">Statistics</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('settings')}
          >
            <Settings className="h-6 w-6" />
            <span className="sr-only">Settings</span>
          </Button>
        </nav>
      </aside>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className="flex-1 overflow-auto">
          {renderScreen()}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
              <p>Loading...</p>
            </div>
          )}
        </main>
      </ErrorBoundary>
    </div>
  )
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lead: string;
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  deadline: string;
  fee: number;
}