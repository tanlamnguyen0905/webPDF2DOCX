---
**Ngày**: 2026-06-27
**Phiên bản**: 2.0
**Mục tiêu**: Tài liệu kiến trúc kỹ thuật cho website Convert PDF to Word
**Tác giả**: Claude
**Tóm tắt**: Kiến trúc hệ thống được thiết kế cho mục đích thương mại hóa, chịu tải cao, tối ưu chi phí dựa trên AWS Cloud
---

# Kiến trúc kỹ thuật - Convert PDF to Word

Technical Architecture Design

---

## 1. Tổng quan kiến trúc

### 1.1. Mục tiêu thiết kế

| Tiêu chí | Mục tiêu | Giải pháp |
|----------|----------|-----------|
| Thương mại hóa | Hỗ trợ thanh toán trực tuyến, gói thành viên | MoMo/VNPAY + Subscription billing |
| Chịu tải cao | 99.99% uptime, auto-scaling | Multi-AZ + ALB + ECS Auto Scaling |
| Tối ưu chi phí | Giảm 50% chi phí infrastructure | Spot Instance + Reserved DB + S3 Lifecycle |
| Bảo mật | Bảo vệ user data, file, giao dịch | WAF + Shield + SSE-KMS + Virus Scan |

### 1.2. Kiến trúc tổng quan (High-Level Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js (Vercel/CloudFront)  │  Mobile Web  │  Third-party API consumers  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDGE LAYER (AWS)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  CloudFront CDN  │  WAF  │  Route 53 (DNS)  │  AWS Shield (DDoS)           │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER (ECS Fargate)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │   ALB (Load         │    │   Spring Boot API   │    │  Auto Scaling   │  │
│  │   Balancer)         │───▶│   (Multiple Tasks)  │    │  (CPU/Memory)   │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────┘  │
│                                       │                                      │
│                                       ▼                                      │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │   ElastiCache       │    │   SQS Queue         │    │  CloudWatch     │  │
│  │   Redis (Cache)     │    │   (Standard + DLQ)  │    │  Logs/Metrics   │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────┘  │
│                                       │                                      │
│                                       ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    Python Worker (ECS Fargate Spot)                     ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  ││
│  │  │  Consumer   │  │  PDF→DOCX   │  │  OCR        │  │  Auto-scale   │  ││
│  │  │  (SQS)      │  │  Converter  │  │  (Tesseract)│  │  (Queue depth)│  ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER (AWS)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │   RDS MySQL         │    │   S3 Bucket         │    │  Secrets        │  │
│  │   (Multi-AZ)        │    │   (Intelligent-     │    │  Manager        │  │
│  │   + Read Replica    │    │    Tiering)         │    │  (JWT secret)   │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  MoMo API  │  VNPAY API  │  SES (Email)  │  LLM API (Chatbot)  │  ClamAV   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1. Local Development

| Layer | Công nghệ | Mục đích |
|-------|-----------|----------|
| Frontend | Next.js 14 (App Router) | SSR, SEO, UI |
| Backend | Spring Boot 3 (Java 17) | REST API, Business Logic |
| Database | MySQL 8 (Docker) | Lưu trữ dữ liệu |
| Storage | LocalStack S3 | Mô phỏng S3 |
| Queue | LocalStack SQS | Mô phỏng SQS |
| Worker | Python 3.11 + Celery | Xử lý convert PDF→DOCX |
| Cache | Redis (Docker) | Cache, Session |

### 2.2. Production (AWS)

| Layer | Công nghệ | Spec | Mục đích |
|-------|-----------|------|-----------|
| CDN | CloudFront | - | Cache static assets, Global edge |
| DNS | Route 53 | 1 hosted zone | DNS management, Health check |
| WAF | AWS WAF | Web ACL | Bảo mệt chống SQLi, XSS, Rate limit |
| Load Balancer | ALB | Multi-AZ | Phân tải, Health check |
| Frontend | Next.js | Vercel hoặc S3+CloudFront | SSR, SEO |
| API | Spring Boot 3 | ECS Fargate, 2+ tasks | REST API |
| Worker | Python 3.11 | ECS Fargate Spot | Convert PDF→DOCX |
| Database | MySQL 8 | RDS db.t3.medium, Multi-AZ, Read Replica | Dữ liệu |
| Cache | Redis | ElastiCache cache.t3.micro | Cache, Session, Rate limit |
| Queue | SQS | Standard + Dead Letter Queue | Hàng đợi tác vụ |
| Storage | S3 | Intelligent-Tiering, Lifecycle | File PDF/DOCX |
| Secrets | Secrets Manager | - | JWT secret, API keys |
| Email | SES | - | Gửi email thông báo |
| Monitoring | CloudWatch | Logs, Metrics, Alarms | Observability |

