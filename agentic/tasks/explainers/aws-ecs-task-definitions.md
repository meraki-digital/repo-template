# AWS ECS Task Definitions

**Category:** Infrastructure  
**Official Docs:** [https://docs.aws.amazon.com/ecs/latest/developerguide/task_definitions.html](https://docs.aws.amazon.com/ecs/latest/developerguide/task_definitions.html)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

AWS ECS Task Definitions are JSON templates that describe how a Docker container should run in Amazon ECS. They specify the container image, CPU/memory requirements, networking configuration, environment variables, and other settings needed to launch containers. Task definitions are versioned blueprints that define the runtime environment for your applications.

Think of task definitions as detailed recipes for your containerized applications. Just as a cooking recipe specifies ingredients, amounts, and cooking instructions, a task definition specifies the Docker image, resources, environment, and runtime configuration needed to run your application in ECS.

---

## Why We're Using It In This Project

Task definitions provide the configuration foundation for our containerized applications:

- **Version control**: Track changes to application configuration over time
- **Environment management**: Different configurations for dev, staging, production
- **Resource optimization**: Specify exact CPU/memory needs for cost efficiency
- **Security**: Configure IAM roles, secrets, and networking securely
- **Reusability**: Use same definition across multiple services and tasks
- **Compatibility**: Ensure containers run consistently across environments
- **Documentation**: Self-documenting configuration of application requirements
- **Deployment automation**: Infrastructure as code for container specifications

---

## How We'll Use It

Task definitions will specify our application containers for ECS:

**Example 1: Backend API task definition**
```json
{
    "family": "financial-api",
    "taskRoleArn": "arn:aws:iam::123456789012:role/ECSTaskRole",
    "executionRoleArn": "arn:aws:iam::123456789012:role/ECSTaskExecutionRole",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "512",
    "memory": "1024",
    "containerDefinitions": [
        {
            "name": "api",
            "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/financial-api:latest",
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 8000,
                    "protocol": "tcp"
                }
            ],
            "environment": [
                {"name": "ENVIRONMENT", "value": "production"},
                {"name": "LOG_LEVEL", "value": "INFO"}
            ],
            "secrets": [
                {
                    "name": "DATABASE_URL",
                    "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:db-connection"
                },
                {
                    "name": "OPENAI_API_KEY",
                    "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:openai-key"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/financial-api",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            },
            "healthCheck": {
                "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            }
        }
    ]
}
```

**Example 2: ETL job task definition**
```json
{
    "family": "financial-etl",
    "taskRoleArn": "arn:aws:iam::123456789012:role/ECSETLRole",
    "executionRoleArn": "arn:aws:iam::123456789012:role/ECSTaskExecutionRole",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "1024",
    "memory": "2048",
    "containerDefinitions": [
        {
            "name": "etl",
            "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/financial-etl:latest",
            "essential": true,
            "environment": [
                {"name": "JOB_TYPE", "value": "sage_import"},
                {"name": "BATCH_SIZE", "value": "1000"}
            ],
            "secrets": [
                {
                    "name": "DATABASE_URL",
                    "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:db-connection"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/financial-etl",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            },
            "mountPoints": [
                {
                    "sourceVolume": "tmp-data",
                    "containerPath": "/tmp/data",
                    "readOnly": false
                }
            ]
        }
    ],
    "volumes": [
        {
            "name": "tmp-data",
            "efsVolumeConfiguration": {
                "fileSystemId": "fs-12345678",
                "rootDirectory": "/data"
            }
        }
    ]
}
```

**Example 3: Multi-container task definition**
```json
{
    "family": "financial-app-suite",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "1024",
    "memory": "2048",
    "containerDefinitions": [
        {
            "name": "api",
            "image": "financial-api:latest",
            "essential": true,
            "portMappings": [{"containerPort": 8000}]
        },
        {
            "name": "worker",
            "image": "financial-worker:latest",
            "essential": false,
            "dependsOn": [
                {"containerName": "api", "condition": "HEALTHY"}
            ]
        },
        {
            "name": "nginx",
            "image": "nginx:alpine",
            "essential": true,
            "portMappings": [{"containerPort": 80}],
            "links": ["api"],
            "dependsOn": [
                {"containerName": "api", "condition": "START"}
            ]
        }
    ]
}
```

**Example 4: Environment-specific definitions**
```json
// Development
{
    "family": "financial-api-dev",
    "cpu": "256",
    "memory": "512",
    "environment": [
        {"name": "ENVIRONMENT", "value": "development"},
        {"name": "DEBUG", "value": "true"}
    ]
}

// Production
{
    "family": "financial-api-prod", 
    "cpu": "1024",
    "memory": "2048",
    "environment": [
        {"name": "ENVIRONMENT", "value": "production"},
        {"name": "DEBUG", "value": "false"}
    ]
}
```

---

## Key Concepts

- **Container Definitions**: Specifications for each container in the task
- **Resource Allocation**: CPU and memory specifications for Fargate
- **IAM Roles**: Task role for application permissions, execution role for ECS
- **Networking**: awsvpc mode for modern networking
- **Secrets Management**: Integration with AWS Secrets Manager

---

## Alternatives We Considered

- **Docker Compose**: Local development only, not for production
- **Kubernetes manifests**: More complex than needed for our use case
- **Manual configuration**: Error-prone and not version controllable
- **CloudFormation only**: Less flexible than task definitions

---

## Getting Started

1. **Write task definition JSON**: Define containers and resources
2. **Register with ECS**: `aws ecs register-task-definition --cli-input-json file://task-def.json`
3. **Update services**: Reference new task definition version
4. **Test deployment**: Run task and verify functionality

---

## Common Patterns & Best Practices

1. **Version naming**: Use semantic versioning for task definitions
2. **Environment separation**: Different definitions for dev/staging/prod
3. **Resource optimization**: Right-size CPU/memory for cost efficiency
4. **Secrets over environment**: Use Secrets Manager for sensitive data
5. **Health checks**: Implement proper container health monitoring

---

## Troubleshooting

**Issue 1:** Task fails to start  
**Solution:** Check resource limits and container dependencies

**Issue 2:** Environment variables not set  
**Solution:** Verify Secrets Manager permissions and ARNs

---

## Learning Resources

**Essential:**
- [Task Definition Parameters](https://docs.aws.amazon.com/ecs/latest/APIReference/API_TaskDefinition.html)
- [Creating Task Definitions](https://docs.aws.amazon.com/ecs/latest/developerguide/create-task-definition.html)

**Recommended:**
- [ECS Task Definition Best Practices](https://aws.amazon.com/blogs/containers/best-practices-for-working-with-amazon-ecs-task-definition-parameters/)
- [Fargate Task Definition Examples](https://docs.aws.amazon.com/ecs/latest/developerguide/example_task_definitions.html)

**Community:**
- [AWS Containers Blog](https://aws.amazon.com/blogs/containers/)
- [ECS Troubleshooting](https://docs.aws.amazon.com/ecs/latest/developerguide/troubleshooting.html)

---

**Related Technologies:**
- [AWS ECS Fargate](aws-ecs-fargate.md) - Runtime environment
- [AWS ECS Services](aws-ecs-services.md) - Service management
- [AWS ECR](aws-ecr.md) - Container registry
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/) - Secrets storage
