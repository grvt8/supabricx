export interface NodeDefaultConfig {
  type: 'service' | 'database' | 'gateway' | 'base';
  data: Record<string, unknown>;
  icon?: unknown; // We store the icon component or name here if needed for sidebar
}

export const NODE_DEFAULTS: Record<string, NodeDefaultConfig> = {
  // Compute & Logic
  "Load Balancer": {
    type: "gateway",
    data: { label: "Load Balancer", type: "Load Balancer", routes: "5 targets", rateLimit: "Unlimited" }
  },
  "API Gateway": {
    type: "gateway",
    data: { label: "API Gateway", type: "API Gateway", routes: "12 routes", rateLimit: "1000 req/min" }
  },
  "Microservice": {
    type: "service",
    data: { label: "Microservice", language: "Node.js", port: ":8080", status: "ok", instances: 1 }
  },
  "Serverless Function": {
    type: "service",
    data: { label: "Lambda Function", language: "Python", port: "-", status: "ok", instances: "Auto" }
  },
  "Monolith App": {
    type: "service",
    data: { label: "Monolith", language: "Java", port: ":8000", status: "ok", instances: 1 }
  },
  "Scheduler/Worker": {
    type: "service",
    data: { label: "Worker", language: "Go", port: "-", status: "ok", instances: 1 }
  },

  // Data & Storage
  "Relational DB": {
    type: "database",
    data: { label: "PostgreSQL", type: "Relational", connection: "postgres://...", storage: "100GB", replicas: "1 primary" }
  },
  "NoSQL DB": {
    type: "database",
    data: { label: "MongoDB", type: "NoSQL", connection: "mongodb://...", storage: "500GB", replicas: "3 nodes" }
  },
  "Cache": {
    type: "database",
    data: { label: "Redis", type: "Cache", connection: "redis://...", storage: "5GB", replicas: "1 node" }
  },
  "Object Storage": {
    type: "database",
    data: { label: "S3 Bucket", type: "Storage", connection: "s3://my-bucket", storage: "Unlimited", replicas: "Multi-AZ" }
  },
  "Data Warehouse": {
    type: "database",
    data: { label: "Snowflake", type: "Warehouse", connection: "jdbc:snowflake...", storage: "10TB", replicas: "Cluster" }
  },
  "Search Engine": {
    type: "database",
    data: { label: "Elasticsearch", type: "Search", connection: "http://es:9200", storage: "2TB", replicas: "3 nodes" }
  },

  // Messaging & Streaming
  "Message Queue": {
    type: "base",
    data: { label: "RabbitMQ", properties: { Type: "Queue", Protocol: "AMQP", Retention: "7 days" } }
  },
  "Pub/Sub Topic": {
    type: "base",
    data: { label: "Kafka Topic", properties: { Type: "Topic", Partitions: "3", Retention: "7 days" } }
  },
  "Event Stream": {
    type: "base",
    data: { label: "Kinesis Stream", properties: { Type: "Stream", Shards: "2", Retention: "24h" } }
  },
  "Email Service": {
    type: "base",
    data: { label: "SES / SendGrid", properties: { Type: "Email", Rate: "10k/day", DedicatedIP: "No" } }
  },

  // Network & Edge
  "VPC / Network": {
    type: "base",
    data: { label: "VPC", properties: { CIDR: "10.0.0.0/16", Region: "us-east-1", Tenancy: "Default" } }
  },
  "Subnet": {
    type: "base",
    data: { label: "Public Subnet", properties: { CIDR: "10.0.1.0/24", AZ: "us-east-1a", Public: "Yes" } }
  },
  "CDN": {
    type: "gateway",
    data: { label: "CloudFront", type: "CDN", routes: "Global", rateLimit: "WAF Enabled" }
  },
  "DNS / Domain": {
    type: "base",
    data: { label: "Route53", properties: { Zone: "example.com", Records: "15", Type: "Public" } }
  },
  "NAT Gateway": {
    type: "gateway",
    data: { label: "NAT Gateway", type: "NAT", routes: "Outbound", rateLimit: "45Gbps" }
  },

  // Security & Identity
  "Identity Provider": {
    type: "base",
    data: { label: "Auth0 / Cognito", properties: { Type: "IdP", Users: "5000+", MFA: "Enabled" } }
  },
  "Secrets Manager": {
    type: "base",
    data: { label: "Vault", properties: { Type: "Secrets", Encryption: "AES-256", Rotation: "30 days" } }
  },
  "WAF": {
    type: "gateway",
    data: { label: "WAF", type: "Firewall", routes: "All Traffic", rateLimit: "Block Bad Bot" }
  },
  "Certificate / SSL": {
    type: "base",
    data: { label: "ACM Cert", properties: { Type: "SSL/TLS", Domain: "*.app.com", Expires: "365 days" } }
  },

  // Observability
  "Logging Service": {
    type: "base",
    data: { label: "CloudWatch / ELK", properties: { Type: "Logs", Retention: "30 days", Index: "Daily" } }
  },
  "Metrics / Monitoring": {
    type: "base",
    data: { label: "Prometheus", properties: { Type: "Metrics", Scrape: "15s", Retention: "15 days" } }
  },
  "Tracing": {
    type: "base",
    data: { label: "Jaeger / X-Ray", properties: { Type: "Tracing", Sample: "10%", Storage: "Elastic" } }
  },

  // External & Users
  "End User / Client": {
    type: "base",
    data: { label: "Web Browser", properties: { Platform: "Web/Mobile", Auth: "JWT", Region: "Global" } }
  },
  "3rd Party API": {
    type: "base",
    data: { label: "Stripe API", properties: { Type: "External", Auth: "API Key", RateLimit: "Yes" } }
  }
};