---

## 3. Chi tiết từng Layer

### 3.1. Client Layer

#### Next.js Frontend
- **Triển khai**: Vercel (đơn giản) hoặc S3 + CloudFront (kiểm soát nhiều hơn)
- **Rendering**: SSR cho trang landing, CSR cho dashboard
- **Responsive**: Tailwind CSS, hỗ trợ mobile/tablet/desktop
- **API Client**: Axios với interceptors cho JWT refresh

#### Third-party API Consumers
- **API Key**: Mỗi partner có API key riêng
- **Rate Limit**: 1000 req/min/key
- **Authentication**: API Key + Secret
- **Documentation**: Swagger/OpenAPI 3.0

### 3.2. Edge Layer

#### CloudFront CDN
- **Origins**: S3 (static assets) + ALB (dynamic)
- **Cache Behavior**:
  - `/static/*`: Cache 1 năm
  - `/api/*`: Không cache
  - `/uploads/*`: Cache 1 giờ
- **Price Class**: Use Only North America and Europe (chi phí thấp hơn)

#### AWS WAF
- **Rules**:
  - Rate limit: 2000 req/5min/IP
  - SQL injection protection
  - XSS protection
  - AWS Managed Rules (Common Rule Set)
- **Action**: Block + Log + Alert

#### Route 53
- **Health Check**: Kiểm tra ALB endpoint
- **Failover**: Nếu primary region down → secondary region
- **Routing**: Simple routing cho MVP, Latent routing cho multi-region sau

#### AWS Shield
- **Standard**: Miễn phí, bảo vệ khỏi DDoS cơ bản
- **Advanced**: Tùy chọn nếu cần bảo vệ nâng cao ($3000/tháng)

### 3.3. Application Layer

#### Application Load Balancer (ALB)
- **Scheme**: Internet-facing
- **Listeners**: HTTP (redirect to HTTPS), HTTPS (443)
- **Target Group**: Spring Boot tasks
- **Health Check**: `/api/health` mỗi 30s
- **Multi-AZ**: Deploy ở 2+ AZ

#### Spring Boot API
- **Framework**: Spring Boot 3.x, Java 17
- **Container**: Docker, 0.5 vCPU, 1GB RAM
- **Tasks**: Minimum 2 tasks, Auto Scaling 2-10 tasks
- **Auto Scaling Policy**:
  - CPU > 70% → scale out
  - CPU < 30% → scale in
  - Target tracking scaling
- **Authentication**: JWT (access token 15min, refresh token 7 ngày)
- **Authorization**: Role-based (USER, ADMIN, SUPPORT)
- **API Versioning**: `/api/v1/`, `/api/v2/`

#### Python Worker
- **Framework**: Celery + Python 3.11
- **Container**: Docker, 1 vCPU, 2GB RAM (cần nhiều RAM cho convert)
- **Deployment**: ECS Fargate Spot (tiết kiệm 70% chi phí)
- **Auto Scaling**: Dựa trên SQS queue depth
  - Queue depth > 10 → scale out
  - Queue depth < 5 → scale in
- **Spot Interruption Handling**: Graceful shutdown, checkpoint task
- **Conversion Libraries**:
  - PDF→DOCX: `python-docx`, `pdfplumber`, `PyMuPDF`
  - OCR: `Tesseract` hoặc `AWS Textract`
  - Virus Scan: `ClamAV`

#### ElastiCache Redis
- **Node Type**: cache.t3.micro
- **Use Cases**:
  - Cache user profile (TTL: 5 phút)
  - Cache conversion result metadata (TTL: 1 giờ)
  - Rate limiting counter
  - Session storage (nếu cần)
- **Eviction Policy**: `volatile-lru`

#### SQS Queue
- **Standard Queue**: Conversion tasks
  - Visibility Timeout: 10 phút
  - Message Retention: 4 ngày
  - Max Receive Count: 3 (retry 3 lần rồi vào DLQ)
- **Dead Letter Queue (DLQ)**: Task thất bại
  - Retention: 14 ngày
  - Alarm khi có message trong DLQ

### 3.4. Data Layer

