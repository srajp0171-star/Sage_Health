import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface DynamicIconProps extends LucideProps {
  name: string
}

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Globe:           LucideIcons.Globe,
  Calendar:        LucideIcons.Calendar,
  LayoutDashboard: LucideIcons.LayoutDashboard,
  Stethoscope:     LucideIcons.Stethoscope,
  FileText:        LucideIcons.FileText,
  Receipt:         LucideIcons.Receipt,
  Pill:            LucideIcons.Pill,
  TestTube:        LucideIcons.TestTube,
  Hash:            LucideIcons.Hash,
  BedDouble:       LucideIcons.BedDouble,
  User:            LucideIcons.User,
  Smartphone:      LucideIcons.Smartphone,
  ClipboardList:   LucideIcons.ClipboardList,
  Video:           LucideIcons.Video,
  FilePen:         LucideIcons.FilePen,
  Bell:            LucideIcons.Bell,
  MessageCircle:   LucideIcons.MessageCircle,
  Users:           LucideIcons.Users,
  Megaphone:       LucideIcons.Megaphone,
  BarChart2:       LucideIcons.BarChart2,
  ShieldCheck:     LucideIcons.ShieldCheck,
  Building2:       LucideIcons.Building2,
  Plug:            LucideIcons.Plug,
  Settings:        LucideIcons.Settings,
  Heart:           LucideIcons.Heart,
  TrendingUp:      LucideIcons.TrendingUp,
  Shield:          LucideIcons.Shield,
  HelpCircle:      LucideIcons.HelpCircle,
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const Icon = ICON_MAP[name] ?? ICON_MAP.HelpCircle
  return <Icon {...props} />
}
