// Idioma único: Español
export type Language = 'es';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  PLAYER = 'PLAYER'
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
}

export interface Tab {
  id: string;
  label: string;          // Antes: Record<Language, string>
  path: string;
  content: string;
  isVisible: boolean;
  isDeletable: boolean;
  minRole?: UserRole;
}

export interface HelperApplication {
  id: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  data: Record<string, string>;
}

export interface SiteConfig {
  serverName: string;
  serverIp: string;
  discordLink: string;
  discordWebhookUrl: string;
  discordBotToken: string;
  discordGuildId: string;
  discordRoleId: string;
  ownerRoleId: string;
  applyLink: string;
  languages: Language[];  // ['es']
  staff: StaffMember[];
  tabs: Tab[];
  heroText: string;       // Antes: Record<Language, string>
  heroSubtext: string;    // Antes: Record<Language, string>
  applications: HelperApplication[];
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
  discordId?: string;
}