#### RDS MySQL
- **Instance**: db.t3.medium (2 vCPU, 4GB RAM)
- **Multi-AZ**: Có (synchronous replication)
- **Read Replica**: 1 replica cho read-heavy queries
- **Storage**: 100GB gp3 (burstable)
- **Backup**: Automated backup 7 ngày, manual snapshot trước deploy
- **Connection Pooling**: HikariCP (Spring Boot)
  - Max pool size: 20
  - Min idle: 5
  - Connection timeout: 30s
- **Migration**: Flyway
- **Reserved Instance**: 1-year, No Upfront (tiết kiệm ~40%)

#### S3 Bucket
- **Storage Class**: Intelligent-Tiering
  - Frequent Access: 0-30 ngày
  - Infrequent Access: 30-90 ngày
  - Archive: 90+ ngày
- **Lifecycle Policy**:
  - Free tier files (miễn phí): Xóa sau 1 giờ
  - Premium files (coin): Xóa sau 24 giờ
  - Original PDF: Xóa sau 7 ngày
- **Encryption**: SSE-S3 (hoặc SSE-KMS nếu cần)
- **Versioning**: Tắt (tránh tốn chi phí)
- **CORS**: Chỉ cho phép domain của web
- **Pre-signed URL**: Dùng cho download, hết hạn sau 5 phút

#### Secrets Manager
- **Secrets**:
  - `jwt-secret` (rotate 30 ngày)
  - `momo-api-key`
  - `vnpay-api-key`
  - `db-password`
  - `llm-api-key`
- **Rotation**: Tự động rotate JWT secret mỗi 30 ngày

### 3.5. External Integrations

#### MoMo Payment
- **API**: MoMo Payment API v2
- **Flow**:
  1. User chọn gói coin → gửi request tạo giao dịch
  2. Backend tạo MoMo order → trả về payUrl
  3. User thanh toán qua app MoMo
  4. MoMo callback → backend xác nhận → cộng coin
- **Sandbox**: Dùng cho development/testing
- **IP Whitelist**: Chỉ cho phép IP từ MoMo gọi callback

#### VNPAY Payment
- **API**: VNPAY Payment Gateway
- **Flow**:
  1. User chọn gói coin → backend tạo VNPAY URL
  2. Redirect user đến VNPAY
  3. VNPAY return → backend kiểm tra checksum
  4. Cộng coin nếu thành công
- **Checksum**: SHA256 với secret key

#### AWS SES (Email)
- **Use Cases**:
  - Email verification khi đăng ký
  - Reset password
  - Thông báo convert hoàn tất
  - Xác nhận nạp coin
- **Sending Limits**: 14 emails/giờ (cần request increase nếu lớn hơn)
- **Configuration Set**: Tracking opens, clicks

#### LLM API (Chatbot AI)
- **Provider**: Claude API hoặc GPT-4
- **Use Case**: Chatbot trả lời FAQ
- **Knowledge Base**: FAQ về upload, convert, coin, lỗi thường gặp
- **Escalate**: Nếu không trả lời được → chuyển sang support viên
- **Rate Limit**: 10 req/min/user

#### ClamAV (Virus Scanning)
- **Deployment**: Docker container trên worker hoặc Lambda
- **Flow**: Worker scan file trước khi convert
- **Action**: Nếu phát hiện virus → xóa file, thông báo user, log incident

---

## 4. Security Architecture

### 4.1. Network Security

| Component | Security |
|-----------|----------|
| VPC | Multi-AZ, public + private subnets |
| Public Subnet | ALB, NAT Gateway |
| Private Subnet | Spring Boot, Worker, RDS, ElastiCache |
| Security Group | Least privilege, chỉ mở port cần thiết |
| NACL | Restrict traffic giữa subnets |

### 4.2. Application Security

| Threat | Protection |
|--------|------------|
| Brute force auth | Rate limit 5 attempts/15min, lock account |
| SQL Injection | JPA parameterized queries, input validation |
| XSS | Helmet.js, CSP header, input sanitization |
| CSRF | SameSite cookie, CSRF token |
| JWT theft | httpOnly cookie, short-lived access token |
| File upload attack | Magic bytes check, virus scan, size limit |
| DDoS | AWS Shield, WAF rate limit |

### 4.3. Data Security

| Data | Protection |
|------|------------|
| Password | bcrypt hashing (cost factor 12) |
| File on S3 | SSE-S3 encryption |
| Database | Encryption at rest (RDS default) |
| Traffic | TLS 1.2+ |
| API | HTTPS only |
| Secrets | AWS Secrets Manager, rotate regularly |

### 4.4. Access Control

