import { SiteConfig } from './types';
import { ENV } from './env';

export const INITIAL_CONFIG: SiteConfig = {
  serverName: "HYDROMC",
  serverIp: "NO DISPONIBLE",
  discordLink: "https://discord.gg/hydromc",
  discordWebhookUrl: "",
  discordBotToken: ENV.DISCORD_BOT_TOKEN,
  discordGuildId: ENV.DISCORD_GUILD_ID,
  discordRoleId: ENV.ADMIN_ROLE_ID,
  ownerRoleId: ENV.OWNER_ROLE_ID,
  applyLink: "/apply",
  languages: ['es'],

  staff: [
    {
      id: "1",
      name: "AdminZero",
      role: "Owner",
      avatar: "https://api.mineatar.io/face/AdminZero?scale=16",
      description: "Fundador y desarrollador principal del Core de HydroMC."
    },
    {
      id: "2",
      name: "Nexus",
      role: "Developer",
      avatar: "https://api.mineatar.io/face/Nexus?scale=16",
      description: "Arquitecto de sistemas e ingeniero backend."
    }
  ],

  tabs: [
    {
      id: "home",
      label: { es: "Inicio" },
      path: "/",
      content: "",
      isVisible: true,
      isDeletable: false
    },
    {
      id: "apply",
      label: { es: "Postular" },
      path: "/apply",
      content: "",
      isVisible: true,
      isDeletable: true
    },
    {
      id: "staff",
      label: { es: "Staff" },
      path: "/staff",
      content: "",
      isVisible: true,
      isDeletable: true
    }
  ],

  heroText: {
    es: "Bienvenido a HydroMC"
  },

  heroSubtext: {
    es: "La experiencia de supervivencia definitiva te espera."
  },

  applications: []
};

export const TRANSLATIONS = {
  es: {
    joinDiscord: "Unirse al servidor de Discord",
    copyIp: "Copiar IP del servidor",
    ipCopied: "¡IP copiada!",
    loginWithDiscord: "Iniciar sesión con Discord",
    adminPanel: "Panel de administración",
    logout: "Cerrar sesión",
    staffTitle: "Nuestro equipo",
    applyTitle: "Únete a nuestro equipo",
    saveChanges: "Guardar cambios",
    addTab: "Agregar nueva pestaña",
    editTab: "Editar pestaña",
    deleteTab: "Eliminar pestaña",
    siteSettings: "Configuración del sitio",
    serverName: "Nombre del servidor",
    serverIp: "IP del servidor",
    discordUrl: "URL de Discord",
    applyUrl: "URL de postulación",
    home: "Inicio",
    apply: "Postular",
    staff: "Staff",
    admin: "Administrador"
  }
};
