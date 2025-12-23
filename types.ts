
export type Language = 'en' | 'es' | 'tl';

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
  label: Record<Language, string>;
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
  ownerRoleId: string; // Added owner role support
  applyLink: string;
  languages: Language[];
  staff: StaffMember[];
  tabs: Tab[];
  heroText: Record<Language, string>;
  heroSubtext: Record<Language, string>;
  applications: HelperApplication[];
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
  discordId?: string;
}