| Role | Permissions |
|------|-------------|
| GUEST | Xem landing page, convert miễn phí (giới hạn) |
| USER | Upload, convert, xem lịch sử, nạp coin |
| SUPPORT | Xem khiếu nại, chat hỗ trợ (không quản lý coin/user) |
| ADMIN | Quản lý toàn bộ hệ thống |

---

## 5. Monitoring & Observability

### 5.1. CloudWatch

#### Logs
- **Log Groups**: `/ecs/spring-boot-api`, `/ecs/python-worker`
- **Retention**: 30 ngày
- **Format**: JSON structured logging
- **Fields**: timestamp, level, module, message, userId, requestId, duration

#### Metrics
- **Custom Metrics**:
  - `ConversionSuccessCount`
  - `ConversionFailureCount`
  - `ConversionDuration`
  - `CoinTransactionCount`
  - `ActiveUserCount`
  - `QueueDepth`
- **Built-in Metrics**:
  - ECS CPU/Memory utilization
  - ALB request count, latency
  - RDS CPU, connections, read/write latency
  - SQS queue depth, message age

#### Alarms
| Alarm | Threshold | Action |
|-------|-----------|--------|
| High CPU | > 80% for 5 min | Scale out |
| High Queue Depth | > 100 for 5 min | Scale out worker |
| High Error Rate | > 5% for 5 min | Alert via SNS |
| DLQ has messages | > 0 | Alert admin |
| RDS High Connections | > 80% max | Alert |
| API Latency | > 2s p95 | Alert |

### 5.2. Dashboards

#### Operations Dashboard
- ECS service health
- Queue depth over time
- Worker scaling events
- Error rate

#### Business Dashboard
- Daily/Monthly conversions
- Coin usage
- Revenue from coin purchases
- Active users

### 5.3. Alerting

- **SNS Topic**: `pdf-converter-alerts`
- **Subscribers**: Admin email, Slack webhook (optional)
- **Escalation**: Critical alert → email + SMS (nếu có)

---

## 6. CI/CD Pipeline

### 6.1. Pipeline Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │───▶│  GitHub     │───▶│   Build     │───▶│   Deploy    │
│   Push      │    │  Actions    │    │   Docker    │    │   to ECS    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Tests     │
                  │   Lint      │
                  │   Security  │
                  └─────────────┘
```

### 6.2. GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Run unit tests (Spring Boot)
      - Run unit tests (Python worker)
      - Run linting
      - Run security scan (Snyk)

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker images
      - Push to ECR
      - Run Trivy vulnerability scan

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Deploy to ECS staging
      - Run smoke tests

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - Deploy to ECS production (rolling update)
      - Verify health check
      - Notify team
```

### 6.3. Deployment Strategy

- **Strategy**: Rolling update
- **Min Healthy Percent**: 100%
- **Max Percent**: 200%
- **Health Check Grace Period**: 60s
- **Rollback**: Automatic nếu health check fail

### 6.4. Database Migration

- **Tool**: Flyway
- **Location**: `src/main/resources/db/migration/`
- **Naming**: `V{version}__{description}.sql`
- **Baseline**: `flyway baseline` cho existing DB
- **Validation**: `flyway validate` trước mỗi deploy

---

## 7. Cost Optimization

### 7.1. Chi phí ước tính hàng tháng

| Service | Spec | USD/tháng | Optimization |
|---------|------|-----------|--------------|
| CloudFront | 1TB transfer | $85 | Cache aggressively |
| ALB | 1 ALB + LCU | $22 | |
| WAF | Web ACL + rules | $15 | |
| Route 53 | 1 hosted zone | $0.5 | |
| ECS Fargate (API) | 2 tasks, 0.5vCPU, 1GB | $60 | Auto-scale 2-10 |
| ECS Fargate Spot (Worker) | 0.5vCPU, 1GB | $30 | Spot saves 70% |
| RDS MySQL | db.t3.medium, Multi-AZ | $90 | Reserved saves 40% |
| ElastiCache Redis | cache.t3.micro | $15 | |
| SQS | 1M requests | $0.4 | |
| S3 | 100GB | $2.3 | Intelligent-Tiering |
| Secrets Manager | 10 secrets | $4 | |
| SES | 10K emails | $1 | |
| CloudWatch | Logs + Metrics | $10 | |
| **Tổng** | | **~$335/tháng** | |

### 7.2. Cost Optimization Strategies

