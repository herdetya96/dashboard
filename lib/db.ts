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
  
  let clients: Client[] = [];
  let projects: Project[] = [];
  
  export const db = {
    clients: {
      getAll: () => clients,
      add: (client: Omit<Client, "id">) => {
        const newClient = { ...client, id: Date.now() };
        clients.push(newClient);
        return newClient;
      },
      update: (updatedClient: Client) => {
        clients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
        return updatedClient;
      },
      delete: (id: number) => {
        clients = clients.filter(c => c.id !== id);
      }
    },
    projects: {
      getAll: () => projects,
      add: (project: Omit<Project, "id">) => {
        const newProject = { ...project, id: Date.now() };
        projects.push(newProject);
        return newProject;
      },
      update: (updatedProject: Project) => {
        projects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
        return updatedProject;
      },
      delete: (id: number) => {
        projects = projects.filter(p => p.id !== id);
      }
    }
  };