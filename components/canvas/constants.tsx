import { 
  Cpu, 
  Scales, 
  Shield, 
  Cube, 
  Lightning, 
  Browsers, 
  Clock, 
  Database, 
  Files, 
  HardDrives, 
  Warehouse, 
  MagnifyingGlass, 
  Queue, 
  Broadcast, 
  Waves, 
  Envelope, 
  Globe, 
  TreeStructure, 
  Cloud, 
  ArrowsLeftRight, 
  IdentificationCard, 
  Key, 
  Wall, 
  Certificate, 
  ChartLine, 
  Scroll, 
  Binoculars, 
  User, 
  Plugs 
} from "@phosphor-icons/react";

// Define a mapping of icon names to components
export const ICON_MAP = {
  Cpu,
  Scales,
  Shield,
  Cube,
  Lightning,
  Browsers,
  Clock,
  Database,
  Files,
  HardDrives,
  Warehouse,
  MagnifyingGlass,
  Queue,
  Broadcast,
  Waves,
  Envelope,
  Globe,
  TreeStructure,
  Cloud,
  ArrowsLeftRight,
  IdentificationCard,
  Key,
  Wall,
  Certificate,
  ChartLine,
  Scroll,
  Binoculars,
  User,
  Plugs
};

// Define the structure for a node item
export interface NodeItem {
  label: string;
  iconName: keyof typeof ICON_MAP;
  color: string;
  imageSrc?: string; // For items that use images instead of Phosphor icons (e.g. Postgres)
}

// Define the structure for a category
export interface NodeCategory {
  id: string;
  label: string;
  iconName: keyof typeof ICON_MAP;
  color: string;
  items: NodeItem[];
}

export const NODE_CATEGories: NodeCategory[] = [
  {
    id: "compute",
    label: "Compute & Logic",
    iconName: "Cpu",
    color: "#FF2F9F",
    items: [
      { label: "Load Balancer", iconName: "Scales", color: "#FF2F9F" },
      { label: "API Gateway", iconName: "Shield", color: "#FF2F9F" },
      { label: "Microservice", iconName: "Cube", color: "#FF2F9F" },
      { label: "Serverless Function", iconName: "Lightning", color: "#FF2F9F" },
      { label: "Monolith App", iconName: "Browsers", color: "#FF2F9F" },
      { label: "Scheduler/Worker", iconName: "Clock", color: "#FF2F9F" },
    ]
  },
  {
    id: "data",
    label: "Data & Storage",
    iconName: "Database",
    color: "#2FC1FF",
    items: [
      { label: "Relational DB", iconName: "Database", color: "#2FC1FF", imageSrc: "/postgresql.png" },
      { label: "NoSQL DB", iconName: "Files", color: "#2FC1FF" },
      { label: "Cache", iconName: "Database", color: "#2FC1FF", imageSrc: "/redis.png" },
      { label: "Object Storage", iconName: "HardDrives", color: "#2FC1FF" },
      { label: "Data Warehouse", iconName: "Warehouse", color: "#2FC1FF" },
      { label: "Search Engine", iconName: "MagnifyingGlass", color: "#2FC1FF" },
    ]
  },
  {
    id: "messaging",
    label: "Messaging & Streaming",
    iconName: "Broadcast",
    color: "#BF34D6",
    items: [
      { label: "Message Queue", iconName: "Queue", color: "#BF34D6" },
      { label: "Pub/Sub Topic", iconName: "Broadcast", color: "#BF34D6" },
      { label: "Event Stream", iconName: "Waves", color: "#BF34D6" },
      { label: "Email Service", iconName: "Envelope", color: "#BF34D6" },
    ]
  },
  {
    id: "network",
    label: "Network & Edge",
    iconName: "Globe",
    color: "#28F0CC",
    items: [
      { label: "VPC / Network", iconName: "Globe", color: "#28F0CC" },
      { label: "Subnet", iconName: "TreeStructure", color: "#28F0CC" },
      { label: "CDN", iconName: "Cloud", color: "#28F0CC" },
      { label: "DNS / Domain", iconName: "Globe", color: "#28F0CC" },
      { label: "NAT Gateway", iconName: "ArrowsLeftRight", color: "#28F0CC" },
    ]
  },
  {
    id: "security",
    label: "Security & Identity",
    iconName: "Shield",
    color: "#46E84C",
    items: [
      { label: "Identity Provider", iconName: "IdentificationCard", color: "#46E84C" },
      { label: "Secrets Manager", iconName: "Key", color: "#46E84C" },
      { label: "WAF", iconName: "Wall", color: "#46E84C" },
      { label: "Certificate / SSL", iconName: "Certificate", color: "#46E84C" },
    ]
  },
  {
    id: "observability",
    label: "Observability",
    iconName: "ChartLine",
    color: "#FF802F",
    items: [
      { label: "Logging Service", iconName: "Scroll", color: "#FF802F" },
      { label: "Metrics / Monitoring", iconName: "ChartLine", color: "#FF802F" },
      { label: "Tracing", iconName: "Binoculars", color: "#FF802F" },
    ]
  },
  {
    id: "external",
    label: "External & Users",
    iconName: "User",
    color: "#FF2F5B",
    items: [
      { label: "End User / Client", iconName: "User", color: "#FF2F5B" },
      { label: "3rd Party API", iconName: "Plugs", color: "#FF2F5B" },
    ]
  }
];

export const getNodeConfig = (label: string): NodeItem | undefined => {
  for (const category of NODE_CATEGories) {
    const item = category.items.find((i) => i.label === label);
    if (item) return item;
  }
  return undefined;
};