| Strategy | Savings | Implementation |
|----------|---------|----------------|
| ECS Fargate Spot (Worker) | ~70% | Spot capacity provider |
| RDS Reserved Instance | ~40% | 1-year, No Upfront |
| S3 Intelligent-Tiering | ~30% | Auto tiering |
| CloudFront caching | ~50% origin | Cache static assets |
| Right-sizing | ~20% | Monitor and adjust |
| Scale to zero (Worker) | Variable | Scale khi queue empty |

### 7.3. Cost Monitoring

- **AWS Budgets**: Set monthly budget $400, alert at 80%
- **Cost Explorer**: Weekly review
- **Tagging**: All resources tagged with `Project: pdf-converter`, `Environment: production`

---

## 8. Disaster Recovery

### 8.1. Backup Strategy

| Data | Backup | Retention | Method |
|------|--------|-----------|--------|
| RDS MySQL | Automated daily | 7 days | AWS Backup |
| RDS MySQL | Manual before deploy | 30 days | Snapshot |
| S3 | Versioning OFF, Cross-region replication | - | CRR to secondary region |
| Secrets | Automatic rotation | - | Secrets Manager |

### 8.2. Recovery Strategy

| Scenario | RTO | RPO | Action |
|----------|-----|-----|--------|
| Single AZ failure | 1 phút | 0 | Multi-AZ tự động failover |
| Region failure | 30 phút | 1 giờ | Failover to secondary region |
| Data corruption | 1 giờ | 24 giờ | Restore from snapshot |
| Complete disaster | 4 giờ | 24 giờ | Rebuild from backup |

### 8.3. Rollback Strategy

- **Application**: ECS rolling update, automatic rollback nếu health check fail
- **Database**: Flyway undo scripts (nếu có), restore snapshot
- **Infrastructure**: Terraform state, có thể revert

---

## 9. Local Development Setup

### 9.1. Prerequisites

```bash
# Required tools
- Node.js 18+
- Java 17 (OpenJDK)
- Python 3.11
- Docker Desktop
- AWS CLI (configured)
```

### 9.2. Docker Compose

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: pdf_converter
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  localstack:
    image: localstack/localstack:latest
    environment:
      SERVICES: s3,sqs
      DEFAULT_REGION: ap-southeast-1
    ports:
      - "4566:4566"

  spring-boot:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
      - localstack

  worker:
    build: ./worker
    depends_on:
      - redis
      - localstack

  nextjs:
    build: ./frontend
    ports:
      - "3000:3000"
```

### 9.3. Environment Variables

```bash
# .env.local
DATABASE_URL=jdbc:mysql://localhost:3306/pdf_converter
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:4566
SQS_ENDPOINT=http://localhost:4566
JWT_SECRET=local-dev-secret-change-in-production
```

---

## 10. Roadmap & Milestones

### Phase 1: MVP (2-3 tuần)
- Local development setup
- Basic auth (register, login)
- Upload PDF, convert miễn phí
- Simple admin panel

### Phase 2: Production Deployment (1-2 tuần)
- AWS infrastructure setup (Terraform)
- CI/CD pipeline
- Production deployment
- Monitoring & alerting

### Phase 3: Payment Integration (2 tuần)
- MoMo integration
- VNPAY integration
- Coin management
- Subscription billing

### Phase 4: Scale & Optimize (2 tuần)
- SQS queue integration
- Worker auto-scaling
- Cost optimization
- Performance tuning

### Phase 5: Advanced Features (3-4 tuần)
- OCR integration
- Chatbot AI
- Real-time support chat
- Third-party API

---

## 11. Liên kết đến các file liên quan

- `done/TechSpec/requires.md` – Tài liệu yêu cầu hệ thống
- `done/TechSpec/task_now.md` – Danh sách task MVP
- `done/TechSpec/task_future.md` – Danh sách task nâng cao
- `done/TechSpec/schema.md` – Thiết kế cấu trúc dữ liệu
- `done/TechSpec/analystic_system.md` – Phân tích hệ thống, kiến trúc tầng
- `done/backend/api_spec.md` – Đặc tả REST API
- `done/UI_UX_Design/` – Thiết kế UI/UX

---

## 12. Phản ánh thay đổi

| Phiên bản | Ngày | Thay đổi | Lý do |
|---------|-----|--------|--------|
| 1.0 | 2026-06-27 | Khởi tạo ban đầu | Chỉ có 2 dòng mô tả công nghệ |
| 2.0 | 2026-06-27 | Viết lại hoàn chỉnh | Thêm HA, security, monitoring, cost optimization, CI/CD, DR |
