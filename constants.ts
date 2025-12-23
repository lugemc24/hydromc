
import { SiteConfig, Language } from './types';
import { ENV } from './env';

export const INITIAL_CONFIG: SiteConfig = {
  serverName: "HYDROMC",
  serverIp: "play.hydromc.com",
  discordLink: "https://discord.gg/hydromc",
  discordWebhookUrl: "",
  discordBotToken: ENV.DISCORD_BOT_TOKEN,
  discordGuildId: ENV.DISCORD_GUILD_ID,
  discordRoleId: ENV.ADMIN_ROLE_ID,
  ownerRoleId: ENV.OWNER_ROLE_ID, // Link owner role
  applyLink: "/apply",
  languages: ['en', 'es', 'tl'],
  staff: [
    {
      id: "1",
      name: "AdminZero",
      role: "Owner",
      avatar: "https://api.mineatar.io/face/AdminZero?scale=16",
      description: "Founder and Lead Developer of the HydroMC Core."
    },
    {
      id: "2",
      name: "Nexus",
      role: "Developer",
      avatar: "https://api.mineatar.io/face/Nexus?scale=16",
      description: "Systems Architect and Backend Engineer."
    }
  ],
  tabs: [
    {
      id: "home",
      label: { en: "Home", es: "Inicio", tl: "Bahay" },
      path: "/",
      content: "",
      isVisible: true,
      isDeletable: false
    },
    {
      id: "apply",
      label: { en: "Apply", es: "Postular", tl: "Mag-apply" },
      path: "/apply",
      content: "",
      isVisible: true,
      isDeletable: true
    },
    {
      id: "staff",
      label: { en: "Staff", es: "Personal", tl: "Mga Staff" },
      path: "/staff",
      content: "",
      isVisible: true,
      isDeletable: true
    }
  ],
  heroText: {
    en: "Welcome to HydroMC",
    es: "Bienvenido a HydroMC",
    tl: "Maligayang pagdating sa HydroMC"
  },
  heroSubtext: {
    en: "The ultimate survival experience awaits you.",
    es: "La experiencia de supervivencia definitiva te espera.",
    tl: "Naghihintay sa iyo ang pinakamagandang karanasan sa survival."
  },
  applications: []
};

export const TRANSLATIONS = {
  en: {
    joinDiscord: "Join Discord Server",
    copyIp: "Copy Server IP",
    ipCopied: "IP Copied!",
    loginWithDiscord: "Login with Discord",
    adminPanel: "Admin Panel",
    logout: "Logout",
    staffTitle: "Our Dedicated Team",
    applyTitle: "Join Our Team",
    saveChanges: "Save Changes",
    addTab: "Add New Tab",
    editTab: "Edit Tab",
    deleteTab: "Delete Tab",
    siteSettings: "Site Settings",
    serverName: "Server Name",
    serverIp: "Server IP",
    discordUrl: "Discord URL",
    applyUrl: "Apply URL",
    home: "Home",
    apply: "Apply",
    staff: "Staff",
    admin: "Admin"
  },
  es: {
    joinDiscord: "Unirse al Servidor de Discord",
    copyIp: "Copiar IP del Servidor",
    ipCopied: "¡IP Copiada!",
    loginWithDiscord: "Iniciar sesión con Discord",
    adminPanel: "Panel de Administración",
    logout: "Cerrar Sesión",
    staffTitle: "Nuestro Equipo Dedicado",
    applyTitle: "Únete a Nuestro Equipo",
    saveChanges: "Guardar Cambios",
    addTab: "Agregar Nueva Pestaña",
    editTab: "Editar Pestaña",
    deleteTab: "Eliminar Pestaña",
    siteSettings: "Configuración del Sitio",
    serverName: "Nombre del Servidor",
    serverIp: "IP del Servidor",
    discordUrl: "URL de Discord",
    applyUrl: "URL de Postulación",
    home: "Inicio",
    apply: "Postular",
    staff: "Personal",
    admin: "Admin"
  },
  tl: {
    joinDiscord: "Sumali sa Discord Server",
    copyIp: "Kopyahin ang Server IP",
    ipCopied: "Kopyado na ang IP!",
    loginWithDiscord: "Mag-login gamit ang Discord",
    adminPanel: "Admin Panel",
    logout: "Mag-logout",
    staffTitle: "Ang aming Dedicated Team",
    applyTitle: "Sumali sa aming Team",
    saveChanges: "I-save ang mga Pagbabago",
    addTab: "Magdagdag ng Bagong Tab",
    editTab: "I-edit ang Tab",
    deleteTab: "I-delete ang Tab",
    siteSettings: "Settings ng Site",
    serverName: "Pangalan ng Server",
    serverIp: "Server IP",
    discordUrl: "Discord URL",
    applyUrl: "Apply URL",
    home: "Bahay",
    apply: "Mag-apply",
    staff: "Mga Staff",
    admin: "Admin"
  }
};
